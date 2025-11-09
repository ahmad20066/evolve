import {globalStyles} from '@/styles/globalStyles';
import React, {useState} from 'react';
import {StyleSheet, Switch, View} from 'react-native';
import Back from '@/assets/svg/arrow-left.svg';
import RoundButton from '@/components/roundButton';
import {AppNavigationProps} from '@/navigators/navigation';
import {Text, theme} from '@/components/theme';
import TextInput from '@/components/textinput';
import Sms from '@/assets/svg/sms.svg';
import Lock from '@/assets/svg/lock.svg';
import Eye from '@/assets/svg/eye.svg';
import FB from '@/assets/svg/facebook.svg';
import Google from '@/assets/svg/google.svg';
import EyeSlash from '@/assets/svg/eye-slash.svg';
import BaseButton from '@/components/baseBtn';
import RNBounceable from '@freakycoder/react-native-bounceable';
import * as Yup from 'yup';
import {useFormik} from 'formik';
import {useLogin} from '@/hooks/useLogin';
import {showToast} from '@/components/toast';
import {useDispatch} from 'react-redux';
import {setAccessToken, setUser} from '@/store/slices/local';
import {useAppSelector} from '@/store';
import {useTranslation} from 'react-i18next';

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid Email Address')
    .required('Email is Required')
    .trim(),
  password: Yup.string().required('Password is required').trim(),
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

const Login = ({navigation}: AppNavigationProps<'Login'>) => {
  const {t} = useTranslation();
  const [pass, setpass] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const dispatch = useDispatch();
  const {fcm_token} = useAppSelector(state => state.local);
  const {mutate} = useLogin({
    onSuccess(data) {
      setSubmitting(false);
      dispatch(setAccessToken(data.token));
      dispatch(
        setUser({
          age: data.user.age,
          email: data.user.email,
          name: data.user.name,
          phone: data.user.phone,
          gender: data.user.gender,
          height: data.user.height,
          role: data.user.role,
        }),
      );
      showToast('successToast', data.message, 'top');
    },
    onError(err: any) {
      setSubmitting(false);
      showToast('errorToast', err.errors[0].message, 'top');
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
    values,
    isValid,
  } = useFormik({
    validationSchema: LoginSchema,
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: value => {
      mutate({
        email: value.email,
        password: value.password,
        fcm_token,
      });
    },
  });

  return (
    <View style={globalStyles.container}>
      <View style={styles.container}>
        <RoundButton onPress={() => navigation.goBack()}>
          <Back color={theme.colors.black} />
        </RoundButton>
        <Text textAlign="left" mt="l" variant="poppinsTitle20black_semibold">
          {t('login')}
        </Text>
        <Text
          textAlign="left"
          mt="m"
          variant="poppins14black_regular"
          color="gray">
          {t('let_signin')}{' '}
          <Text variant="poppins14black_bold" color="apptheme">
            {t('evolve')}
          </Text>{' '}
          {t('account')}
        </Text>
        <TextInput
          placeholder={t('email_placeholder')}
          leftIcon={<Sms />}
          onChangeText={handleChange('email')}
          onBlur={handleBlur('email')}
          error={errors.email}
          touched={touched.email}
        />
        <TextInput
          placeholder={t('password_placeholder')}
          onChangeText={handleChange('password')}
          onBlur={handleBlur('password')}
          error={errors.password}
          touched={touched.password}
          leftIcon={<Lock />}
          secureTextEntry={!pass}
          rightIcon={pass ? <Eye /> : <EyeSlash />}
          onPressIcon={() => setpass(!pass)}
        />
        <View style={[globalStyles.line2, styles.margin]}>
          <View style={globalStyles.line}>
            <Switch
              trackColor={{
                false: theme.colors.input,
                true: theme.colors.lighyellow,
              }}
              thumbColor={theme.colors.white}
              ios_backgroundColor={theme.colors.input}
              onValueChange={toggleSwitch}
              value={isEnabled}
              style={styles.switch}
            />
            <Text variant="poppins12black_regular" color="gray">
              {t('remember')}
            </Text>
          </View>
          <RNBounceable
            onPress={() =>
              !values.email
                ? showToast('errorToast', 'Please enter email', 'top')
                : navigation.navigate('VerifyIdentity', {
                    forget: true,
                    email: values.email,
                  })
            }>
            <Text variant="poppins12black_regular" color="gray">
              {t('forgot_password')}?
            </Text>
          </RNBounceable>
        </View>

        <BaseButton
          label={t('login')}
          disabled={isSubmitting}
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
        <RNBounceable onPress={() => navigation.navigate('Signup')}>
          <Text
            textAlign="center"
            color="gray"
            variant="poppins12black_regular">
            {t('dont_account')}{' '}
            <Text
              textDecorationLine="underline"
              variant="poppins12black_regular"
              color="apptheme">
              {t('signup')}
            </Text>
          </Text>
        </RNBounceable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {padding: '5%'},
  btn: {height: 55},
  switch: {transform: [{scaleX: 0.5}, {scaleY: 0.5}]},
  margin: {marginTop: '5%', marginBottom: '2%'},
  social: {
    backgroundColor: theme.colors.input,
    height: 55,
    width: 74,
    borderRadius: 51,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  socials: {alignSelf: 'center', marginBottom: '5%'},
});

export default Login;
