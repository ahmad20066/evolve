import { Text, theme } from "@/components/theme";
import { globalStyles } from "@/styles/globalStyles";
import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import Right from "@/assets/svg/smallright.svg";
import RNBounceable from "@freakycoder/react-native-bounceable";
import PackageSelector from "@/components/packageSelector";
import { AppNavigationProps } from "@/navigators/navigation";
import PackageSkeleton from "@/components/packageSkeleton";
import { useTranslation } from "react-i18next";
import { useMealPlans } from "@/hooks/useMealPlans";

const Meals = ({ navigation }: AppNavigationProps<"Meals">) => {
  const { t, i18n } = useTranslation();
  const filters = ["1 meal", "2 meals", "3 meals"];
  const [activeFilter, setactiveFilter] = useState("1 meal");
  const { data, isPending } = useMealPlans(
    activeFilter === "1 meal" ? 1 : activeFilter === "2 meals" ? 2 : 3
  );
  const [active, setActive] = useState<number>(data?.[0]?.id!);

  return (
    <>
      <ScrollView style={globalStyles.container}>
        <View style={styles.container}>
          <View style={[globalStyles.line2, styles.margin]}>
            <Text variant="poppins18black_semibold">{t("choose_meal")}</Text>
            <RNBounceable
              style={globalStyles.line}
              onPress={() => navigation.navigate("Menu")}
            >
              <Text me="s" variant="poppins14black_regular" color="gray">
                {t("menu")}
              </Text>
              <Right color={theme.colors.black} />
            </RNBounceable>
          </View>
        </View>
        <View style={globalStyles.line}>
          {filters.map((filter) => (
            <RNBounceable
              style={[
                styles.filters,
                {
                  backgroundColor:
                    activeFilter === filter
                      ? theme.colors.softGray
                      : theme.colors.white,
                },
              ]}
              key={filter}
              onPress={() => setactiveFilter(filter)}
            >
              <Text
                variant="poppins12black_regular"
                color={activeFilter === filter ? "apptheme" : "black"}
              >
                {filter}
              </Text>
            </RNBounceable>
          ))}
        </View>
        <View>
          <View>
            {isPending ? (
              <PackageSkeleton />
            ) : (
              Array.isArray(data) &&
              data.map((item) => (
                <PackageSelector
                  key={item.id}
                  item={item}
                  active={active}
                  setActive={setActive}
                  onPress={() => {
                    navigation.navigate("MealPlanDetails", {
                      id: item.id,
                    });
                  }}
                />
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: "5%",
  },
  margin: { marginTop: "5%" },
  filters: {
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: "5%",
    backgroundColor: theme.colors.white,
    borderRadius: 6,
    paddingHorizontal: "3%",
    marginTop: "3%",
  },
});

export default Meals;
