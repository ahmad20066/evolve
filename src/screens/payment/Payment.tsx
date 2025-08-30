import { globalStyles } from "@/styles/globalStyles";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
import AddNewCardModal from "./components/addNewCardModal";
import Back from "@/assets/svg/arrow-left.svg";
import RoundButton from "@/components/roundButton";
import { Text, theme } from "@/components/theme";
import { AppNavigationProps } from "@/navigators/navigation";
import BaseButton from "@/components/baseBtn";
import Gpay from "@/assets/svg/GooglePay.svg";
import Apple from "@/assets/svg/apple-pay.svg";
import Paypal from "@/assets/svg/PayPal.svg";
import { useSubscribeMeals } from "@/hooks/useSubscribetoMeal";
import { showToast } from "@/components/toast";
import { useSubscribeExercise } from "@/hooks/useSubscribeExercise";
import { useTranslation } from "react-i18next";
import TextInput from "@/components/textinput";
import { useMealCoupon } from "@/hooks/useMealCoupon";
import { useFitnessCoupon } from "@/hooks/useFitnessCoupon";
import { calculateMonths } from "@/utils/month";
import {
  initConnection,
  PurchaseError,
  requestSubscription,
  validateReceiptIos,
} from "react-native-iap";
import * as IAP from "react-native-iap";
import { CommonActions } from "@react-navigation/native";

const list = [
  { key: 1, sport: "PayPal", icon: <Paypal /> },
  { key: 2, sport: "Google Pay", icon: <Gpay /> },
  { key: 3, sport: "Apple Pay", icon: <Apple /> },
];

let purchaseUpdatedListener;
let purchaseErrorListener;

