import { AppNavigationProps } from "@/navigators/navigation";
import { globalStyles } from "@/styles/globalStyles";
import React from "react";
import { StyleSheet, View } from "react-native";
import WebView from "react-native-webview";
import Back from "@/assets/svg/arrow-left.svg";
import RoundButton from "@/components/roundButton";
import { Text, theme } from "@/components/theme";
import { CommonActions } from "@react-navigation/native";

const Checkout = ({ route, navigation }: AppNavigationProps<"Checkout">) => {
  const { url } = route.params;
  return (
    <View style={globalStyles.container}>
      <View style={[globalStyles.line2, styles.margin]}>
        <RoundButton
          onPress={() =>
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: "MainTab" }],
              })
            )
          }
        >
          <Back color={theme.colors.black} />
        </RoundButton>
        <Text variant="poppins18black_medium" me="s">
          Checkout
        </Text>
        <View />
      </View>
      <WebView source={{ uri: url }} style={{ flex: 1 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  margin: { marginHorizontal: "5%", marginVertical: "2%" },
});

export default Checkout;
