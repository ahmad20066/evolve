import { globalStyles } from "@/styles/globalStyles";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import Back from "@/assets/svg/arrow-left.svg";
import Tick from "@/assets/svg/tick-square.svg";
import RoundButton from "@/components/roundButton";
import { Text, theme } from "@/components/theme";
import { AppNavigationProps } from "@/navigators/navigation";
import RNBounceable from "@freakycoder/react-native-bounceable";
import BaseButton from "@/components/baseBtn";
import { useDeliveryTimes } from "@/hooks/useDeliveryTime";
import { showToast } from "@/components/toast";
import { useTranslation } from "react-i18next";

const DeliveryTime = ({
  navigation,
  route,
}: AppNavigationProps<"DeliveryTime">) => {
  const { meal_plan_id } = route.params;
  const { t, i18n } = useTranslation();
  const { data } = useDeliveryTimes();
  const [active, setactive] = useState<number | null>(null);

  return (
    <View style={[globalStyles.container, styles.container]}>
      <View style={styles.padd}>
        <View style={globalStyles.line2}>
          <RoundButton onPress={() => navigation.goBack()}>
            <Back color={theme.colors.black} />
          </RoundButton>
          <Text variant="poppins18black_semibold" me="s">
            {t("time")}
          </Text>
          <View />
        </View>
        <Text variant="poppins16black_medium" mt="l">
          {t("delivery_time")}
        </Text>
        {data?.map((item) => (
          <RNBounceable
            style={[
              globalStyles.line2,
              styles.item,
              globalStyles.shadow,
              {
                borderColor:
                  active == item.id
                    ? theme.colors.lightGreen
                    : theme.colors.white,
              },
            ]}
            onPress={() => setactive(item.id)}
            key={item.id}
          >
            <Text variant="poppins14black_regular" color="gray">
              {i18n.language == "ar" ? item.title_ar : item.title}
            </Text>

            <Tick
              color={
                active === item.id
                  ? theme.colors.lightGreen
                  : theme.colors.softGray
              }
            />
          </RNBounceable>
        ))}
      </View>
      <View style={[globalStyles.shadow, styles.padd]}>
        <BaseButton
          label={t("continue")}
          onPress={() => {
            if (active === null) {
              showToast(
                "errorToast",
                "Please select an appropriate time",
                "top"
              );
            } else {
              navigation.navigate("Location", {
                delivery_id: active,
                meal_plan_id,
              });
            }
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  padd: { paddingHorizontal: "5%", paddingVertical: "3%" },
  container: {
    flexDirection: "column",
    justifyContent: "space-between",
  },
  item: {
    borderWidth: 1,
    height: 55,
    borderRadius: 8,
    backgroundColor: theme.colors.white,
    paddingHorizontal: "5%",
    marginTop: "4%",
  },
});

export default DeliveryTime;
