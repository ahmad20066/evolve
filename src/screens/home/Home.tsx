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
import * as IAP from "react-native-iap";

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

  const [item, setItem] = useState<IWorkoutPlans | undefined>();

  const handlePackageItemClicked = React.useCallback((item: IWorkoutPlans) => {
    setItem(item);
  }, []);

  const handleItemClicked = React.useCallback((item: IPackageWorkouts) => {
    navigation.navigate("Workout", { id: item.id, home_date: item.date });
  }, []);

  const subscriptionSkus =
    Platform.select({
      ios: [
        "evolveFitness123",
        "evolveFitnessPro",
        "evolve_one",
        "evolve_guided",
        "evolve_kick",
      ],
      android: [""],
    }) || [];

  const [iosSubs, setIosSubs] = useState<IWorkoutPlans[]>([]);

  // Convert IAP subscription object to IWorkoutPlans type, mapping pricingId and packageId from data if available
  function convertSubToWorkoutPlan(
    sub: any,
    data: IWorkoutPlans[] | undefined
  ): IWorkoutPlans {
    // Try to find a matching plan from data by productId
    let pricingId = sub.productId;
    let packageId = sub.productId;
    if (data && Array.isArray(data)) {
      const foundPlan = data.find((plan) => {
        // Try to match by productId or by name/title
        return (
          plan.id === sub.productId ||
          plan.name === sub.title ||
          plan.pricings?.some((p) => p.package_id === sub.productId)
        );
      });
      if (foundPlan && foundPlan.pricings && foundPlan.pricings.length > 0) {
        // Use the first pricing that matches productId, else fallback to first pricing
        const foundPricing =
          foundPlan.pricings.find((p) => p.package_id === sub.productId) ||
          foundPlan.pricings[0];
        pricingId = foundPricing.id;
        packageId = foundPricing.package_id;
      }
    }
    return {
      id: sub.productId, // This is a string, but IWorkoutPlans expects number. Consider parsing if needed.
      name: sub.title,
      name_ar: sub.title, // Adjust if Arabic name is available
      description: sub.description,
      description_ar: sub.description, // Adjust if Arabic description is available
      type: sub.type || "subs",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      pricings: [
        {
          id: pricingId,
          package_id: packageId,
          price: Number(sub.price),
          number_of_days:
            sub.subscriptionPeriodUnitIOS === "MONTH"
              ? Number(sub.subscriptionPeriodNumberIOS) * 30
              : Number(sub.subscriptionPeriodNumberIOS),
          title: sub.title,
          title_ar: sub.title, // Adjust if Arabic title is available
          is_active: true,
        },
      ],
    };
  }

  useEffect(() => {
    if (Platform.OS === "ios") {
      const initIAP = async () => {
        try {
          const subs = await IAP.getSubscriptions({ skus: subscriptionSkus });
          const mapped = (subs as any[]).map((sub) =>
            convertSubToWorkoutPlan(sub, workoutPlans)
          );
          mapped.sort(
            (a, b) => Number(a.pricings[0].price) - Number(b.pricings[0].price)
          );
          setIosSubs(mapped);
          console.log({ subs });
        } catch (error) {
          console.error("IAP Error:", error);
        }
      };
      initIAP();
      return () => {
        IAP.endConnection();
      };
    }
  }, [data]);

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
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {workoutPending ? (
              <PackageSkeleton />
            ) : Platform.OS === "ios" ? (
              iosSubs?.map((item, index) => (
                <WorkoutSelector
                  key={item.id}
                  item={item}
                  active={active}
                  setActive={setActive}
                  onItemSelected={handlePackageItemClicked}
                  islast={index === iosSubs.length - 1}
                />
              ))
            ) : (
              workoutPlans?.map((item, index) => (
                <WorkoutSelector
                  key={item.id}
                  item={item}
                  active={active}
                  setActive={setActive}
                  onItemSelected={handlePackageItemClicked}
                  islast={index === workoutPlans.length - 1}
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
              onPress={() =>
                item
                  ? navigation.navigate("Payment", {
                      package_id: item?.pricings?.[0]?.package_id,
                      pricing_id: item?.pricings?.[0]?.id,
                      pay_details: {
                        title:
                          i18n.language == "ar" ? item?.name_ar : item?.name,
                        price: item?.pricings?.[0]?.price,
                        number_of_days: item?.pricings?.[0]?.number_of_days,
                      },
                    })
                  : showToast("errorToast", "Please select a plan", "top")
              }
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
