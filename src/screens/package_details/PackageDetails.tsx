<<<<<<< HEAD
import { globalStyles } from "@/styles/globalStyles";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import Back from "@/assets/svg/arrow-left.svg";
import RoundButton from "@/components/roundButton";
import { Text, theme } from "@/components/theme";
import { AppNavigationProps } from "@/navigators/navigation";
import { usePackageDetails } from "@/hooks/usePackageDetails";
import { useTranslation } from "react-i18next";
import { formatDate } from "@/utils/formatTime";
import BaseButton from "@/components/baseBtn";
import RNBounceable from "@freakycoder/react-native-bounceable";
import Fire from "@/assets/svg/fire.svg";
import Trophy from "@/assets/svg/cup.svg";
import Chart from "@/assets/svg/chart.svg";
import { showToast } from "@/components/toast";
import { Platform } from "react-native";
import useRevenueCat from "@/hooks/useRevenueCat";
import Purchases from "react-native-purchases";
import { useSubscribeExercise } from "@/hooks/useSubscribeExercise";
import { CommonActions } from "@react-navigation/native";
import Svg, { Path } from "react-native-svg";

const { width } = Dimensions.get("window");

// Simple Star Icon Component
const StarIcon = ({
  size = 16,
  filled = false,
  color,
}: {
  size?: number;
  filled?: boolean;
  color?: string;
}) => {
  const fillColor = filled ? (color || theme.colors.apptheme) : "none";
  const strokeColor = filled
    ? color || theme.colors.apptheme
    : theme.colors.softGray;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={filled ? 0 : 1}
      />
    </Svg>
  );
};

// Star Rating Component
const StarRating = ({
  rating,
  size = 16,
  showNumber = false,
}: {
  rating: number;
  size?: number;
  showNumber?: boolean;
}) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <View style={styles.starContainer}>
      {showNumber && (
        <Text variant="poppins16black_bold" color="apptheme" me="xs">
          {rating.toFixed(1)}
        </Text>
      )}
      <View style={globalStyles.line}>
        {[...Array(fullStars)].map((_, i) => (
          <StarIcon key={i} size={size} filled={true} />
        ))}
        {hasHalfStar && (
          <StarIcon key="half" size={size} filled={true} />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <StarIcon key={i + fullStars} size={size} filled={false} />
        ))}
      </View>
    </View>
  );
};

// Rating Distribution Bar
const RatingBar = ({
  stars,
  count,
  total,
  t,
}: {
  stars: number;
  count: number;
  total: number;
  t: (key: string) => string;
}) => {
  const percentage = total > 0 ? (count / total) * 100 : 0;
  return (
    <View style={styles.ratingBarRow}>
      <View style={styles.ratingBarLabel}>
        <Text variant="poppins12black_regular" color="gray">
          {stars} {t("stars")}
        </Text>
      </View>
      <View style={styles.ratingBarContainer}>
        <View
          style={[
            styles.ratingBarFill,
            { width: `${percentage}%`, backgroundColor: theme.colors.apptheme },
          ]}
        />
      </View>
      <Text variant="poppins12black_regular" color="gray" ms="s">
        {count}
      </Text>
    </View>
  );
};
=======
import RoundButton from "@/components/roundButton";
import { globalStyles } from "@/styles/globalStyles";
import React from "react";
import { StyleSheet, View, Image } from "react-native";
import Back from "@/assets/svg/arrow-left.svg";
import { Text, theme } from "@/components/theme";
import { AppNavigationProps } from "@/navigators/navigation";
import BaseButton from "@/components/baseBtn";
import { useTranslation } from "react-i18next";
>>>>>>> 3bf8217b3a459dbf244f6553c144f2101a31f386

