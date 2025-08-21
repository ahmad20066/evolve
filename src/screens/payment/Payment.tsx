import { globalStyles } from "@/styles/globalStyles";
import React, { useCallback, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
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
// import {
//   PurchaseError,
//   requestSubscription,
//   useIAP,
//   validateReceiptIos,
// } from 'react-native-iap';

const list = [
  { key: 1, sport: "PayPal", icon: <Paypal /> },
  { key: 2, sport: "Google Pay", icon: <Gpay /> },
  { key: 3, sport: "Apple Pay", icon: <Apple /> },
];

const Payment = ({ navigation, route }: AppNavigationProps<"Payment">) => {
  const { t } = useTranslation();
  const {
    delivery_id,
    meal_plan_id,
    address,
    package_id,
    pricing_id,
    pay_details,
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
      navigation.navigate("Checkout", { url: data.payment_url });
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
      fitnessCoupon({ package_id, pricing_id, coupon_code: coupon });
    } else {
      mealCoupon({
        meal_plan_id: delivery_id,
        coupon_code: coupon,
      });
    }
  }, [coupon, package_id, pricing_id, delivery_id]);

  const handleConfirmClicked = React.useCallback(() => {
    if (package_id != null && package_id != null)
      subExercise({ package_id, pricing_id, coupon_code: coupon });
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
  // const errorLog = ({message, error}) => {
  //   console.error('An error happened', message, error);
  // };

  // const isIos = Platform.OS === 'ios';

  // //product id from appstoreconnect app->subscriptions
  // const subscriptionSkus = Platform.select({
  //   ios: ['evolveFitness123', 'evolveFitnessPro'],
  // });

  // //useIAP - easy way to access react-native-iap methods to
  // //get your products, purchases, subscriptions, callback
  // //and error handlers.
  // const {
  //   connected,
  //   subscriptions, //returns subscriptions for this app.
  //   getSubscriptions, //Gets available subsctiptions for this app.
  //   currentPurchase, //current purchase for the tranasction
  //   finishTransaction,
  //   purchaseHistory, //return the purchase history of the user on the device (sandbox user in dev)
  //   getPurchaseHistory, //gets users purchase history
  // } = useIAP();

  // const [loading, setLoading] = useState(false);

  // const handleGetPurchaseHistory = async () => {
  //   try {
  //     await getPurchaseHistory();
  //   } catch (error) {
  //     errorLog({message: 'handleGetPurchaseHistory', error});
  //   }
  // };

  // useEffect(() => {
  //   handleGetPurchaseHistory();
  // }, [connected]);

  // const handleGetSubscriptions = async () => {
  //   try {
  //     await getSubscriptions({skus: subscriptionSkus});
  //   } catch (error) {
  //     errorLog({message: 'handleGetSubscriptions', error});
  //   }
  // };

  // useEffect(() => {
  //   handleGetSubscriptions();
  // }, [connected]);

  // useEffect(() => {
  //   // ... listen if connected, purchaseHistory and subscriptions exist
  //   if (
  //     purchaseHistory.find(
  //       x => x.productId === (subscriptionSkus[0] || subscriptionSkus[1]),
  //     )
  //   ) {
  //     navigation.navigate('Home');
  //   }
  // }, [connected, purchaseHistory, subscriptions]);

  // const handleBuySubscription = async productId => {
  //   try {
  //     await requestSubscription({
  //       sku: productId,
  //     });
  //     setLoading(false);
  //   } catch (error) {
  //     setLoading(false);
  //     if (error instanceof PurchaseError) {
  //       errorLog({message: `[${error.code}]: ${error.message}`, error});
  //     } else {
  //       errorLog({message: 'handleBuySubscription', error});
  //     }
  //   }
  // };

  // useEffect(() => {
  //   const checkCurrentPurchase = async purchase => {
  //     if (purchase) {
  //       try {
  //         const receipt = purchase.transactionReceipt;
  //         if (receipt) {
  //           if (Platform.OS === 'ios') {
  //             const isTestEnvironment = __DEV__;

  //             //send receipt body to apple server to validete
  //             const appleReceiptResponse = await validateReceiptIos(
  //               {
  //                 'receipt-data': receipt,
  //                 password: '4503989042d143bc9a09f520893244ab',
  //               },
  //               isTestEnvironment,
  //             );

  //             //if receipt is valid
  //             if (appleReceiptResponse) {
  //               const {status} = appleReceiptResponse;
  //               if (status) {
  //                 navigation.navigate('Home');
  //               }
  //             }

  //             return;
  //           }
  //         }
  //       } catch (error) {
  //         console.log('error', error);
  //       }
  //     }
  //   };
  //   checkCurrentPurchase(currentPurchase);
  // }, [currentPurchase, finishTransaction]);

  // console.log({subscriptions});

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
          isLoading={isPending || subPending}
          disabled={isPending || subPending}
          label={t("confirm_payment")}
          onPress={handleConfirmClicked}

          // onPress={() => {
          //   setLoading(true);
          //   // handleBuySubscription(subscription.productId);
          // }}
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
