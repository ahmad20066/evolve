import { Text, theme } from "@/components/theme";
import { globalStyles } from "@/styles/globalStyles";
import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import Right from "@/assets/svg/smallright.svg";
import RNBounceable from "@freakycoder/react-native-bounceable";
import BaseButton from "@/components/baseBtn";
import PackageSelector from "@/components/packageSelector";
import { AppNavigationProps } from "@/navigators/navigation";
import { useMealPans } from "@/hooks/useMealPlans";
import PackageSkeleton from "@/components/packageSkeleton";
import { useTranslation } from "react-i18next";

const Meals = ({ navigation }: AppNavigationProps<"Meals">) => {
  const { t } = useTranslation();
  const { data, isPending } = useMealPans();
  const [active, setActive] = useState<number>(data?.[0]?.id!);

  return (
    <View style={globalStyles.container}>
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
      <View>
        <ScrollView showsHorizontalScrollIndicator={false} horizontal>
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
              />
            ))
          )}
        </ScrollView>
      </View>
      <View style={styles.container}>
        <BaseButton
          label={t("next")}
          onPress={() =>
            navigation.navigate("DeliveryTime", {
              meal_plan_id: active,
            })
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

export default Meals;
