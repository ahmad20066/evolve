import { Text, theme } from "@/components/theme";
import { globalStyles } from "@/styles/globalStyles";
import React, { useEffect, useState } from "react";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
import Hand from "@/assets/svg/hand.svg";
import Bell from "@/assets/svg/notification-bing.svg";
import RNBounceable from "@freakycoder/react-native-bounceable";
import { AppNavigationProps } from "@/navigators/navigation";
import Right from "@/assets/svg/smallright.svg";
import BaseButton from "@/components/baseBtn";
import ExploreItem from "./components/ExploreItem";
import Banner from "./components/Banner";
import { useBanner } from "@/hooks/useBanner";
import { useHomeMealsPlans } from "@/hooks/useHomeMealsPlans";
import SkeletonItem from "./components/SkeletonItem";
import { useHomeWorkout } from "@/hooks/useHomeWorkout";
import { useCheckSubs } from "@/hooks/useCheckSubsrciption";
import { IWorkoutPlans, useWorkoutPlans } from "@/hooks/useWorkoutPlans";
import PackageSkeleton from "@/components/packageSkeleton";
import WorkoutSelector from "@/components/workoutSelector";
import ExerciseItem from "../exercises/components/ExerciseItem";
import { useTranslation } from "react-i18next";
import { useGetProfile } from "@/hooks/useGetProfile";
import { useHomeMeals } from "@/hooks/useHomeMeals";
import { IPackageWorkouts } from "@/hooks/usePackageWorkouts";
import Chat from "@/assets/svg/messages.svg";
import { IPricing } from "@/types/pricing";
import { showToast } from "@/components/toast";
import useRevenueCat from "@/hooks/useRevenueCat";
import { useSubscribeExercise } from "@/hooks/useSubscribeExercise";
import { CommonActions } from "@react-navigation/native";
import Purchases, { PurchasesPackage } from "react-native-purchases";

interface IWorkoutPlansWithRC extends IWorkoutPlans {
  rcPackage?: PurchasesPackage;
}

