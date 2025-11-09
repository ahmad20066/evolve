import {globalStyles} from '@/styles/globalStyles';
import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import Back from '@/assets/svg/arrow-left.svg';
import RoundButton from '@/components/roundButton';
import {Text, theme} from '@/components/theme';
import {useTranslation} from 'react-i18next';
import {AppNavigationProps} from '@/navigators/navigation';
import TextInput from '@/components/textinput';
import Lock from '@/assets/svg/lock.svg';
import Eye from '@/assets/svg/eye.svg';
import EyeSlash from '@/assets/svg/eye-slash.svg';
import * as Yup from 'yup';
import {useFormik} from 'formik';
import {useResetPassword} from '@/hooks/useResetPassword';
import {showToast} from '@/components/toast';
import BaseButton from '@/components/baseBtn';

const ResetSchema = Yup.object().shape({
  password: Yup.string().required('Password is required').trim(),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required')
    .trim(),
  // .min(8, 'Password must be at least 8 characters')
  // .required('Password is required')
  // .matches(
  //   /[!@#$%^&*(),.?":{}|<>0-9]/,
  //   'Password must contain at least 1 special character',
  // )
  // .matches(/[0-9]/, 'Password must contain at least 1 number')
  // .matches(/[A-Z]/, 'Password must contain at least 1 uppercase letter')
  // .matches(/[a-z]/, 'Password must contain at least 1 lowercase letter'),
});

const ResetPassword = ({
  navigation,
  route,
}: AppNavigationProps<'ResetPassword'>) => {
  const {t} = useTranslation();
  const {email, otp} = route.params;
  const [pass, setpass] = useState(false);

  const {mutate} = useResetPassword({
    onSuccess(data) {
      setSubmitting(false);
      showToast('successToast', data.message, 'top');
      navigation.navigate('Login');
    },
    onError(err: any) {
      setSubmitting(false);
      showToast('errorToast', err.errors[0].error, 'top');
    },
  });

  const {
    handleChange,
    handleBlur,
    handleSubmit,
    errors,
    touched,
    isSubmitting,
    setSubmitting,
  } = useFormik({
    validationSchema: ResetSchema,
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    onSubmit: value => {
      mutate({
        email,
        newPassword: value.password,
        otp,
      });
    },
  });

  return (
    <View style={[globalStyles.container, styles.container]}>
      <View>
        <RoundButton onPress={() => navigation.goBack()}>
          <Back color={theme.colors.black} />
        </RoundButton>
        <Text textAlign="left" mt="l" variant="poppinsTitle20black_semibold">
          {t('reset')}
        </Text>
        <Text
          textAlign="left"
          mt="m"
          mb="m"
          variant="poppins14black_regular"
          color="gray">
          {t('create_password')}
        </Text>
        <TextInput
          placeholder={t('new')}
          onChangeText={handleChange('password')}
          onBlur={handleBlur('password')}
          error={errors.password}
          touched={touched.password}
          leftIcon={<Lock />}
          secureTextEntry={!pass}
          rightIcon={pass ? <Eye /> : <EyeSlash />}
          onPressIcon={() => setpass(!pass)}
        />
        <TextInput
          placeholder={t('confirm')}
          onChangeText={handleChange('confirmPassword')}
          onBlur={handleBlur('confirmPassword')}
          error={errors.confirmPassword}
          touched={touched.confirmPassword}
          leftIcon={<Lock />}
          secureTextEntry={!pass}
          rightIcon={pass ? <Eye /> : <EyeSlash />}
          onPressIcon={() => setpass(!pass)}
        />
      </View>
      <BaseButton
        label={t('save')}
        disabled={isSubmitting}
        isLoading={isSubmitting}
        onPress={handleSubmit}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: '5%',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
});

export default ResetPassword;
