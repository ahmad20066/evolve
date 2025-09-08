import { globalStyles } from "@/styles/globalStyles";
import React, { useEffect, useState } from "react";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
import Right from "@/assets/svg/smallright.svg";
import { Text, theme } from "@/components/theme";
import RNBounceable from "@freakycoder/react-native-bounceable";
import BaseButton from "@/components/baseBtn";
import { AppNavigationProps } from "@/navigators/navigation";
import WorkoutSelector from "@/components/workoutSelector";
import PackageSkeleton from "@/components/packageSkeleton";
import { IWorkoutPlans, useWorkoutPlans } from "@/hooks/useWorkoutPlans";
import { useTranslation } from "react-i18next";
import { showToast } from "@/components/toast";
import * as IAP from "react-native-iap";

const WorkoutPlan = ({ navigation }: AppNavigationProps<"WorkoutPlan">) => {
  const { t, i18n } = useTranslation();
  const [active, setActive] = useState<number>();
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

  const { data, isPending } = useWorkoutPlans();

  const [item, setItem] = useState<IWorkoutPlans | undefined>();
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

  const handleItemClicked = React.useCallback((item: IWorkoutPlans) => {
    setItem(item);
  }, []);
  useEffect(() => {
    if (Platform.OS === "ios") {
      const initIAP = async () => {
        try {
          const subs = await IAP.getSubscriptions({ skus: subscriptionSkus });
          const mapped = (subs as any[]).map((sub) =>
            convertSubToWorkoutPlan(sub, data)
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
          <Text variant="poppins18black_semibold">{t("choose_fitness")}</Text>
          <RNBounceable
            style={globalStyles.line}
            onPress={() => navigation.navigate("Exercises", { id: active! })}
          >
            <Text me="s" variant="poppins14black_regular" color="gray">
              {t("show_exercises")}
            </Text>
            <Right color={theme.colors.black} />
          </RNBounceable>
        </View>
      </View>
      <View>
        <ScrollView showsHorizontalScrollIndicator={false} horizontal>
          {isPending ? (
            <PackageSkeleton />
          ) : Platform.OS === "ios" ? (
            iosSubs?.map((item, index) => (
              <WorkoutSelector
                key={item.id}
                item={item}
                active={active}
                setActive={setActive}
                onItemSelected={handleItemClicked}
                islast={index === iosSubs.length - 1}
              />
            ))
          ) : (
            data?.map((item, index) => (
              <WorkoutSelector
                key={item.id}
                item={item}
                active={active}
                setActive={setActive}
                onItemSelected={handleItemClicked}
                islast={index === data.length - 1}
              />
            ))
          )}
        </ScrollView>
      </View>
      <View style={styles.container}>
        <BaseButton
          label={t("next")}
          onPress={() =>
            item && item.pricings
              ? navigation.navigate("Payment", {
                  package_id: item?.pricings?.[0]?.package_id,
                  pricing_id: item?.pricings?.[0]?.id,
                  pay_details: {
                    title: i18n.language == "ar" ? item?.name_ar : item?.name,
                    price: item?.pricings?.[0]?.price,
                    number_of_days: item?.pricings?.[0]?.number_of_days,
                  },
                  productId: item.id.toString(),
                })
              : showToast("errorToast", "Please select a plan", "top")
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: "5%",
  },
  margin: { marginTop: "5%" },
});

export default WorkoutPlan;