const Home = ({ navigation }: AppNavigationProps<"Home">) => {
  const { t, i18n } = useTranslation();
  const [active, setActive] = useState<number>();
  const { data, isLoading: bannerLoading } = useBanner();
  const { data: mealsPLans, isPending } = useHomeMealsPlans();
  const { data: meals } = useHomeMeals();
  const { data: workout } = useHomeWorkout();
  const { data: workoutPlans, isPending: workoutPending } = useWorkoutPlans();
  const { data: check } = useCheckSubs();
  const bannerData = data?.map((data) => `${data.image}`);
  const { data: user } = useGetProfile();
  const [isRevenueCatLoading, setIsRevenueCatLoading] = useState(false);
  const [enhancedData, setEnhancedData] = useState<IWorkoutPlansWithRC[]>([]);

  const { currentOffering, customerInfo } = useRevenueCat();

  const { isPending: subPending, mutate: subExercise } = useSubscribeExercise({
    onSuccess() {
      if (Platform.OS === "ios") {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "MainTab" }],
          })
        );
      }
    },
    onError(err: any) {
      console.log({ err });
      showToast("errorToast", err.errors[0].message, "top");
    },
  });

  const [item, setItem] = useState<IWorkoutPlans | undefined>();

  const handlePackageItemClicked = React.useCallback((item: IWorkoutPlans) => {
    setItem(item);
  }, []);

  const handleItemClicked = React.useCallback((item: IPackageWorkouts) => {
    navigation.navigate("Workout", { id: item.id, home_date: item.date });
  }, []);

  const handleWorkoutPlanClicked = React.useCallback(
    (item: IWorkoutPlans) => {
      const enriched = enhancedData.find((d) => d.id === item.id);
      if (Platform.OS === "ios" && !enriched?.rcPackage) {
        showToast(
          "errorToast",
          "This plan is not available for purchase",
          "top"
        );
        return;
      }
      setActive(Number(item.id));
      setItem(enriched || item); // Android = original, iOS = enriched
    },
    [enhancedData]
  );

  const handlePurchase = async (selectedItem: IWorkoutPlans) => {
    try {
      if (!selectedItem.rcPackage) {
        showToast("errorToast", "Invalid package selected", "top");
        return;
      }

      // Check if user is already subscribed before attempting purchase
      if (
        customerInfo?.entitlements.active &&
        Object.keys(customerInfo.entitlements.active).length > 0
      ) {
        console.log(
          "User already has active subscription:",
          Object.keys(customerInfo.entitlements.active)
        );

        console.log(
          "User wants to upgrade/change plan. Attempting purchase..."
        );
        // Don't restore - let them upgrade/change their plan
        // Continue to purchase flow instead of returning
      }

      const purchaseResult = await Purchases.purchasePackage(
        selectedItem.rcPackage
      );

      console.log("Purchase result:", purchaseResult);

      // Check if the purchase was successful and user has active entitlements
      const hasActiveEntitlements =
        purchaseResult.customerInfo.entitlements.active &&
        Object.keys(purchaseResult.customerInfo.entitlements.active).length > 0;

      if (hasActiveEntitlements) {
        console.log("Purchase successful, active entitlements found");
        showToast("successToast", "Subscription updated successfully!", "top");

        // Call backend API with the NEW selected package (not the old one)
        subExercise({
          package_id: Number(selectedItem.pricings[0].package_id),
          pricing_id: selectedItem.pricings[0].id,
          payment_method: "iap",
          app_user_id: customerInfo?.originalAppUserId,
          coupon_code: undefined,
          apple_receipt: "a",
          expected_entitlement: Object.keys(
            purchaseResult.customerInfo.entitlements.active
          )[0],
        });
      } else {
        console.log("Purchase completed but no active entitlements found");
        showToast(
          "errorToast",
          "Purchase completed but subscription not active",
          "top"
        );
      }
    } catch (error: any) {
      console.error("Purchase error:", error);

      // Handle specific error cases
      if (error.userCancelled) {
        console.log("User cancelled purchase");
        showToast("errorToast", "Purchase cancelled", "top");
      } else if (error.code === "PURCHASE_NOT_ALLOWED_ERROR") {
        console.log("Purchases not allowed on device");
        showToast("errorToast", "Purchases not allowed on this device", "top");
      } else if (error.code === "PAYMENT_PENDING_ERROR") {
        console.log("Payment is pending");
        showToast("errorToast", "Payment is pending", "top");
      } else if (error.code === "PRODUCT_ALREADY_PURCHASED_ERROR") {
        console.log("Product already purchased");

        // Check if this is the SAME product they already have
        const currentEntitlements = Object.keys(
          customerInfo?.entitlements.active || {}
        );
        const isUpgrade = !currentEntitlements.some((entitlement) =>
          entitlement.toLowerCase().includes(selectedItem.name.toLowerCase())
        );

        if (isUpgrade) {
          // They're trying to upgrade - show error since they already own this specific product
          showToast(
            "errorToast",
            "You already own this subscription plan",
            "top"
          );
        } else {
          // They're trying to buy the same plan they already have - restore it
          try {
            subExercise({
              package_id: Number(selectedItem.pricings[0].package_id),
              pricing_id: selectedItem.pricings[0].id,
              payment_method: "iap",
              app_user_id: customerInfo?.originalAppUserId,
              coupon_code: undefined,
              apple_receipt: "a",
              expected_entitlement: currentEntitlements[0],
            });

            showToast(
              "successToast",
              "Subscription restored successfully!",
              "top"
            );
          } catch (restoreError) {
            showToast("errorToast", "Failed to restore subscription", "top");
          }
        }
      } else if (error.code === "RECEIPT_ALREADY_IN_USE_ERROR") {
        console.log("Receipt already in use");
        showToast(
          "errorToast",
          "This purchase is already associated with another account",
          "top"
        );
      } else {
        console.log("Unknown purchase error:", error.message);
        showToast("errorToast", error.message || "Purchase failed", "top");
      }
    }
  };

  useEffect(() => {
    if (!data) {
      setEnhancedData([]);
      return;
    }

    if (Platform.OS === "ios") {
      setIsRevenueCatLoading(true);
    }

    if (Platform.OS === "ios" && currentOffering?.availablePackages) {
      const updatedData = workoutPlans?.map(
        (backendItem): IWorkoutPlansWithRC => {
          const matchingRcPackage = currentOffering.availablePackages.find(
            (rcPackage) => {
              const productId = rcPackage.product.identifier.toLowerCase();
              const productTitle = rcPackage.product.title.toLowerCase();

              return (
                backendItem.pricings?.some(
                  (pricing) =>
                    String(pricing.package_id).toLowerCase() === productId ||
                    String(pricing.id).toLowerCase() === productId
                ) ||
                backendItem.name.toLowerCase() === productTitle ||
                productId.includes(backendItem.name.toLowerCase())
              );
            }
          );

          if (matchingRcPackage) {
            console.log(
              `✅ Match found: ${backendItem.name} <-> ${matchingRcPackage.product.identifier}`
            );
          } else {
            console.log(
              `❌ No RC package found for: ${backendItem.name} (ID: ${backendItem.id})`
            );
          }

          return {
            ...backendItem,
            rcPackage: matchingRcPackage ?? undefined, // only set for iOS
          };
        }
      );

      setEnhancedData(updatedData || []);
      setIsRevenueCatLoading(false);
    } else {
      // Android → leave as is
      setEnhancedData((workoutPlans ?? []).map((item) => ({ ...item })));
      setIsRevenueCatLoading(false);
    }
  }, [currentOffering, workoutPlans]);

  return (
    <View style={globalStyles.container}>
      <View style={styles.container}>
        <View style={[globalStyles.line2, styles.margin]}>
          <View style={globalStyles.line}>
            <Text
              variant="poppins18black_semibold"
              me="s"
              textTransform="capitalize"
            >
              {t("hi")} {user?.name} !
            </Text>
            <Hand />
          </View>
          <RNBounceable onPress={() => navigation.navigate("Notification")}>
            <Bell color={theme.colors.mediumGray} />
          </RNBounceable>
        </View>
        <Text
          textAlign="left"
          variant="poppins12black_regular"
          color="gray"
          marginVertical="s"
        >
          Add a slice of lemon to your water
        </Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Banner
          banner={bannerData || []}
          height={124}
          timer={5}
          isLoading={bannerLoading}
        />
        {(check?.dietSubscription
          ? meals?.meals && meals.meals.length > 0
          : mealsPLans && mealsPLans?.length > 0) && (
          <View style={[globalStyles.line2, styles.container]}>
            <Text variant="poppins16black_medium">
              {check?.dietSubscription ? t("today_meals") : t("explore_meal")}
            </Text>
            <RNBounceable
              style={globalStyles.line}
              onPress={() =>
                navigation.navigate(
                  check?.dietSubscription ? "MyMeals" : "Meals"
                )
              }
            >
              <Text me="s" variant="poppins14black_regular" color="gray">
                {t("view_all")}
              </Text>
              <Right color={theme.colors.black} />
            </RNBounceable>
          </View>
        )}

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {isPending ? (
            <>
              <SkeletonItem />
              <SkeletonItem />
            </>
          ) : check?.dietSubscription ? (
            meals?.meals?.map((item) => (
              <ExploreItem
                cal={item.meal.calories}
                image={item.meal.images[0]}
                title={
                  i18n.language == "ar" ? item.meal.name_ar : item.meal.name
                }
                key={item.id}
                onPress={() =>
                  navigation.navigate("Dish", { id: item.meal_id })
                }
              />
            ))
          ) : (
            mealsPLans?.map((item) => (
              <ExploreItem
                cal={item.calories}
                image={item.image}
                title={i18n.language == "ar" ? item.title_ar : item.title}
                key={item.id}
                onPress={() =>
                  navigation.navigate("DeliveryTime", {
                    meal_plan_id: item.id,
                  })
                }
              />
            ))
          )}
        </ScrollView>

        <View style={styles.container}>
          {!check?.dietSubscription && (
            <BaseButton
              label={t("choose_meal_btn")}
              mt={0}
              mb={20}
              onPress={() => navigation.navigate("Meals")}
            />
          )}
          <View style={globalStyles.line2}>
            <Text variant="poppins16black_medium">
              {check?.fitnessSubscription
                ? t("workout_week")
                : t("explore_fitness")}
            </Text>
            <RNBounceable
              style={globalStyles.line}
              onPress={() =>
                navigation.navigate(
                  check?.fitnessSubscription ? "Workout" : "WorkoutPlan"
                )
              }
            >
              <Text me="s" variant="poppins14black_regular" color="gray">
                {t("view_all")}
              </Text>
              <Right color={theme.colors.black} />
            </RNBounceable>
          </View>
        </View>

        {check?.fitnessSubscription ? (
          <View style={styles.container}>
            {workout?.length == 0 ? (
              <Text
                marginVertical="m"
                textAlign="left"
                variant="poppins12black_medium"
              >
                {t("no_workout")}
              </Text>
            ) : (
              workout?.map((item) => (
                <ExerciseItem item={item} onItemClicked={handleItemClicked} />
              ))
            )}
          </View>
        ) : workoutPending ? (
          <PackageSkeleton />
        ) : (
          <ScrollView showsHorizontalScrollIndicator={false} horizontal>
            {isPending ? (
              <PackageSkeleton />
            ) : (
              enhancedData?.map((item, index) => (
                <WorkoutSelector
                  key={item.id}
                  item={item}
                  active={active}
                  setActive={setActive}
                  onItemSelected={handleWorkoutPlanClicked}
                  islast={index === enhancedData.length - 1}
                />
              ))
            )}
          </ScrollView>
        )}
        {!check?.fitnessSubscription && (
          <View style={styles.container}>
            <BaseButton
              label={t("choose_fitness_btn")}
              mt={0}
              mb={20}
              disabled={
                !item ||
                (Platform.OS === "ios" && !item.rcPackage) ||
                subPending ||
                isRevenueCatLoading
              }
              onPress={() => {
                if (!item || !item.pricings) {
                  showToast("errorToast", "Please select a plan", "top");
                  return;
                }

                if (Platform.OS === "ios") {
                  // iOS: must use RevenueCat
                  if (!item.rcPackage) {
                    showToast("errorToast", "Invalid package selected", "top");
                    return;
                  }
                  handlePurchase(item);
                } else {
                  // Android: backend values only
                  navigation.navigate("Payment", {
                    package_id: item.pricings[0].package_id,
                    pricing_id: item.pricings[0].id,
                    pay_details: {
                      title: i18n.language === "ar" ? item.name_ar : item.name,
                      price: item.pricings[0].price,
                      number_of_days: item.pricings[0].number_of_days,
                    },
                    productId: item.id.toString(),
                  });
                }
              }}
            />
          </View>
        )}
      </ScrollView>
      {check?.fitnessSubscription && (
        <RNBounceable
          style={[styles.chat, globalStyles.line]}
          onPress={() => navigation.navigate("Chat")}
        >
          <Chat />
          <Text variant="poppins12black_medium" ms="s">
            {t("chat")}
          </Text>
        </RNBounceable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: "5%",
  },
  margin: { marginTop: "5%" },
  chat: {
    backgroundColor: theme.colors.lightGreen,
    height: 36,
    borderRadius: 20,
    paddingHorizontal: "6%",
    position: "absolute",
    bottom: 20,
    right: 20,
  },
});

export default Home;
