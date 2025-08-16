import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import Back from '@/assets/svg/arrow-left.svg';
import {globalStyles} from '@/styles/globalStyles';
import RoundButton from '@/components/roundButton';
import {Text, theme} from '@/components/theme';
import {AppNavigationProps} from '@/navigators/navigation';
import BaseButton from '@/components/baseBtn';
import {OtpInput} from 'react-native-otp-entry';
import {useVerify} from '@/hooks/useVerifyOtp';
import {showToast} from '@/components/toast';
import {useTranslation} from 'react-i18next';

const VerificationOtp = ({
  navigation,
  route,
}: AppNavigationProps<'VerificationOtp'>) => {
  const {t} = useTranslation();
  const [code, setcode] = useState('');
  const {email, method, forget} = route.params;
  const {mutate, isPending} = useVerify({
    onSuccess(data) {
      showToast('successToast', data.message, 'top');
      navigation.navigate('Gender', {token: data.token});
    },
    onError(error: any) {
      showToast('errorToast', error.errors[0].error, 'top');
    },
  });
  return (
    <View style={[globalStyles.container, styles.container]}>
      <RoundButton onPress={() => navigation.goBack()}>
        <Back color={theme.colors.black} />
      </RoundButton>
      <Text textAlign="left" mt="l" variant="poppinsTitle20black_semibold">
        {forget ? t('forgot_password') : t('verification')}
      </Text>
      <Text
        textAlign="left"
        mt="m"
        mb="m"
        variant="poppins14black_regular"
        color="gray">
        {t('we_sent')} {email}
      </Text>
      <View style={styles.margin}>
        <OtpInput
          focusColor={theme.colors.apptheme}
          focusStickBlinkingDuration={500}
          numberOfDigits={4}
          onTextChange={text => setcode(text)}
          theme={{
            pinCodeContainerStyle: styles.pinCodeContainer,
            pinCodeTextStyle: styles.otptext,
          }}
        />
      </View>
      <BaseButton
        label={t('verify')}
        isLoading={isPending}
        disabled={isPending}
        onPress={() =>
          forget
            ? navigation.navigate('ResetPassword', {
                email: email!,
                otp: Number(code),
              })
            : mutate({
                email: email!,
                otp: code,
                method: method!,
              })
        }
      />
      <Text textAlign="center" variant="poppins12black_regular" color="gray">
        {t('resend_code_in')}{' '}
        <Text
          textAlign="center"
          variant="poppins12black_regular"
          color="apptheme">
          0:20
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: '5%',
  },
  otptext: {fontFamily: 'Poppins-SemiBold', fontSize: 24},
  focused: {
    borderColor: theme.colors.apptheme,
    backgroundColor: '#FF3D000D',
    borderWidth: 1,
  },
  margin: {marginVertical: '5%'},
  pinCodeContainer: {
    width: 70,
    height: 55,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.softGray,
    backgroundColor: theme.colors.input,
  },
});

export default VerificationOtp;
