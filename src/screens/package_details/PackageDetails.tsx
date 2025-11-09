import RoundButton from "@/components/roundButton";
import { globalStyles } from "@/styles/globalStyles";
import React from "react";
import { StyleSheet, View, Image } from "react-native";
import Back from "@/assets/svg/arrow-left.svg";
import { Text, theme } from "@/components/theme";
import { AppNavigationProps } from "@/navigators/navigation";
import BaseButton from "@/components/baseBtn";
import { useTranslation } from "react-i18next";

const PackageDetails = ({
  navigation,
  route,
}: AppNavigationProps<"PackageDetails">) => {
  const { t, i18n } = useTranslation();
  const { pay_details } = route.params;
  return (
    <View style={[globalStyles.container, styles.margin]}>
      <View>
        <View style={[globalStyles.line2, styles.head]}>
          <RoundButton onPress={() => navigation.goBack()}>
            <Back color={theme.colors.black} />
          </RoundButton>
          <Text variant="poppins18black_semibold" me="s">
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
    </View>
  );
};

const styles = StyleSheet.create({
  margin: {
    marginHorizontal: "5%",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  head: { marginVertical: "3%" },
  img: { borderRadius: 10, height: 200, marginVertical: "5%" },
});

export default PackageDetails;
