import React from "react";
import { StyleSheet, View } from "react-native";
import Tick from "@/assets/svg/tick-circle.svg";
import Calendar from "@/assets/svg/calendar.svg";
import { Text, theme } from "./theme";
import RNBounceable from "@freakycoder/react-native-bounceable";
import Crown from "@/assets/svg/crown.svg";
import { useTranslation } from "react-i18next";
import { calculateMonths } from "@/utils/month";
import { IWorkoutPlans } from "@/hooks/useWorkoutPlans";

interface packageProps {
  item: IWorkoutPlans;
  active: number | undefined;
  setActive: (active: number) => void;
  onItemSelected: (item: IWorkoutPlans) => void;
  islast?: boolean;
}
const WorkoutSelector = ({
  item,
  active,
  setActive,
  onItemSelected,
}: packageProps) => {
  const isActive = active === item.id;
  const { i18n } = useTranslation();

  return (
    <RNBounceable
      style={[
        styles.container,
        isActive && styles.activeContainer,
      ]}
      onPress={() => {
        setActive(item.id);
        onItemSelected(item);
      }}
    >
      <View style={styles.cardContent}>
        <View style={styles.headerRow}>
          <View style={[styles.iconContainer, isActive && styles.activeIcon]}>
            <Crown 
              color={isActive ? theme.colors.white : theme.colors.apptheme} 
              width={24} 
              height={24} 
            />
          </View>
          <View style={styles.titleContainer}>
            <Text
              variant="poppins18black_bold"
              fontSize={20}
              textTransform="capitalize"
              numberOfLines={2}
            >
              {i18n.language == "ar" ? item.name_ar : item.name}
            </Text>
          </View>
        </View>

        {item.description && (
          <Text
            variant="poppins14black_regular"
            color="gray"
            mt="s"
            mb="m"
            numberOfLines={3}
            style={styles.description}
          >
            {i18n.language == "ar" ? item.description_ar : item.description}
          </Text>
        )}

        <View style={styles.featuresContainer}>
          <View style={styles.featureRow}>
            <Calendar width={18} height={18} color={theme.colors.apptheme} />
            <Text ms="s" variant="poppins12black_regular" color="gray">
              Skip any time
            </Text>
          </View>
          <View style={styles.featureRow}>
            <Tick color={theme.colors.apptheme} width={18} height={18} />
            <Text ms="s" variant="poppins12black_regular" color="gray">
              1 week / 6 days
            </Text>
          </View>
        </View>

        <View style={styles.priceContainer}>
          <View style={styles.priceRow}>
            <Text variant="poppins12black_semibold" color="apptheme">
              SAR
            </Text>
            <Text
              variant="poppins18black_bold"
              color="apptheme"
              fontSize={28}
              ms="xs"
            >
              {item?.pricings?.[0]?.price.toFixed(2)}
            </Text>
          </View>
          <Text variant="poppins12black_regular" color="gray" mt="xs">
            / {calculateMonths(item?.pricings?.[0]?.number_of_days)} month
            {calculateMonths(item?.pricings?.[0]?.number_of_days) > 1 ? "s" : ""}
          </Text>
        </View>
      </View>
    </RNBounceable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    backgroundColor: theme.colors.white,
    marginBottom: 16,
    shadowColor: "#0000001A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 2,
    borderColor: theme.colors.softGray,
  },
  activeContainer: {
    borderColor: theme.colors.apptheme,
    backgroundColor: theme.colors.lighyellow,
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  cardContent: {
    padding: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: theme.colors.lightGreen,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  activeIcon: {
    backgroundColor: theme.colors.apptheme,
  },
  titleContainer: {
    flex: 1,
    justifyContent: "center",
  },
  description: {
    lineHeight: 20,
  },
  featuresContainer: {
    marginTop: 16,
    marginBottom: 16,
    gap: 10,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  priceContainer: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.softGray,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
});

export default WorkoutSelector;
