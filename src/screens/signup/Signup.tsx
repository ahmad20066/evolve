import BaseButton from "@/components/baseBtn";
import RoundButton from "@/components/roundButton";
import TextInput from "@/components/textinput";
import { Text, theme } from "@/components/theme";
import { AppNavigationProps } from "@/navigators/navigation";
import { globalStyles } from "@/styles/globalStyles";
import RNBounceable from "@freakycoder/react-native-bounceable";
import React, { useState } from "react";
import { Platform, StyleSheet, Switch, View } from "react-native";
import Sms from "@/assets/svg/sms.svg";
import User from "@/assets/svg/frame.svg";
import Phone from "@/assets/svg/mobile.svg";
import Lock from "@/assets/svg/lock.svg";
import Back from "@/assets/svg/arrow-left.svg";
import Eye from "@/assets/svg/eye.svg";
import EyeSlash from "@/assets/svg/eye-slash.svg";
import FB from "@/assets/svg/facebook.svg";
import Google from "@/assets/svg/google.svg";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useSignup } from "@/hooks/useSignup";
import { showToast } from "@/components/toast";
import { useAppSelector } from "@/store";
import { useTranslation } from "react-i18next";

const SignupSchema = Yup.object().shape({
  name: Yup.string().required(),
  phone_number: Yup.string().matches(
    /^[0-9]+$/,
    "Phone number must be numeric"
  ),
  email: Yup.string()
    .email("Invalid Email Address")
    .required("Email is Required")
    .trim(),
  password: Yup.string()
    .required("Password is required")
    .trim()
    // .min(8, 'Password must be at least 8 characters')
    .required("Password is required"),
  // .matches(
  //   /[!@#$%^&*(),.?":{}|<>0-9]/,
  //   'Password must contain at least 1 special character',
  // )
  // .matches(/[0-9]/, 'Password must contain at least 1 number')
  // .matches(/[A-Z]/, 'Password must contain at least 1 uppercase letter')
  // .matches(/[a-z]/, 'Password must contain at least 1 lowercase letter'),
  termsAccepted: Yup.boolean()
    .required("You must accept the terms and conditions")
    .oneOf([true], "You must accept the terms and conditions"),
});

const Signup = ({ navigation }: AppNavigationProps<"Signup">) => {
  const { t } = useTranslation();
  const [pass, setpass] = useState(false);
  const { fcm_token } = useAppSelector((state) => state.local);

  const { mutate } = useSignup({
    onSuccess(data) {
      setSubmitting(false);
      showToast("successToast", data.message, "top");
      navigation.navigate("VerifyIdentity", { email: values.email });
    },
    onError(error: any) {
      showToast("errorToast", error.errors[0].message, "top");
      setSubmitting(false);
    },
  });
  const {
    handleChange,
    handleBlur,
    handleSubmit,
    values,
    errors,
    touched,
    isSubmitting,
    setSubmitting,
    setFieldValue,
    setFieldTouched,
  } = useFormik({
    validationSchema: SignupSchema,
    initialValues: {
      name: "",
      phone_number: "",
      email: "",
      password: "",
      termsAccepted: false,
    },
    onSubmit: (value) => {
      if (!value.termsAccepted) {
        setFieldTouched("termsAccepted", true);
        showToast("errorToast", "You must accept the terms and conditions", "top");
        return;
      }
      const payload: any = {
        email: value.email,
        password: value.password,
        name: value.name,
        role: "consumer",
        fcm_token,
      };
      if (value.phone_number) {
        payload.phone = value.phone_number;
      }
      mutate(payload);
    },
  });
  return (
    <View style={globalStyles.container}>
      <View style={styles.container}>
        <RoundButton onPress={() => navigation.goBack()}>
          <Back color={theme.colors.black} />
        </RoundButton>
        <Text textAlign="left" mt="l" variant="poppinsTitle20black_semibold">
          {t("signup")}
        </Text>
        <Text
          textAlign="left"
          mt="m"
          variant="poppins14black_regular"
          color="gray"
        >
          {t("create")}{" "}
          <Text
            variant="poppins14black_bold"
            textTransform="uppercase"
            color="apptheme"
          >
            {t("evolve")}
          </Text>{" "}
          {t("account")}
        </Text>
        <TextInput
          placeholder={t("name_placeholder")}
          leftIcon={<User />}
          onChangeText={handleChange("name")}
          onBlur={handleBlur("name")}
          error={errors.name}
          touched={touched.name}
        />
        <TextInput
          placeholder={t("email_placeholder")}
          leftIcon={<Sms />}
          onChangeText={handleChange("email")}
          onBlur={handleBlur("email")}
          error={errors.email}
          touched={touched.email}
        />
        {Platform.OS == "android" && (
          <TextInput
            placeholder={t("phone_placeholder")}
            leftIcon={<Phone />}
            keyboardType="number-pad"
            onChangeText={handleChange("phone_number")}
            onBlur={handleBlur("phone_number")}
            error={errors.phone_number}
            touched={touched.phone_number}
          />
        )}
        <TextInput
          placeholder={t("password_placeholder")}
          onChangeText={handleChange("password")}
          onBlur={handleBlur("password")}
          error={errors.password}
          touched={touched.password}
          leftIcon={<Lock />}
          secureTextEntry={!pass}
          rightIcon={pass ? <Eye /> : <EyeSlash />}
          onPressIcon={() => setpass(!pass)}
        />
        <View style={[globalStyles.line, styles.margin]}>
          <Switch
            trackColor={{
              false: theme.colors.input,
              true: theme.colors.lighyellow,
            }}
            thumbColor={theme.colors.white}
            ios_backgroundColor={theme.colors.input}
            onValueChange={(value) => setFieldValue("termsAccepted", value)}
            value={values.termsAccepted}
            style={styles.switch}
          />
          <Text variant="poppins12black_regular" color="gray">
            {t("agree")}
          </Text>
        </View>
        {errors.termsAccepted && touched.termsAccepted && (
          <Text variant="poppins12black_regular" color="red" ms="s">
            {errors.termsAccepted}
          </Text>
        )}

        <BaseButton
          label={t("signup")}
          disabled={isSubmitting || !values.termsAccepted}
          isLoading={isSubmitting}
          onPress={handleSubmit as () => void}
        />
        {/* <Text
          mb="m"
          variant="poppins16black_medium"
          color="gray"
          textTransform="uppercase"
          textAlign="center">
          {t('or')}
        </Text>
        <View style={[globalStyles.line, styles.socials]}>
          <RNBounceable style={styles.social}>
            <FB />
          </RNBounceable>
          <RNBounceable style={styles.social}>
            <Google />
          </RNBounceable>
        </View> */}
        <RNBounceable onPress={() => navigation.navigate("Login")}>
          <Text
            textAlign="center"
            color="gray"
            variant="poppins12black_regular"
          >
            {t("already")}
            <Text
              textDecorationLine="underline"
              variant="poppins12black_regular"
              color="apptheme"
            >
              {" "}
              {t("login")}
            </Text>
          </Text>
        </RNBounceable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: "5%" },
  btn: { height: 55 },
  switch: { transform: [{ scaleX: 0.5 }, { scaleY: 0.5 }] },
  margin: { marginTop: "5%", marginBottom: "2%" },
  social: {
    backgroundColor: theme.colors.input,
    height: 55,
    width: 74,
    borderRadius: 51,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  socials: { alignSelf: "center", marginBottom: "5%" },
});

export default Signup;