const PackageDetails = ({
  navigation,
  route,
}: AppNavigationProps<"PackageDetails">) => {
  const { t, i18n } = useTranslation();
<<<<<<< HEAD
  const { id } = route.params;
  const [selectedPricing, setSelectedPricing] = useState<number | null>(null);
  const { currentOffering, customerInfo } = useRevenueCat();
  const [isRevenueCatLoading, setIsRevenueCatLoading] = useState(false);

  const {
    data,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = usePackageDetails(id);

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
      showToast("errorToast", err.errors[0].message, "top");
    },
  });

  const handleRefresh = () => {
    refetch();
  };

  const handleSubscribe = async (pricingId: number) => {
    setSelectedPricing(pricingId);
    const pricing = data?.pricings.find((p) => p.id === pricingId);

    if (!pricing) {
      showToast("errorToast", "Invalid pricing selected", "top");
      return;
    }

    if (Platform.OS === "ios") {
      // Find matching RevenueCat package
      const rcPackage = currentOffering?.availablePackages.find(
        (pkg) =>
          String(pkg.product.identifier).toLowerCase() ===
            String(pricing.package_id).toLowerCase() ||
          String(pkg.product.identifier).toLowerCase() ===
            String(pricing.id).toLowerCase()
      );

      if (!rcPackage) {
        showToast("errorToast", "Package not available for purchase", "top");
        return;
      }

      try {
        setIsRevenueCatLoading(true);
        const purchaseResult = await Purchases.purchasePackage(rcPackage);
        const hasActiveEntitlements =
          purchaseResult.customerInfo.entitlements.active &&
          Object.keys(purchaseResult.customerInfo.entitlements.active).length >
            0;

        if (hasActiveEntitlements) {
          subExercise({
            package_id: pricing.package_id,
            pricing_id: pricing.id,
            payment_method: "iap",
            app_user_id: customerInfo?.originalAppUserId,
            coupon_code: undefined,
            apple_receipt: "a",
            expected_entitlement: Object.keys(
              purchaseResult.customerInfo.entitlements.active
            )[0],
            notes: "",
          });
        }
      } catch (error: any) {
        if (!error.userCancelled) {
          showToast("errorToast", error.message || "Purchase failed", "top");
        }
      } finally {
        setIsRevenueCatLoading(false);
      }
    } else {
      navigation.navigate("Payment", {
        package_id: pricing.package_id,
        pricing_id: pricing.id,
        pay_details: {
          title: i18n.language === "ar" ? data?.name_ar! : data?.name!,
          price: pricing.price,
          number_of_days: pricing.number_of_days,
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

  if (error) {
    return (
      <View style={[globalStyles.container, styles.container]}>
        <View style={globalStyles.line2}>
=======
  const { pay_details } = route.params;
  return (
    <View style={[globalStyles.container, styles.margin]}>
      <View>
        <View style={[globalStyles.line2, styles.head]}>
>>>>>>> 3bf8217b3a459dbf244f6553c144f2101a31f386
          <RoundButton onPress={() => navigation.goBack()}>
            <Back color={theme.colors.black} />
          </RoundButton>
          <Text variant="poppins18black_semibold" me="s">
<<<<<<< HEAD
            {t("package_details")}
          </Text>
          <View />
        </View>
        <View style={styles.errorContainer}>
          <Text variant="poppins16black_regular" color="gray" textAlign="center">
            {t("error_loading_package")}
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
          {t("package_details")}
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
          {/* Header Section */}
          <View style={styles.headerSection}>
            <View style={styles.headerContent}>
              <View style={styles.badge}>
                <Text variant="poppins12black_semibold" color="apptheme">
                  {data?.type === "group"
                    ? t("group")
                    : t("personalized")}
                </Text>
              </View>
              <Text
                variant="poppins18black_bold"
                mt="m"
                textAlign="left"
                fontSize={24}
                numberOfLines={2}>
                {i18n.language === "ar" ? data?.name_ar : data?.name}
              </Text>
              {data?.description && (
                <Text
                  variant="poppins14black_regular"
                  color="gray"
                  mt="s"
                  textAlign="left"
                  numberOfLines={3}>
                  {i18n.language === "ar"
                    ? data?.description_ar
                    : data?.description}
                </Text>
              )}
            </View>
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
              <View style={[styles.statCard, styles.statCardGreen]}>
                <Trophy width={24} height={24} color={theme.colors.green} />
                <Text
                  variant="poppins18black_bold"
                  color="green"
                  mt="xs"
                  fontSize={20}>
                  {data?.statistics?.totalWorkouts || 0}
                </Text>
                <Text variant="poppins12black_regular" color="gray" mt="xs">
                  {t("workouts")}
                </Text>
              </View>
              <View style={[styles.statCard, styles.statCardGold]}>
                <StarIcon
                  size={24}
                  filled={true}
                  color={theme.colors.rank}
                />
                <Text
                  variant="poppins18black_bold"
                  color="rank"
                  mt="xs"
                  fontSize={20}>
                  {data?.statistics?.averageRating?.toFixed(1) || "0.0"}
                </Text>
                <Text variant="poppins12black_regular" color="gray" mt="xs">
                  {t("rating")}
                </Text>
              </View>
              <View style={[styles.statCard, styles.statCardPurple]}>
                <Chart width={24} height={24} color={theme.colors.apptheme} />
                <Text
                  variant="poppins18black_bold"
                  color="apptheme"
                  mt="xs"
                  fontSize={20}>
                  {data?.statistics?.completionRate?.toFixed(1) || "0"}%
                </Text>
                <Text variant="poppins12black_regular" color="gray" mt="xs">
                  {t("completion_rate")}
                </Text>
              </View>
            </View>
          </View>

          {/* Pricing Section */}
          <View style={styles.section}>
            <Text variant="poppins16black_semibold" mb="m" textAlign="left">
              {t("pricing_plans")}
            </Text>
            {data?.pricings && data.pricings.length > 0 ? (
              data.pricings.map((pricing) => (
                <View
                  key={pricing.id}
                  style={[
                    styles.pricingCard,
                    selectedPricing === pricing.id && styles.selectedPricing,
                  ]}>
                  <View style={styles.pricingHeader}>
                    <View>
                      <Text variant="poppins16black_semibold" color="black">
                        {i18n.language === "ar"
                          ? pricing.title_ar
                          : pricing.title}
                      </Text>
                      <Text variant="poppins12black_regular" color="gray" mt="xs">
                        {pricing.number_of_days} {t("days")}
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
                        {formatPrice(pricing.price)}
                      </Text>
                    </View>
                  </View>
                  <BaseButton
                    label={t("subscribe")}
                    onPress={() => handleSubscribe(pricing.id)}
                    disabled={subPending || isRevenueCatLoading}
                    isLoading={subPending || isRevenueCatLoading}
                    mt={16}
                  />
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text variant="poppins14black_regular" color="gray">
                  {t("no_pricing_available")}
                </Text>
              </View>
            )}
          </View>

          {/* Ratings & Reviews Section */}
          <View style={styles.section}>
            <Text variant="poppins16black_semibold" mb="m" textAlign="left">
              {t("ratings_reviews")}
            </Text>
            <View style={styles.ratingsCard}>
              <View style={styles.ratingSummary}>
                <StarRating rating={data?.ratings?.average || 0} size={24} showNumber />
                <Text variant="poppins14black_regular" color="gray" mt="xs">
                  {data?.ratings?.count || 0} {t("reviews")}
                </Text>
              </View>
              {data?.ratings?.distribution && (
                <View style={styles.distributionContainer}>
                  {[5, 4, 3, 2, 1].map((stars) => (
                    <RatingBar
                      key={stars}
                      stars={stars}
                      count={data.ratings.distribution[stars as keyof typeof data.ratings.distribution] || 0}
                      total={data.ratings.count || 0}
                      t={t}
                    />
                  ))}
                </View>
              )}
            </View>

            {/* Recent Reviews */}
            {data?.ratings?.recent && data.ratings.recent.length > 0 ? (
              <View style={styles.reviewsContainer}>
                {data.ratings.recent.map((review, index) => (
                  <View key={index} style={styles.reviewCard}>
                    <View style={globalStyles.line2}>
                      <StarRating rating={review.rating} size={14} />
                      <Text
                        variant="poppins12black_regular"
                        color="gray"
                        fontSize={11}>
                        {formatDate(review.createdAt)}
                      </Text>
                    </View>
                    {review.message && (
                      <Text
                        variant="poppins14black_regular"
                        color="black"
                        mt="xs"
                        textAlign="left">
                        {review.message}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Text variant="poppins14black_regular" color="gray">
                  {t("no_reviews_yet")}
                </Text>
              </View>
            )}
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
=======
            {pay_details.title}
          </Text>
          <View />
        </View>
        <Image
          source={{ uri: pay_details.image }}
          style={styles.img}
          resizeMode="cover"
        />
        <View style={globalStyles.line2}>
          <Text textAlign="left" variant="poppins16black_medium" mb="s">
            {pay_details.title}
          </Text>
          <Text textAlign="left" variant="poppins16black_semibold" mb="s">
            ${pay_details.price}
          </Text>
        </View>
        <Text
          textAlign="left"
          variant="poppins12black_regular"
          color="gray"
          mb="s"
        >
          {pay_details.description}
        </Text>
        <Text textAlign="left" variant="poppins16black_semibold" mb="s">
          Number of Days: {pay_details.number_of_days}
        </Text>
      </View>
      <BaseButton
        label={t("next")}
        onPress={() =>
          navigation.navigate("DeliveryTime", {
            meal_plan_id: pay_details.meal_plan_id,
            pay_details: {
              title: pay_details.title,
              price: pay_details.price,
              number_of_days: pay_details.number_of_days,
            },
          })
        }
      />
>>>>>>> 3bf8217b3a459dbf244f6553c144f2101a31f386
    </View>
  );
};

const styles = StyleSheet.create({
<<<<<<< HEAD
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
  headerSection: {
    marginBottom: "6%",
  },
  headerContent: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: "5%",
    shadowColor: "#0000001A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  badge: {
    backgroundColor: theme.colors.lightGreen,
    paddingHorizontal: "4%",
    paddingVertical: "2%",
    borderRadius: 8,
    alignSelf: "flex-start",
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
  statCardGreen: {
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.green,
  },
  statCardGold: {
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.rank,
  },
  statCardPurple: {
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.apptheme,
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
  priceContainer: {
    alignItems: "flex-end",
  },
  ratingsCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: "5%",
    marginBottom: "4%",
    shadowColor: "#0000001A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  ratingSummary: {
    alignItems: "center",
    marginBottom: "5%",
  },
  distributionContainer: {
    marginTop: "4%",
  },
  ratingBarRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: "3%",
  },
  ratingBarLabel: {
    width: 50,
  },
  ratingBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: theme.colors.softGray,
    borderRadius: 4,
    overflow: "hidden",
    marginHorizontal: "3%",
  },
  ratingBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  reviewsContainer: {
    marginTop: "4%",
  },
  reviewCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    padding: "4%",
    marginBottom: "3%",
    shadowColor: "#0000001A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 3,
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
  starContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  halfStar: {
    overflow: "hidden",
    width: 16,
  },
});

export default PackageDetails;

=======
  margin: {
    marginHorizontal: "5%",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  head: { marginVertical: "3%" },
  img: { borderRadius: 10, height: 200, marginVertical: "5%" },
});

export default PackageDetails;
>>>>>>> 3bf8217b3a459dbf244f6553c144f2101a31f386
