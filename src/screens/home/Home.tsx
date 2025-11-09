import { Text, theme } from "@/components/theme";
import { globalStyles } from "@/styles/globalStyles";
import React, { useEffect, useState } from "react";
import { 
  Platform, 
  ScrollView, 
  StyleSheet, 
  View, 
  Dimensions,
  ImageBackground 
} from "react-native";
import Hand from "@/assets/svg/hand.svg";
import Bell from "@/assets/svg/notification-bing.svg";
import Fire from "@/assets/svg/fire.svg";
import Trophy from "@/assets/svg/cup.svg";
import Chart from "@/assets/svg/chart.svg";
import Calendar from "@/assets/svg/calendar.svg";
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
import LinearGradient from "react-native-linear-gradient";

interface IWorkoutPlansWithRC extends IWorkoutPlans {
  rcPackage?: PurchasesPackage;
}

const { width, height } = Dimensions.get("window");

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

  // Get current time for greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t("good_morning");
    if (hour < 17) return t("good_afternoon");
    return t("good_evening");
  };

  // Get today's date
  const getTodayDate = () => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    };
    return today.toLocaleDateString(i18n.language === 'ar' ? 'ar-SA' : 'en-US', options);
  };

  return (
    <View style={globalStyles.container}>
      {/* Header with Gradient Background */}
      <LinearGradient
        colors={[theme.colors.apptheme, '#FF8A5B']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <View>
              <Text variant="poppins14black_regular" color="white" opacity={0.9}>
                {getGreeting()}
              </Text>
              <View style={globalStyles.line}>
                <Text
                  variant="poppins18black_bold"
                  color="white"
                  me="xs"
                  textTransform="capitalize">
                  {user?.name || t("user")}
                </Text>
                <Hand width={20} height={20} />
              </View>
              <Text variant="poppins12black_regular" color="white" opacity={0.8} mt="xs">
                {getTodayDate()}
              </Text>
            </View>
            <RNBounceable 
              style={styles.notificationBtn}
              onPress={() => navigation.navigate("Notification")}>
              <Bell color={theme.colors.white} width={22} height={22} />
            </RNBounceable>
          </View>

          {/* Quick Stats Cards */}
          {(check?.dietSubscription || check?.fitnessSubscription) && (
            <View style={styles.quickStatsContainer}>
              {check?.fitnessSubscription && (
                <RNBounceable 
                  style={styles.quickStatCard}
                  onPress={() => navigation.navigate("PerformanceStats")}>
                  <Trophy width={20} height={20} color={theme.colors.apptheme} />
                  <Text variant="poppins12black_semibold" color="black" mt="xs">
                    {t("my_progress")}
                  </Text>
                </RNBounceable>
              )}
              {check?.dietSubscription && (
                <RNBounceable 
                  style={styles.quickStatCard}
                  onPress={() => navigation.navigate("MyMeals")}>
                  <Fire width={20} height={20} color={theme.colors.apptheme} />
                  <Text variant="poppins12black_semibold" color="black" mt="xs">
                    {t("today_meals")}
                  </Text>
                </RNBounceable>
              )}
              <RNBounceable 
                style={styles.quickStatCard}
                onPress={() => navigation.navigate("Profile")}>
                <Chart width={20} height={20} color={theme.colors.apptheme} />
                <Text variant="poppins12black_semibold" color="black" mt="xs">
                  {t("profile")}
                </Text>
              </RNBounceable>
            </View>
          )}
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContainer}>
        {/* Banner Section */}
        <Banner
          banner={bannerData || []}
          height={140}
          timer={5}
          isLoading={bannerLoading}
        />

        {/* Motivational Tip Card */}
        <View style={styles.tipCard}>
          <View style={styles.tipIconContainer}>
            <Fire width={24} height={24} color={theme.colors.apptheme} />
          </View>
          <View style={styles.tipContent}>
            <Text variant="poppins14black_semibold" color="black">
              {t("daily_tip")}
            </Text>
            <Text variant="poppins12black_regular" color="gray" mt="xs">
              {t("tip_hydration")}
            </Text>
          </View>
        </View>

        {/* Meals Section */}
        {(check?.dietSubscription
          ? meals?.meals && meals.meals.length > 0
          : mealsPLans && mealsPLans?.length > 0) && (
          <>
            <View style={styles.sectionHeader}>
              <View>
                <Text variant="poppins18black_bold" color="black">
                  {check?.dietSubscription ? t("today_meals") : t("discover_meals")}
                </Text>
                <Text variant="poppins12black_regular" color="gray" mt="xs">
                  {check?.dietSubscription 
                    ? t("your_personalized_meals") 
                    : t("healthy_meal_plans")}
                </Text>
              </View>
              <RNBounceable
                style={styles.viewAllBtn}
                onPress={() =>
                  navigation.navigate(
                    check?.dietSubscription ? "MyMeals" : "Meals"
                  )
                }>
                <Text variant="poppins14black_semibold" color="apptheme">
                  {t("view_all")}
                </Text>
                <Right color={theme.colors.apptheme} width={16} height={16} />
              </RNBounceable>
            </View>

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
                      navigation.navigate("MealPlanDetails", {
                        id: item.id,
                      })
                    }
                  />
                ))
              )}
            </ScrollView>

            {!check?.dietSubscription && (
              <View style={styles.ctaContainer}>
                <BaseButton
                  label={t("explore_meal_plans")}
                  onPress={() => navigation.navigate("Meals")}
                />
              </View>
            )}
          </>
        )}

        {/* Fitness Section */}
        <View style={styles.sectionHeader}>
          <View>
            <Text variant="poppins18black_bold" color="black">
              {check?.fitnessSubscription
                ? t("this_week_workouts")
                : t("discover_fitness")}
            </Text>
            <Text variant="poppins12black_regular" color="gray" mt="xs">
              {check?.fitnessSubscription 
                ? t("your_scheduled_workouts") 
                : t("professional_workout_plans")}
            </Text>
          </View>
          <RNBounceable
            style={styles.viewAllBtn}
            onPress={() =>
              navigation.navigate(
                check?.fitnessSubscription ? "Workout" : "WorkoutPlan"
              )
            }>
            <Text variant="poppins14black_semibold" color="apptheme">
              {t("view_all")}
            </Text>
            <Right color={theme.colors.apptheme} width={16} height={16} />
          </RNBounceable>
        </View>

        {check?.fitnessSubscription ? (
          <View style={styles.workoutContainer}>
            {workout?.length == 0 ? (
              <View style={styles.emptyWorkoutCard}>
                <Calendar width={32} height={32} color={theme.colors.gray} />
                <Text
                  variant="poppins14black_semibold"
                  color="gray"
                  mt="m"
                  textAlign="center">
                  {t("no_workout_today")}
                </Text>
                <Text
                  variant="poppins12black_regular"
                  color="gray"
                  mt="xs"
                  textAlign="center">
                  {t("check_back_tomorrow")}
                </Text>
              </View>
            ) : (
              workout?.map((item) => (
                <View key={item.id} style={styles.workoutCard}>
                  <ExerciseItem item={item} onItemClicked={handleItemClicked} />
                </View>
              ))
            )}
          </View>
        ) : workoutPending ? (
          <PackageSkeleton />
        ) : (
          <ScrollView showsHorizontalScrollIndicator={false} horizontal>
            {enhancedData?.map((item, index) => (
              <WorkoutSelector
                key={item.id}
                item={item}
                active={active}
                setActive={setActive}
                onItemSelected={handleWorkoutPlanClicked}
                islast={index === enhancedData.length - 1}
              />
            ))}
          </ScrollView>
        )}

        {!check?.fitnessSubscription && (
          <View style={styles.ctaContainer}>
            <BaseButton
              label={t("start_fitness_journey")}
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

                navigation.navigate("PackageDetails", {
                  id: Number(item.id),
                });
              }}
            />
          </View>
        )}

        {/* Bottom Spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Chat Button */}
      {check?.fitnessSubscription && (
        <RNBounceable
          style={styles.floatingChatBtn}
          onPress={() => navigation.navigate("Chat")}>
          <LinearGradient
            colors={[theme.colors.lightGreen, '#B8E86A']}
            style={styles.chatGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}>
            <Chat width={20} height={20} />
            <Text variant="poppins12black_semibold" ms="s" color="black">
              {t("chat")}
            </Text>
          </LinearGradient>
        </RNBounceable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: "5%",
  },
  headerGradient: {
    paddingTop: "10%",
    paddingBottom: "8%",
    paddingHorizontal: "5%",
  },
  headerContent: {
    flex: 1,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "6%",
  },
  notificationBtn: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 12,
    borderRadius: 12,
  },
  quickStatsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "4%",
  },
  quickStatCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: "4%",
    alignItems: "center",
    flex: 1,
    marginHorizontal: "1%",
    shadowColor: "#0000001A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  scrollContainer: {
    flex: 1,
    marginTop: -20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: theme.colors.screen,
  },
  tipCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: "5%",
    marginHorizontal: "5%",
    marginBottom: "6%",
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#0000001A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  tipIconContainer: {
    backgroundColor: theme.colors.lightGreen,
    padding: 12,
    borderRadius: 12,
    marginRight: "4%",
  },
  tipContent: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: "5%",
    marginBottom: "4%",
    marginTop: "2%",
  },
  viewAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.white,
    paddingHorizontal: "4%",
    paddingVertical: "2%",
    borderRadius: 20,
    shadowColor: "#0000001A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 2,
  },
  ctaContainer: {
    paddingHorizontal: "5%",
    marginTop: "4%",
    marginBottom: "6%",
  },
  workoutContainer: {
    paddingHorizontal: "5%",
  },
  workoutCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    marginBottom: "4%",
    shadowColor: "#0000001A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  emptyWorkoutCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: "8%",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0000001A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  floatingChatBtn: {
    position: "absolute",
    bottom: 30,
    right: 20,
    borderRadius: 25,
    shadowColor: "#0000001A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
  },
  chatGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: "6%",
    paddingVertical: "4%",
    borderRadius: 25,
  },
});

export default Home;
