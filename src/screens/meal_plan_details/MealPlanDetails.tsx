import { globalStyles } from "@/styles/globalStyles";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import Back from "@/assets/svg/arrow-left.svg";
import RoundButton from "@/components/roundButton";
import { Text, theme } from "@/components/theme";
import { AppNavigationProps } from "@/navigators/navigation";
import { useMealPlanDetails } from "@/hooks/useMealPlanDetails";
import { useTranslation } from "react-i18next";
import BaseButton from "@/components/baseBtn";
import RNBounceable from "@freakycoder/react-native-bounceable";
import Fire from "@/assets/svg/fire.svg";
import Trophy from "@/assets/svg/cup.svg";
import Chart from "@/assets/svg/chart.svg";
import Basket from "@/assets/svg/basket.svg";
import { showToast } from "@/components/toast";

const { width } = Dimensions.get("window");

// Order Status Bar Component
const OrderStatusBar = ({
  label,
  count,
  total,
  color,
  t,
}: {
  label: string;
  count: number;
  total: number;
  color: string;
  t: (key: string) => string;
}) => {
  const percentage = total > 0 ? (count / total) * 100 : 0;
  return (
    <View style={styles.statusBarRow}>
      <View style={styles.statusBarLabel}>
        <Text variant="poppins12black_regular" color="gray">
          {t(label)}
        </Text>
      </View>
      <View style={styles.statusBarContainer}>
        <View
          style={[
            styles.statusBarFill,
            { width: `${percentage}%`, backgroundColor: color },
          ]}
        />
      </View>
      <Text variant="poppins12black_regular" color="gray" ms="s">
        {count}
      </Text>
    </View>
  );
};

