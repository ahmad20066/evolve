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
import { usePerformanceStats } from "@/hooks/usePerformanceStats";
import { useTranslation } from "react-i18next";
import { formatDate } from "@/utils/formatTime";
import Chart from "@/assets/svg/chart.svg";
import Fire from "@/assets/svg/fire.svg";
import Trophy from "@/assets/svg/cup.svg";
import Calendar from "@/assets/svg/calendar.svg";
import Clock from "@/assets/svg/clock.svg";
import { showToast } from "@/components/toast";
import Svg, { Circle, Polyline } from "react-native-svg";
import BaseButton from "@/components/baseBtn";
import RNBounceable from "@freakycoder/react-native-bounceable";

const { width } = Dimensions.get("window");

// Simple Line Chart Component for Weight Progress
const WeightLineChart = ({
  data,
}: {
  data: { date: string; weight: number }[];
}) => {
  if (!data || data.length === 0) {
    return (
      <View style={styles.emptyChart}>
        <Text variant="poppins14black_regular" color="gray" textAlign="center">
          No weight records yet
        </Text>
      </View>
    );
  }

  const chartWidth = width - 80;
  const chartHeight = 200;
  const padding = 40;
  const innerWidth = chartWidth - padding * 2;
  const innerHeight = chartHeight - padding * 2;

  const weights = data.map((d) => d.weight);
  const minWeight = Math.min(...weights);
  const maxWeight = Math.max(...weights);
  const weightRange = maxWeight - minWeight || 1;

  const points = data.map((d, index) => {
    const x = padding + (index / (data.length - 1 || 1)) * innerWidth;
    const y =
      padding +
      innerHeight -
      ((d.weight - minWeight) / weightRange) * innerHeight;
    return `${x},${y}`;
  });

  return (
    <View style={styles.chartContainer}>
      <Svg width={chartWidth} height={chartHeight}>
        <Polyline
          points={points.join(" ")}
          fill="none"
          stroke={theme.colors.apptheme}
          strokeWidth="3"
        />
        {data.map((d, index) => {
          const x = padding + (index / (data.length - 1 || 1)) * innerWidth;
          const y =
            padding +
            innerHeight -
            ((d.weight - minWeight) / weightRange) * innerHeight;
          return (
            <Circle
              key={index}
              cx={x}
              cy={y}
              r="5"
              fill={theme.colors.apptheme}
            />
          );
        })}
      </Svg>
      <View style={styles.chartLabels}>
        <Text variant="poppins12black_regular" color="gray" fontSize={10}>
          {data[0]?.date ? formatDate(data[0].date) : ""}
        </Text>
        <Text variant="poppins12black_regular" color="gray" fontSize={10}>
          {data[data.length - 1]?.date
            ? formatDate(data[data.length - 1].date)
            : ""}
        </Text>
      </View>
    </View>
  );
};

