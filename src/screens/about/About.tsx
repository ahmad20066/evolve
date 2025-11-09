import { globalStyles } from "@/styles/globalStyles";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import Back from "@/assets/svg/arrow-left.svg";
import BaseButton from "@/components/baseBtn";
import { Text, theme } from "@/components/theme";
import RoundButton from "@/components/roundButton";
import { AppNavigationProps } from "@/navigators/navigation";
import { useTranslation } from "react-i18next";

const About = ({ navigation, route }: AppNavigationProps<"About">) => {
  const { t } = useTranslation();
  const { age, weight, height, gender, sport } = route.params;
  const [time, setTime] = useState("");
  const [goal, setgoal] = useState("");
  const [loc, setloc] = useState("");
  return (
    <KeyboardAvoidingView
      style={[globalStyles.container, styles.container]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[globalStyles.container, styles.container]}>
          <View>
            <RoundButton onPress={() => navigation.goBack()}>
              <Back color={theme.colors.black} />
            </RoundButton>
            <Text
              mt="xl"
              mb="s"
              variant="poppins16black_medium"
              textAlign="center"
            >
              6
              <Text variant="poppins16black_regular" color="gray">
                /6
              </Text>
            </Text>
            <Text mb="s" textAlign="center" variant="unbounded20black_medium">
              {t("about")}{" "}
              <Text variant="unbounded20black_medium" color="apptheme">
                {t("you")}
              </Text>
            </Text>
            <Text
              mb="xl"
              textAlign="center"
              variant="poppins14black_regular"
              color="gray"
            >
              {t("weight_description")}
            </Text>
            <View>
              <Text textAlign="left" variant="poppins14black_regular">
                {t("how_long")}
              </Text>
              <TextInput
                style={styles.input2}
                placeholder="30 min"
                onChangeText={(e) => setTime(e)}
              />
              <Text textAlign="left" mt="l" variant="poppins14black_regular">
                {t("goal")}
              </Text>
              <TextInput
                style={styles.input}
                multiline
                textAlignVertical="top"
                placeholder="reduce weight"
                onChangeText={(e) => setgoal(e)}
              />
              <Text textAlign="left" mt="l" variant="poppins14black_regular">
                {t("train")}
              </Text>
              <TextInput
                style={styles.input2}
                placeholder="In the Gym"
                onChangeText={(e) => setloc(e)}
              />
            </View>
          </View>
          <BaseButton
            label={t("continue")}
            onPress={() =>
              navigation.navigate("Success", {
                age,
                weight,
                height,
                gender,
                sport,
                about: { location: loc, time, goal },
              })
            }
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: "5%",
    paddingBottom: 100, // Add extra padding at the bottom
  },
  container: {
    flex: 1,
  },
  headerContainer: {
    // Contains the header elements
  },
  input: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: theme.colors.black,
    height: 116,
    backgroundColor: theme.colors.input,
    borderRadius: 8,
    marginTop: "3%",
    padding: "5%",
  },
  input2: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: theme.colors.black,
    height: 55,
    backgroundColor: theme.colors.input,
    paddingHorizontal: "5%",
    marginTop: "3%",
    borderRadius: 8,
  },
});

export default About;
