import { globalStyles } from "@/styles/globalStyles";
import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import Back from "@/assets/svg/arrow-left.svg";
import Tick from "@/assets/svg/tick-square.svg";
import Calendar from "@/assets/svg/calendar.svg";
import RoundButton from "@/components/roundButton";
import { Text, theme } from "@/components/theme";
import { AppNavigationProps } from "@/navigators/navigation";
import RNBounceable from "@freakycoder/react-native-bounceable";
import BaseButton from "@/components/baseBtn";
import { showToast } from "@/components/toast";
import { useTranslation } from "react-i18next";
import { IMealPlans } from "@/hooks/useMealPlans";

interface DurationOption {
  days: number;
  price: number | null | undefined;
  label: string;
  excludedDays: string[];
  available: boolean;
  badge?: string;
}

const DurationSelection = ({
  navigation,
  route,
}: AppNavigationProps<"DurationSelection">) => {
  const { meal_plan_id, meal_plan } = route.params;
  const { t, i18n } = useTranslation();
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);

  // Build duration options based on available prices
  const durationOptions: DurationOption[] = [
    {
      days: 21,
      price: meal_plan?.price_21_days,
      label: t("days_21"),
      excludedDays: [t("friday"), t("saturday")],
      available: meal_plan?.price_21_days != null && meal_plan.price_21_days > 0,
      badge: t("popular"),
    },
    {
      days: 26,
      price: meal_plan?.price_26_days,
      label: t("days_26"),
      excludedDays: [t("friday")],
      available: meal_plan?.price_26_days != null && meal_plan.price_26_days > 0,
      badge: t("best_value"),
    },
    {
      days: 30,
      price: meal_plan?.price_monthly,
      label: t("monthly_plan"),
      excludedDays: [],
      available: meal_plan?.price_monthly != null && meal_plan.price_monthly > 0,
      badge: t("full_access"),
    },
  ].filter((option) => option.available);

  const getSelectedPrice = () => {
    if (selectedDuration === 21) return meal_plan?.price_21_days;
    if (selectedDuration === 26) return meal_plan?.price_26_days;
    if (selectedDuration === 30) return meal_plan?.price_monthly;
    return null;
  };

  const getSelectedDays = () => {
    if (selectedDuration === 21) return 21;
    if (selectedDuration === 26) return 26;
    if (selectedDuration === 30) return meal_plan?.number_of_days || 30;
    return null;
  };

  const handleContinue = () => {
    if (selectedDuration === null) {
      showToast("errorToast", t("select_duration_error"), "top");
      return;
    }

    const selectedOption = durationOptions.find(
      (opt) => opt.days === selectedDuration
    );
    if (!selectedOption) {
      showToast("errorToast", t("duration_not_available"), "top");
      return;
    }

    navigation.navigate("DeliveryTime", {
      meal_plan_id,
      subscription_duration: selectedDuration === 30 ? undefined : selectedDuration,
      pay_details: {
        title:
          i18n.language === "ar" ? meal_plan?.title_ar : meal_plan?.title || "",
        price: getSelectedPrice() || 0,
        number_of_days: getSelectedDays() || 0,
      },
    });
  };

  return (
    <View style={[globalStyles.container, styles.container]}>
      <View style={styles.header}>
        <View style={globalStyles.line2}>
          <RoundButton onPress={() => navigation.goBack()}>
            <Back color={theme.colors.black} />
          </RoundButton>
          <Text variant="poppins18black_semibold" me="s">
            {t("choose_duration")}
          </Text>
          <View />
        </View>
        <Text variant="poppins16black_medium" mt="l" mb="s">
          {t("select_subscription_duration")}
        </Text>
        <Text variant="poppins12black_regular" color="gray" mb="m">
          {i18n.language === "ar" ? meal_plan?.title_ar : meal_plan?.title}
        </Text>
      </View>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {durationOptions.map((option) => {
          const isSelected = selectedDuration === option.days;
          const isDisabled = !option.available;

          return (
            <RNBounceable
              key={option.days}
              onPress={() => {
                if (!isDisabled) {
                  setSelectedDuration(option.days);
                }
              }}
              style={[
                styles.optionCard,
                globalStyles.shadow,
                {
                  borderColor: isSelected
                    ? theme.colors.apptheme
                    : theme.colors.softGray,
                  borderWidth: isSelected ? 2 : 1,
                  backgroundColor: isSelected
                    ? theme.colors.lighyellow
                    : theme.colors.white,
                  opacity: isDisabled ? 0.5 : 1,
                },
              ]}
            >
              <View style={styles.optionContent}>
                <View style={styles.optionHeader}>
                  <View style={styles.leftSection}>
                    {option.badge && (
                      <View
                        style={[
                          styles.badge,
                          {
                            backgroundColor: isSelected
                              ? theme.colors.apptheme
                              : theme.colors.softGray,
                          },
                        ]}
                      >
                        <Text
                          variant="poppins12black_semibold"
                          color={isSelected ? "white" : "gray"}
                          style={styles.badgeText}
                        >
                          {option.badge}
                        </Text>
                      </View>
                    )}
                    <Text
                      variant="poppins18black_semibold"
                      color={isSelected ? "apptheme" : "black"}
                      mt={option.badge ? "xs" : 0}
                    >
                      {option.label}
                    </Text>
                    <View style={[globalStyles.line, styles.infoRow]}>
                      <Calendar
                        width={16}
                        height={16}
                        color={
                          isSelected
                            ? theme.colors.apptheme
                            : theme.colors.mediumGray
                        }
                      />
                      {option.excludedDays.length > 0 ? (
                        <Text
                          variant="poppins12black_regular"
                          color={isSelected ? "apptheme" : "gray"}
                          ms="xs"
                        >
                          {t("excludes")}: {option.excludedDays.join(` ${t("and")} `)}
                        </Text>
                      ) : (
                        <Text
                          variant="poppins12black_regular"
                          color={isSelected ? "apptheme" : "gray"}
                          ms="xs"
                        >
                          {t("all_days_included")}
                        </Text>
                      )}
                    </View>
                  </View>
                  <View
                    style={[
                      styles.checkbox,
                      {
                        backgroundColor: isSelected
                          ? theme.colors.apptheme
                          : theme.colors.white,
                        borderColor: isSelected
                          ? theme.colors.apptheme
                          : theme.colors.softGray,
                      },
                    ]}
                  >
                    {isSelected && (
                      <Tick
                        color={theme.colors.white}
                        width={16}
                        height={16}
                      />
                    )}
                  </View>
                </View>
                <View style={[globalStyles.line, styles.priceRow]}>
                  <View>
                    <Text variant="poppins12black_semibold" color="apptheme">
                      SAR
                    </Text>
                  </View>
                  <Text
                    variant="poppins18black_semibold"
                    color="apptheme"
                    ms="s"
                    fontSize={28}
                  >
                    {option.price}
                  </Text>
                  {option.days === 30 && (
                    <Text
                      variant="poppins12black_regular"
                      color="gray"
                      ms="xs"
                      mt="xs"
                    >
                      {t("per_month")}
                    </Text>
                  )}
                </View>
              </View>
            </RNBounceable>
          );
        })}
      </ScrollView>
      <View style={[globalStyles.shadow, styles.footer]}>
        <View style={styles.buttonContainer}>
          <BaseButton
            label={t("continue")}
            onPress={handleContinue}
            disabled={selectedDuration === null}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: "5%",
    paddingTop: "3%",
    paddingBottom: "2%",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: "5%",
    paddingBottom: "2%",
  },
  footer: {
    paddingHorizontal: "5%",
    paddingTop: "3%",
    paddingBottom: "5%",
    width: "100%",
  },
  buttonContainer: {
    width: "100%",
  },
  optionCard: {
    borderRadius: 16,
    backgroundColor: theme.colors.white,
    padding: "5%",
    marginBottom: "4%",
    borderWidth: 1,
  },
  optionContent: {
    width: "100%",
  },
  optionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "4%",
  },
  leftSection: {
    flex: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginBottom: 4,
  },
  badgeText: {
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    lineHeight: 12,
  },
  infoRow: {
    marginTop: 6,
    alignItems: "center",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
  priceRow: {
    marginTop: "3%",
    alignItems: "flex-end",
    justifyContent: "flex-start",
  },
});

export default DurationSelection;