// Simple Bar Chart Component for Exercise Stats
const ExerciseBarChart = ({
  data,
}: {
  data: { exercise: string; totalWeight: number | null }[];
}) => {
  if (!data || data.length === 0) {
    return (
      <View style={styles.emptyChart}>
        <Text variant="poppins14black_regular" color="gray" textAlign="center">
          No exercise stats available
        </Text>
      </View>
    );
  }

  const sortedData = [...data]
    .filter((d) => d.totalWeight !== null)
    .sort((a, b) => (b.totalWeight || 0) - (a.totalWeight || 0))
    .slice(0, 5);

  const maxWeight = Math.max(
    ...sortedData.map((d) => d.totalWeight || 0),
    1
  );

  return (
    <View style={styles.barChartContainer}>
      {sortedData.map((item, index) => {
        const barWidth = ((item.totalWeight || 0) / maxWeight) * 100;
        return (
          <View key={index} style={styles.barItem}>
            <View style={styles.barLabelRow}>
              <Text
                variant="poppins12black_regular"
                color="black"
                style={styles.barLabel}
                numberOfLines={1}>
                {item.exercise}
              </Text>
              <Text variant="poppins12black_semibold" color="apptheme">
                {item.totalWeight} kg
              </Text>
            </View>
            <View style={styles.barContainer}>
              <View
                style={[
                  styles.bar,
                  {
                    width: `${barWidth}%`,
                    backgroundColor: theme.colors.apptheme,
                  },
                ]}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
};

const PerformanceStats = ({
  navigation,
}: AppNavigationProps<"PerformanceStats">) => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState<"workouts" | "exercises">(
    "workouts"
  );
  const {
    data,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = usePerformanceStats();

  const handleRefresh = () => {
    refetch();
  };

  // Check if error is 403 "No subscription for this user"
  const checkSubscriptionError = (err: any): boolean => {
    if (!err) return false;
    
    // First, check the original axios error structure (might be preserved)
    if (err?.response) {
      const responseData = err.response.data;
      const status = err.response.status;
      
      // Check for 403 status
      if (status === 403) {
        // Check if data contains subscription message
        if (responseData) {
          const dataStr = JSON.stringify(responseData).toLowerCase();
          if (dataStr.includes("no subscription") || 
              dataStr.includes("subscription") || 
              dataStr.includes("subscribe")) {
            return true;
          }
          
          // Check message field directly
          if (responseData?.message && 
              typeof responseData.message === "string" &&
              responseData.message.toLowerCase().includes("no subscription")) {
            return true;
          }
        }
      }
    }
    
    // Check errors array (from axios interceptor) - this is the primary format
    if (Array.isArray(err?.errors)) {
      const hasSubscriptionMessage = err.errors.some((errorMsg: any) => {
        // Handle string messages
        if (typeof errorMsg === "string") {
          return errorMsg.toLowerCase().includes("no subscription");
        }
        // Handle object messages (e.g., {message: 'No subscription for this user'})
        if (errorMsg && typeof errorMsg === "object") {
          const msg = errorMsg?.message || errorMsg?.detail || JSON.stringify(errorMsg);
          return typeof msg === "string" && msg.toLowerCase().includes("no subscription");
        }
        return false;
      });
      if (hasSubscriptionMessage) return true;
    }
    
    // Check error message in various formats
    const message = 
      err?.response?.data?.message ||
      err?.response?.data?.data?.message ||
      err?.message ||
      (typeof err?.errors === "string" ? err.errors : null);
    
    if (message) {
      const messageStr = typeof message === "string" 
        ? message.toLowerCase() 
        : JSON.stringify(message).toLowerCase();
      if (messageStr.includes("no subscription")) return true;
    }
    
    return false;
  };

  const isSubscriptionError = checkSubscriptionError(error);

  if (error) {
    // Show subscription required message
    if (isSubscriptionError) {
      return (
        <View style={[globalStyles.container, styles.container]}>
          <View style={globalStyles.line2}>
            <RoundButton onPress={() => navigation.goBack()}>
              <Back color={theme.colors.black} />
            </RoundButton>
            <Text variant="poppins18black_semibold" me="s">
              {t("performance_stats")}
            </Text>
            <View />
          </View>
          <View style={styles.subscriptionErrorContainer}>
            <Chart width={64} height={64} color={theme.colors.apptheme} />
            <Text 
              variant="poppins18black_bold" 
              color="black" 
              textAlign="center"
              mt="m"
              fontSize={22}
            >
              {t("subscription_required")}
            </Text>
            <Text 
              variant="poppins14black_regular" 
              color="gray" 
              textAlign="center"
              mt="s"
              style={styles.subscriptionMessage}
            >
              {t("subscribe_to_view_stats")}
            </Text>
            <BaseButton
              label={t("subscribe_now")}
              onPress={() => navigation.navigate("WorkoutPlan")}
              mt={24}
            />
          </View>
        </View>
      );
    }

    // Show generic error
    return (
      <View style={[globalStyles.container, styles.container]}>
        <View style={globalStyles.line2}>
          <RoundButton onPress={() => navigation.goBack()}>
            <Back color={theme.colors.black} />
          </RoundButton>
          <Text variant="poppins18black_semibold" me="s">
            {t("performance_stats")}
          </Text>
          <View />
        </View>
        <View style={styles.errorContainer}>
          <Text variant="poppins16black_regular" color="gray" textAlign="center">
            {t("error_loading_stats")}
          </Text>
          <BaseButton
            label={t("retry")}
            onPress={handleRefresh}
            mt={16}
          />
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
          {t("performance_stats")}
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
          {/* Weight Progress Section */}
          <View style={styles.section}>
            <Text
              variant="poppins16black_semibold"
              mb="m"
              textAlign="left">
              {t("weight_progress")}
            </Text>
            <View style={styles.card}>
              <WeightLineChart data={data?.weightChange || []} />
            </View>
          </View>

          {/* Overview Statistics */}
          <View style={styles.section}>
            <Text
              variant="poppins16black_semibold"
              mb="m"
              textAlign="left">
              {t("overview")}
            </Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Fire width={24} height={24} color={theme.colors.apptheme} />
                <Text
                  variant="poppins18black_bold"
                  color="apptheme"
                  mt="xs"
                  fontSize={24}>
                  {data?.totalWorkoutAttendance || 0}
                </Text>
                <Text variant="poppins12black_regular" color="gray" mt="xs">
                  {t("total_workouts_attended")}
                </Text>
              </View>
              <View style={styles.statCard}>
                <Trophy width={24} height={24} color={theme.colors.apptheme} />
                <Text
                  variant="poppins18black_bold"
                  color="apptheme"
                  mt="xs"
                  fontSize={24}>
                  {data?.distinctWorkouts || 0}
                </Text>
                <Text variant="poppins12black_regular" color="gray" mt="xs">
                  {t("unique_workouts")}
                </Text>
              </View>
              <View style={styles.statCard}>
                <Chart width={24} height={24} color={theme.colors.apptheme} />
                <Text
                  variant="poppins18black_bold"
                  color="apptheme"
                  mt="xs"
                  fontSize={24}>
                  {data?.totalExerciseCompletion || 0}
                </Text>
                <Text variant="poppins12black_regular" color="gray" mt="xs">
                  {t("total_exercises_completed")}
                </Text>
              </View>
              <View style={styles.statCard}>
                <Fire width={24} height={24} color={theme.colors.apptheme} />
                <Text
                  variant="poppins18black_bold"
                  color="apptheme"
                  mt="xs"
                  fontSize={24}>
                  {data?.distinctExercises || 0}
                </Text>
                <Text variant="poppins12black_regular" color="gray" mt="xs">
                  {t("unique_exercises")}
                </Text>
              </View>
              <View style={styles.statCard}>
                <Trophy width={24} height={24} color={theme.colors.apptheme} />
                <Text
                  variant="poppins18black_bold"
                  color="apptheme"
                  mt="xs"
                  fontSize={24}>
                  {data?.totalWorkoutCompletion || 0}
                </Text>
                <Text variant="poppins12black_regular" color="gray" mt="xs">
                  {t("workouts_completed")}
                </Text>
              </View>
            </View>
          </View>

          {/* Exercise Performance */}
          <View style={styles.section}>
            <Text
              variant="poppins16black_semibold"
              mb="m"
              textAlign="left">
              {t("top_exercises_by_weight")}
            </Text>
            <View style={styles.card}>
              <ExerciseBarChart data={data?.exerciseStatSummary || []} />
            </View>
          </View>

          {/* Recent Activity */}
          <View style={styles.section}>
            <Text
              variant="poppins16black_semibold"
              mb="m"
              textAlign="left">
              {t("recent_activity")}
            </Text>
            <View style={styles.tabContainer}>
              <RNBounceable
                style={[
                  styles.tab,
                  activeTab === "workouts" && styles.activeTab,
                ]}
                onPress={() => setActiveTab("workouts")}>
                <Text
                  variant="poppins14black_semibold"
                  color={activeTab === "workouts" ? "apptheme" : "gray"}>
                  {t("workouts")}
                </Text>
              </RNBounceable>
              <RNBounceable
                style={[
                  styles.tab,
                  activeTab === "exercises" && styles.activeTab,
                ]}
                onPress={() => setActiveTab("exercises")}>
                <Text
                  variant="poppins14black_semibold"
                  color={activeTab === "exercises" ? "apptheme" : "gray"}>
                  {t("exercises")}
                </Text>
              </RNBounceable>
            </View>

            {activeTab === "workouts" ? (
              <View style={styles.card}>
                {data?.recentActivity?.workouts?.length > 0 ? (
                  data.recentActivity.workouts.map((workout, index) => (
                    <View key={index} style={styles.activityItem}>
                      <View style={styles.activityContent}>
                        <Text variant="poppins14black_semibold" color="black">
                          {workout.title}
                        </Text>
                        <View style={globalStyles.line} mt="xs">
                          <Calendar
                            width={14}
                            height={14}
                            color={theme.colors.gray}
                          />
                          <Text
                            variant="poppins12black_regular"
                            color="gray"
                            ms="xs">
                            {formatDate(workout.date)}
                          </Text>
                          <Clock
                            width={14}
                            height={14}
                            color={theme.colors.gray}
                            style={{ marginLeft: 12 }}
                          />
                          <Text
                            variant="poppins12black_regular"
                            color="gray"
                            ms="xs">
                            {workout.duration} {t("min")}
                          </Text>
                        </View>
                        <Text
                          variant="poppins12black_regular"
                          color="gray"
                          mt="xs"
                          fontSize={11}>
                          {t("attended_on")}: {formatDate(workout.attendedAt)}
                        </Text>
                      </View>
                    </View>
                  ))
                ) : (
                  <View style={styles.emptyState}>
                    <Text variant="poppins14black_regular" color="gray">
                      {t("no_recent_workouts")}
                    </Text>
                  </View>
                )}
              </View>
            ) : (
              <View style={styles.card}>
                {data?.recentActivity?.exercises?.length > 0 ? (
                  data.recentActivity.exercises.map((exercise, index) => (
                    <View key={index} style={styles.activityItem}>
                      <View style={styles.activityContent}>
                        <Text variant="poppins14black_semibold" color="black">
                          {exercise.name}
                        </Text>
                        <Text
                          variant="poppins12black_regular"
                          color="gray"
                          mt="xs"
                          fontSize={11}>
                          {t("completed_on")}:{" "}
                          {formatDate(exercise.completedAt)}
                        </Text>
                      </View>
                    </View>
                  ))
                ) : (
                  <View style={styles.emptyState}>
                    <Text variant="poppins14black_regular" color="gray">
                      {t("no_recent_exercises")}
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
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
  subscriptionErrorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: "10%",
  },
  subscriptionMessage: {
    lineHeight: 22,
    paddingHorizontal: "5%",
  },
  section: {
    marginBottom: "6%",
  },
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: "5%",
    shadowColor: "#0000001A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
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
  chartContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: "3%",
  },
  chartLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: "2%",
  },
  emptyChart: {
    padding: "10%",
    alignItems: "center",
    justifyContent: "center",
  },
  barChartContainer: {
    paddingVertical: "2%",
  },
  barItem: {
    marginBottom: "5%",
  },
  barLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2%",
  },
  barLabel: {
    flex: 1,
    marginRight: "3%",
  },
  barContainer: {
    height: 8,
    backgroundColor: theme.colors.softGray,
    borderRadius: 4,
    overflow: "hidden",
  },
  bar: {
    height: "100%",
    borderRadius: 4,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: theme.colors.softGray,
    borderRadius: 12,
    padding: 4,
    marginBottom: "4%",
  },
  tab: {
    flex: 1,
    paddingVertical: "3%",
    alignItems: "center",
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: theme.colors.white,
  },
  activityItem: {
    paddingVertical: "4%",
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.softGray,
  },
  activityContent: {
    flex: 1,
  },
  emptyState: {
    padding: "10%",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default PerformanceStats;

