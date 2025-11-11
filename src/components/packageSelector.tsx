import React from "react";
import { Image, StyleSheet, View } from "react-native";
import Fire from "@/assets/svg/fire.svg";
import Tick from "@/assets/svg/tick-circle.svg";
import Calendar from "@/assets/svg/calendar.svg";
import { Text, theme } from "./theme";
import { globalStyles } from "@/styles/globalStyles";
import RNBounceable from "@freakycoder/react-native-bounceable";
import { IMealPlans } from "@/hooks/useMealPlans";
import { useTranslation } from "react-i18next";

interface packaegProps {
  item: IMealPlans;
  active: number;
  setActive: (active: number) => void;
  onPress?: () => void;
}

const PackageSelector = ({ item, active, setActive, onPress }: packaegProps) => {
  const isActive = active === item.id;
  const { i18n } = useTranslation();

  return (
    <RNBounceable
      style={[
        styles.container,
        isActive && {
          borderWidth: 1,
          borderColor: theme.colors.apptheme,
        },
      ]}
      onPress={() => {
        setActive(item.id);
        if (onPress) {
          onPress();
        }
      }}
    >
      {typeof item.image === "string" ? (
        <Image source={{ uri: `${item.image}` }} style={styles.image} />
      ) : (
        <Image source={{ uri: `${item.image}` }} style={styles.image} />
      )}
      <Text
        mt="m"
        mb="s"
        variant="poppins16black_semibold"
        textTransform="capitalize"
        numberOfLines={2}
      >
        {i18n.language == "ar" ? item.title_ar : item.title}
      </Text>
      <View style={[globalStyles.line, styles.margin]}>
        <Fire width={18} height={18} color={theme.colors.mediumGray} />
        <Text
          ms="s"
          style={styles.text}
          variant="poppins12black_regular"
          color="gray"
          numberOfLines={1}
        >
          Serves up to {item.calories} cal
        </Text>
      </View>
      <View style={[globalStyles.line, styles.margin]}>
        <Calendar width={18} height={18} color={theme.colors.mediumGray} />
        <Text ms="s" variant="poppins12black_regular" color="gray">
          Skip any time
        </Text>
      </View>
      <View style={[globalStyles.line, styles.margin]}>
        <Tick color={theme.colors.mediumGray} />
        <Text ms="s" variant="poppins12black_regular" color="gray">
          {item.number_of_days} days meal plan
        </Text>
      </View>
      <View style={[globalStyles.line, styles.margin]}>
        <Text
          variant="poppins12black_semibold"
          color="apptheme"
          lineHeight={12}
        >
          SAR
        </Text>
        <Text
          variant="poppins18black_semibold"
          color="apptheme"
          fontSize={24}
          lineHeight={41}
        >
          {item.price_monthly}
        </Text>
        <Text variant="poppins12black_regular" color="gray" lineHeight={41}>
          /Monthly
        </Text>
      </View>
    </RNBounceable>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingBottom: 10,
    borderRadius: 12,
    shadowColor: "#0000001A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    backgroundColor: theme.colors.white,
    elevation: 5,
    marginVertical: 10,
    marginHorizontal: 20,
    alignItems: "flex-start",
    paddingHorizontal: 15,
  },
  margin: { marginTop: "1%" },
  image: { width: "100%", height: 80, borderRadius: 8 },
  svg: {
    backgroundColor: theme.colors.input,
    justifyContent: "center",
    alignItems: "center",
    width: 48,
    height: 48,
    borderRadius: 12,
  },
  text: { maxWidth: 200 },
});

export default PackageSelector;