const MealPlanDetails = ({
  navigation,
  route,
}: AppNavigationProps<"MealPlanDetails">) => {
  const { t, i18n } = useTranslation();
  const { id } = route.params;
  const [selectedDuration, setSelectedDuration] = useState<
    "21" | "26" | "monthly" | null
  >(null);

  const {
    data,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useMealPlanDetails(id);

  const handleRefresh = () => {
    refetch();
  };

  const handleSubscribe = (duration: "21" | "26" | "monthly") => {
    setSelectedDuration(duration);
    const selectedMealPlan = data;
    if (!selectedMealPlan) {
      showToast("errorToast", "Meal plan not available", "top");
      return;
    }

    // If 21 or 26 days is selected, skip DurationSelection and go directly to DeliveryTime
    if (duration === "21" || duration === "26") {
      const selectedPrice =
        duration === "21"
          ? selectedMealPlan.price_21_days
          : selectedMealPlan.price_26_days;
      const selectedDays = duration === "21" ? 21 : 26;

      if (!selectedPrice) {
        showToast("errorToast", "Pricing not available", "top");
        return;
      }

      navigation.navigate("DeliveryTime", {
        meal_plan_id: id,
        subscription_duration: selectedDays,
        pay_details: {
          title:
            i18n.language === "ar"
              ? selectedMealPlan.title_ar
              : selectedMealPlan.title || "",
          price: selectedPrice,
          number_of_days: selectedDays,
        },
      });
    } else {
      // For monthly, show DurationSelection to let user choose
      navigation.navigate("DurationSelection", {
        meal_plan_id: id,
        meal_plan: {
          id: selectedMealPlan.id,
          title: selectedMealPlan.title,
          title_ar: selectedMealPlan.title_ar,
          price_monthly: selectedMealPlan.price_monthly,
          price_21_days: selectedMealPlan.price_21_days,
          price_26_days: selectedMealPlan.price_26_days,
          number_of_days: selectedMealPlan.number_of_days,
        },
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US").format(price);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      listed: "#6B7280",
      pending: "#F59E0B", 
      done: "#3B82F6",
      out_for_delivery: "#F97316",
      delivered: "#10B981",
    };
    return colors[status] || theme.colors.gray;
  };

  if (error) {
    return (
      <View style={[globalStyles.container, styles.container]}>
        <View style={globalStyles.line2}>
          <RoundButton onPress={() => navigation.goBack()}>
            <Back color={theme.colors.black} />
          </RoundButton>
          <Text variant="poppins18black_semibold" me="s">
            {t("meal_plan_details")}
          </Text>
          <View />
        </View>
        <View style={styles.errorContainer}>
          <Text variant="poppins16black_regular" color="gray" textAlign="center">
            {t("error_loading_meal_plan")}
          </Text>
          <BaseButton label={t("retry")} onPress={handleRefresh} mt={16} />
        </View>
      </View>
    );
  }

  return (
    <View style={[globalStyles.container, styles.container]}>
      <View style={globalStyles.line2}>
        <RoundButton onPress={() => navigation.goBack()}>
          <Back color={theme.colors.black} />
        </RoundButton>
        <Text variant="poppins18black_semibold" me="s">
          {t("meal_plan_details")}
        </Text>
        <View />
      </View>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.apptheme} />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={handleRefresh}
              tintColor={theme.colors.apptheme}
            />
          }>
          {/* Hero Image Section */}
          {data?.image && (
            <View style={styles.heroSection}>
              <Image
                source={{ uri: data.image }}
                style={styles.heroImage}
                resizeMode="cover"
              />
              <View style={styles.heroOverlay}>
                <View style={styles.caloriesBadge}>
                  <Fire width={18} height={18} color={theme.colors.apptheme} />
                  <Text
                    variant="poppins14black_semibold"
                    color="apptheme"
                    ms="xs">
                    {data.calories} {t("kcal")}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Header Section */}
          <View style={styles.headerSection}>
            <Text
              variant="poppins18black_bold"
              mt="m"
              textAlign="left"
              fontSize={24}
              numberOfLines={2}>
              {i18n.language === "ar" ? data?.title_ar : data?.title}
            </Text>

            {/* Meal Types Badges */}
            {data?.types && data.types.length > 0 && (
              <View style={styles.mealTypesContainer}>
                {data.types.map((type) => (
                  <View key={type.id} style={styles.mealTypeBadge}>
                    <Text variant="poppins12black_semibold" color="apptheme">
                      {i18n.language === "ar" ? type.title_ar : type.title}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Statistics Cards */}
          <View style={styles.section}>
            <View style={styles.statsGrid}>
              <View style={[styles.statCard, styles.statCardBlue]}>
                <Fire width={24} height={24} color={theme.colors.second} />
                <Text
                  variant="poppins18black_bold"
                  color="second"
                  mt="xs"
                  fontSize={20}>
                  {formatNumber(data?.statistics?.totalSubscribers || 0)}
                </Text>
                <Text variant="poppins12black_regular" color="gray" mt="xs">
                  {t("subscribers")}
                </Text>
              </View>
              <View style={[styles.statCard, styles.statCardPurple]}>
                <Basket width={24} height={24} color={theme.colors.apptheme} />
                <Text
                  variant="poppins18black_bold"
                  color="apptheme"
                  mt="xs"
                  fontSize={20}>
                  {formatNumber(data?.statistics?.totalOrders || 0)}
                </Text>
                <Text variant="poppins12black_regular" color="gray" mt="xs">
                  {t("total_orders")}
                </Text>
              </View>
              <View
                style={[
                  styles.statCard,
                  data?.statistics?.deliverySuccessRate &&
                  data.statistics.deliverySuccessRate >= 90
                    ? styles.statCardGreen
                    : styles.statCardOrange,
                ]}>
                <Chart width={24} height={24} color={theme.colors.green} />
                <Text
                  variant="poppins18black_bold"
                  color={
                    data?.statistics?.deliverySuccessRate &&
                    data.statistics.deliverySuccessRate >= 90
                      ? "green"
                      : "rank"
                  }
                  mt="xs"
                  fontSize={20}>
                  {data?.statistics?.deliverySuccessRate?.toFixed(1) || "0"}%
                </Text>
                <Text variant="poppins12black_regular" color="gray" mt="xs">
                  {t("delivery_success_rate")}
                </Text>
              </View>
              <View style={[styles.statCard, styles.statCardTeal]}>
                <Trophy width={24} height={24} color={theme.colors.lunch} />
                <Text
                  variant="poppins18black_bold"
                  color="lunch"
                  mt="xs"
                  fontSize={20}>
                  {data?.statistics?.totalMeals || 0}
                </Text>
                <Text variant="poppins12black_regular" color="gray" mt="xs">
                  {t("total_meals")}
                </Text>
              </View>
            </View>
          </View>

          {/* Pricing Section */}
          <View style={styles.section}>
            <Text variant="poppins16black_semibold" mb="m" textAlign="left">
              {t("pricing_plans")}
            </Text>

            {/* 21 Days Plan */}
            {data?.price_21_days !== null && (
              <View
                style={[
                  styles.pricingCard,
                  selectedDuration === "21" && styles.selectedPricing,
                ]}>
                <View style={styles.pricingHeader}>
                  <View style={styles.pricingContent}>
                    <Text variant="poppins16black_semibold" color="black">
                      {t("days_21")}
                    </Text>
                    <Text variant="poppins12black_regular" color="gray" mt="xs">
                      {t("excludes_friday_saturday")}
                    </Text>
                  </View>
                  <View style={styles.priceContainer}>
                    <Text variant="poppins12black_semibold" color="apptheme">
                      SAR
                    </Text>
                    <Text
                      variant="poppins18black_bold"
                      color="apptheme"
                      fontSize={22}>
                      {formatPrice(data.price_21_days!)}
                    </Text>
                  </View>
                </View>
                <BaseButton
                  label={t("subscribe")}
                  onPress={() => handleSubscribe("21")}
                  mt={16}
                />
              </View>
            )}

            {/* 26 Days Plan */}
            {data?.price_26_days !== null && (
              <View
                style={[
                  styles.pricingCard,
                  selectedDuration === "26" && styles.selectedPricing,
                ]}>
                <View style={styles.pricingHeader}>
                  <View style={styles.pricingContent}>
                    <Text variant="poppins16black_semibold" color="black">
                      {t("days_26")}
                    </Text>
                    <Text variant="poppins12black_regular" color="gray" mt="xs">
                      {t("excludes_friday")}
                    </Text>
                  </View>
                  <View style={styles.priceContainer}>
                    <Text variant="poppins12black_semibold" color="apptheme">
                      SAR
                    </Text>
                    <Text
                      variant="poppins18black_bold"
                      color="apptheme"
                      fontSize={22}>
                      {formatPrice(data.price_26_days!)}
                    </Text>
                  </View>
                </View>
                <BaseButton
                  label={t("subscribe")}
                  onPress={() => handleSubscribe("26")}
                  mt={16}
                />
              </View>
            )}

            {/* Monthly Plan */}
            {data?.price_monthly && (
              <View
                style={[
                  styles.pricingCard,
                  selectedDuration === "monthly" && styles.selectedPricing,
                ]}>
                <View style={styles.pricingHeader}>
                  <View style={styles.pricingContent}>
                    <Text variant="poppins16black_semibold" color="black">
                      {t("monthly_plan")}
                    </Text>
                    <Text variant="poppins12black_regular" color="gray" mt="xs">
                      {t("all_days_included")}
                    </Text>
                  </View>
                  <View style={styles.priceContainer}>
                    <Text variant="poppins12black_semibold" color="apptheme">
                      SAR
                    </Text>
                    <Text
                      variant="poppins18black_bold"
                      color="apptheme"
                      fontSize={22}>
                      {formatPrice(data.price_monthly)}
                    </Text>
                  </View>
                </View>
                <BaseButton
                  label={t("subscribe")}
                  onPress={() => handleSubscribe("monthly")}
                  mt={16}
                />
              </View>
            )}

            {(!data?.price_21_days &&
              !data?.price_26_days &&
              !data?.price_monthly) && (
              <View style={styles.emptyState}>
                <Text variant="poppins14black_regular" color="gray">
                  {t("no_pricing_available")}
                </Text>
              </View>
            )}
          </View>

          {/* Order Status Section */}
          <View style={styles.section}>
            <Text variant="poppins16black_semibold" mb="m" textAlign="left">
              {t("delivery_status")}
            </Text>
            <View style={styles.orderStatusCard}>
              {data?.orderStatus?.breakdown && (
                <View style={styles.statusContainer}>
                  <OrderStatusBar
                    label="listed"
                    count={data.orderStatus.breakdown.listed}
                    total={data.orderStatus.total || 0}
                    color={getStatusColor("listed")}
                    t={t}
                  />
                  <OrderStatusBar
                    label="pending"
                    count={data.orderStatus.breakdown.pending}
                    total={data.orderStatus.total || 0}
                    color={getStatusColor("pending")}
                    t={t}
                  />
                  <OrderStatusBar
                    label="done"
                    count={data.orderStatus.breakdown.done}
                    total={data.orderStatus.total || 0}
                    color={getStatusColor("done")}
                    t={t}
                  />
                  <OrderStatusBar
                    label="out_for_delivery"
                    count={data.orderStatus.breakdown.out_for_delivery}
                    total={data.orderStatus.total || 0}
                    color={getStatusColor("out_for_delivery")}
                    t={t}
                  />
                  <OrderStatusBar
                    label="delivered"
                    count={data.orderStatus.breakdown.delivered}
                    total={data.orderStatus.total || 0}
                    color={getStatusColor("delivered")}
                    t={t}
                  />
                </View>
              )}
              <View style={styles.deliverySummary}>
                <Text variant="poppins14black_semibold" color="black">
                  {t("total_delivered")}: {data?.orderStatus?.delivered || 0}
                </Text>
                <Text variant="poppins14black_semibold" color="black">
                  {t("total_orders")}: {data?.orderStatus?.total || 0}
                </Text>
              </View>
            </View>
          </View>

          {/* Description Section */}
          {data?.description && (
            <View style={styles.section}>
              <Text variant="poppins16black_semibold" mb="m" textAlign="left">
                {t("description")}
              </Text>
              <View style={styles.descriptionCard}>
                <Text
                  variant="poppins14black_regular"
                  color="black"
                  textAlign="left"
                  lineHeight={22}>
                  {i18n.language === "ar"
                    ? data.description_ar
                    : data.description}
                </Text>
              </View>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: "5%",
    paddingTop: "5%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: "10%",
  },
  section: {
    marginBottom: "6%",
  },
  heroSection: {
    width: width - 40,
    height: 200,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: "6%",
    alignSelf: "center",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
    padding: "5%",
  },
  caloriesBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.white,
    paddingHorizontal: "4%",
    paddingVertical: "2%",
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  headerSection: {
    marginBottom: "6%",
  },
  mealTypesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: "4%",
  },
  mealTypeBadge: {
    backgroundColor: theme.colors.lightGreen,
    paddingHorizontal: "4%",
    paddingVertical: "2%",
    borderRadius: 8,
    marginRight: "3%",
    marginBottom: "3%",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: "4%",
    width: "48%",
    marginBottom: "4%",
    alignItems: "center",
    shadowColor: "#0000001A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 3,
  },
  statCardBlue: {
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.second,
  },
  statCardPurple: {
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.apptheme,
  },
  statCardGreen: {
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.green,
  },
  statCardOrange: {
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.rank,
  },
  statCardTeal: {
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.lunch,
  },
  pricingCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: "5%",
    marginBottom: "4%",
    shadowColor: "#0000001A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: theme.colors.softGray,
  },
  selectedPricing: {
    borderColor: theme.colors.apptheme,
    borderWidth: 2,
  },
  pricingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  pricingContent: {
    flex: 1,
  },
  priceContainer: {
    alignItems: "flex-end",
  },
  orderStatusCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: "5%",
    shadowColor: "#0000001A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  statusContainer: {
    marginBottom: "4%",
  },
  statusBarRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: "3%",
  },
  statusBarLabel: {
    width: 120,
  },
  statusBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: theme.colors.softGray,
    borderRadius: 4,
    overflow: "hidden",
    marginHorizontal: "3%",
  },
  statusBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  deliverySummary: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: "4%",
    borderTopWidth: 1,
    borderTopColor: theme.colors.softGray,
  },
  descriptionCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: "5%",
    shadowColor: "#0000001A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  emptyState: {
    padding: "10%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.white,
    borderRadius: 16,
  },
});

export default MealPlanDetails;