const Payment = ({ navigation, route }: AppNavigationProps<"Payment">) => {
  const { t } = useTranslation();
  const {
    delivery_id,
    meal_plan_id,
    address,
    package_id,
    pricing_id,
    pay_details,
    productId,
  } = route.params;

  const [visible, setvisible] = useState(false);
  const [active, setactive] = useState(1);
  const [coupon, setcoupon] = useState("");
  const [discount, setdiscount] = useState<number>();
  const [newPrice, setnewPrice] = useState<number>();

  const handleBackToDashboardClicked = React.useCallback(() => {
    setvisible(false);
  }, []);
  const { mutate, isPending } = useSubscribeMeals({
    onSuccess(data) {
      showToast("successToast", data.message, "top");
      navigation.navigate("Checkout", { url: data.payment_url });
    },
    onError(err: any) {
      showToast("errorToast", err.errors[0].message, "top");
    },
  });
  const { mutate: subExercise, isPending: subPending } = useSubscribeExercise({
    onSuccess(data) {
      showToast("successToast", data.message, "top");
      if (Platform.OS === "ios") {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "MainTab" }],
          })
        );
      } else if (Platform.OS === "android") {
        navigation.navigate("Checkout", { url: data.payment_url });
      }
    },
    onError(err: any) {
      showToast("errorToast", err.errors[0].message, "top");
    },
  });
  const { mutate: mealCoupon, isPending: mealPending } = useMealCoupon({
    onSuccess(data) {
      showToast("successToast", data.message, "top");
    },
    onError(err: any) {
      showToast("errorToast", err.errors[0].message, "top");
    },
  });
  const { mutate: fitnessCoupon, isPending: fitnessPending } = useFitnessCoupon(
    {
      onSuccess(data) {
        showToast("successToast", data.message, "top");
        setdiscount(data.discount);
        setnewPrice(data.new_total);
      },
      onError(err: any) {
        showToast("errorToast", err.errors[0].message, "top");
      },
    }
  );

  const handleCouponClicked = useCallback(() => {
    if (package_id != null && pricing_id != null) {
      fitnessCoupon({
        package_id: Number(package_id),
        pricing_id,
        coupon_code: coupon,
      });
    } else {
      mealCoupon({
        meal_plan_id: delivery_id,
        coupon_code: coupon,
      });
    }
  }, [coupon, package_id, pricing_id, delivery_id]);

  const handleConfirmClicked = React.useCallback(() => {
    if (package_id != null && pricing_id != null)
      subExercise({ package_id: package_id, pricing_id, coupon_code: coupon });
    else
      mutate({
        meal_plan_id: meal_plan_id,
        delivery_time_id: delivery_id,
        street: address?.street,
        city: address?.city,
        address_label: address?.address_label,
        building: address?.building,
        postal_code: address?.postal_code,
        delivery_notes: address?.delivery_notes,
        state: address?.state,
        coupon_code: coupon,
      });
  }, [delivery_id, meal_plan_id, address, package_id, pricing_id, coupon]);

  //product id from appstoreconnect app->subscriptions
  const subscriptionSkus = useMemo(
    () =>
      Platform.select({
        ios: [
          "evolveFitness123",
          "evolveFitnessPro",
          "evolve_one",
          "evolve_guided",
          "evolve_kick",
        ],
        android: [""],
      }) ?? [],
    []
  );
  const [purchase, setpurchase] = useState(false);
  const [checking, setchecking] = useState(false);
  interface ReceiptBody {
    "receipt-data": string;
    password: string;
  }

  interface LatestReceiptInfo {
    expires_date_ms: string;
    // Add other fields as needed
  }

  interface ReceiptResponse {
    latest_receipt_info: LatestReceiptInfo[];
    // Add other fields as needed
  }

  const validate = async (receipt: string): Promise<void> => {
    setchecking(true);
    const receiptbody: ReceiptBody = {
      "receipt-data": receipt,
      password: "4503989042d143bc9a09f520893244ab",
    };
    const result = await validateReceiptIos({ receiptBody: receiptbody })
      .catch(() => {
        console.error("Receipt validation failed");
      })
      .then((receipt: ReceiptResponse | undefined) => {
        try {
          if (receipt && receipt.latest_receipt_info) {
            const renewalHistory = receipt.latest_receipt_info;
            const expiration =
              renewalHistory[renewalHistory.length - 1].expires_date_ms;
            let expired = Date.now() > Number(expiration);
            if (!expired) {
              setpurchase(true);
              if (package_id != null && package_id != null)
                subExercise({
                  package_id: Number(package_id),
                  pricing_id,
                  coupon_code: coupon,
                });
            } else {
              showToast("errorToast", "Subscription has expired", "top");
              console.error("Subscription has expired");
            }
            setchecking(false);
          }
        } catch (error) {
          console.error("Error processing receipt:", error);
        }
      });
  };
  useEffect(() => {
    if (Platform.OS === "ios") {
      const initIAP = async () => {
        try {
          await initConnection();
          await IAP.getSubscriptions({ skus: subscriptionSkus });
          IAP.getPurchaseHistory()
            .catch((err) => {
              console.error("IAP Error:", err);
            })
            .then((res) => {
              console.log("Purchase History:", res);
              if (Array.isArray(res) && res.length > 0) {
                const receipt = res[res.length - 1]?.transactionReceipt;
                if (receipt) {
                  // Validate receipt here and unlock content
                  validate(receipt);
                  console.log("Valid Receipt:", receipt);
                }
              }
            });
        } catch (error) {
          console.error("IAP Error:", error);
        }
      };
      initIAP();
      return () => {
        IAP.endConnection();
      };
    }
    // purchaseUpdatedListener = IAP.purchaseUpdatedListener((purchase) => {
    //   try {
    //     const receipt = purchase.transactionReceipt;
    //     console.log("Purchase Updated:", purchase, receipt);
    //   } catch (error) {
    //     console.error("Purchase Update Error:", error);
    //   }
    // });
  }, []);

  const [loading, setLoading] = useState(false);

  const handleBuySubscription = async (productId: string) => {
    try {
      setLoading(true);
      await requestSubscription({
        sku: productId,
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error instanceof PurchaseError) {
        console.log("PurchaseError:", error);
      } else {
        console.log("handleBuySubscription error:", error);
      }
    }
  };

  return (
    <View style={globalStyles.container}>
      <View style={[globalStyles.line2, styles.container]}>
        <RoundButton onPress={() => navigation.goBack()}>
          <Back color={theme.colors.black} />
        </RoundButton>
        <Text variant="poppins18black_semibold" me="s">
          {t("payment")}
        </Text>
        <View />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        {/* <Text variant="poppins14black_medium" mb="m">
          {t('saved')}
        </Text>
        <View style={globalStyles.line}>
          <RNBounceable style={styles.add} onPress={() => setvisible(true)}>
            <Text variant="poppinsTitle20black_regular" fontSize={24}>
              +
            </Text>
          </RNBounceable>
        </View>
        <Text variant="poppins14black_medium" marginVertical="m">
          {t('other_payment')}
        </Text>
        {list.map(item => (
          <RNBounceable
            style={[globalStyles.line2, styles.item, globalStyles.shadow]}
            onPress={() => setactive(item.key)}
            key={item.key}>
            <View style={globalStyles.line}>
              {item.icon}
              <Text variant="poppins14black_regular" ms="m" color="gray">
                {item.sport}
              </Text>
            </View>
            <View
              style={[
                styles.circle,
                {
                  borderColor:
                    active == item.key
                      ? theme.colors.apptheme
                      : theme.colors.mediumGray,
                },
              ]}>
              {active === item.key && <View style={styles.smallCircle} />}
            </View>
          </RNBounceable>
        ))} */}
        <Text variant="poppins14black_medium" mt="s" mb="m">
          {t("payment_details")}
        </Text>
        <View style={[globalStyles.shadow, styles.details]}>
          <View style={[globalStyles.line2, styles.margin]}>
            <Text variant="poppins14black_regular" color="gray">
              {t("plan")}
            </Text>
            <Text variant="poppins14black_regular">{pay_details?.title}</Text>
          </View>
          <View style={[globalStyles.line2, styles.margin]}>
            <Text variant="poppins14black_regular" color="gray">
              {t("subscription")}
            </Text>
            <Text variant="poppins14black_regular">
              {calculateMonths(pay_details?.number_of_days || 0)} month
              {calculateMonths(pay_details?.number_of_days || 0) > 1 ? "s" : ""}
            </Text>
          </View>
          <View style={[globalStyles.line2, styles.margin]}>
            <Text variant="poppins14black_regular" color="gray">
              {t("price")}
            </Text>
            <Text variant="poppins14black_regular">{pay_details?.price}</Text>
          </View>
          <View style={styles.line} />
          <View style={[globalStyles.line2, styles.margin]}>
            <Text variant="poppins14black_regular" color="gray">
              {t("amount")}
            </Text>
            <Text variant="poppins14black_regular">{pay_details?.price}</Text>
          </View>
          {discount ? (
            <View style={[globalStyles.line2, styles.margin]}>
              <Text variant="poppins14black_semibold" color="red">
                {t("discount")}
              </Text>
              <Text variant="poppins14black_semibold" color="red">
                -{discount}
              </Text>
            </View>
          ) : null}
          <View style={[globalStyles.line2, styles.margin]}>
            <Text variant="poppins14black_regular" color="gray">
              {t("tax")}
            </Text>
            <Text variant="poppins14black_regular">1.99</Text>
          </View>
          <View style={styles.line} />
          <View style={globalStyles.line2}>
            <Text variant="poppins14black_regular" color="gray">
              {t("total")}
            </Text>
            <Text variant="poppins14black_regular">
              {discount ? newPrice : (pay_details?.price || 0) + 1.99}
            </Text>
          </View>
          <TextInput
            placeholder="Coupon Code"
            rightText="Apply"
            onChangeText={setcoupon}
            isLoading={mealPending || fitnessPending}
            onPress={handleCouponClicked}
          />
        </View>
      </ScrollView>
      <View style={[globalStyles.shadow, styles.padd]}>
        <BaseButton
          isLoading={isPending || subPending || loading}
          disabled={isPending || subPending || loading}
          label={t("confirm_payment")}
          onPress={() => {
            if (Platform.OS == "ios") {
              if (package_id == null && pricing_id == null) {
                mutate({
                  meal_plan_id: meal_plan_id,
                  delivery_time_id: delivery_id,
                  street: address?.street,
                  city: address?.city,
                  address_label: address?.address_label,
                  building: address?.building,
                  postal_code: address?.postal_code,
                  delivery_notes: address?.delivery_notes,
                  state: address?.state,
                  coupon_code: coupon,
                });
              } else {
                handleBuySubscription(productId!);
              }
            } else if (Platform.OS === "android") {
              handleConfirmClicked();
            }
          }}
        />
      </View>
      <AddNewCardModal
        visible={visible}
        onBackToDashboardClicked={handleBackToDashboardClicked}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: "4%" },
  padd: { paddingHorizontal: "5%", paddingVertical: "3%" },
  add: {
    width: 58,
    height: 135,
    borderRadius: 14,
    backgroundColor: theme.colors.softGray,
    alignItems: "center",
    justifyContent: "center",
  },
  item: {
    height: 55,
    borderRadius: 8,
    backgroundColor: theme.colors.white,
    paddingHorizontal: "5%",
    marginBottom: "4%",
  },
  circle: {
    borderColor: theme.colors.apptheme,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  details: { padding: "5%", borderRadius: 12, marginBottom: "5%" },
  line: {
    backgroundColor: theme.colors.softGray,
    height: 1,
    marginBottom: "4%",
    marginTop: "2%",
  },
  smallCircle: {
    width: 10,
    height: 10,
    backgroundColor: theme.colors.apptheme,
    borderRadius: 5,
  },
  margin: { marginBottom: "4%" },
});

export default Payment;
