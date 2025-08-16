import {globalStyles} from '@/styles/globalStyles';
import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import Back from '@/assets/svg/arrow-left.svg';
import RoundButton from '@/components/roundButton';
import BaseButton from '@/components/baseBtn';
import {Text, theme} from '@/components/theme';
import {AppNavigationProps} from '@/navigators/navigation';
import Phone from '@/assets/svg/mobile.svg';
import Sms from '@/assets/svg/sms.svg';
import RNBounceable from '@freakycoder/react-native-bounceable';
import {useSendOtp} from '@/hooks/useSendOtp';
import {showToast} from '@/components/toast';
import {useTranslation} from 'react-i18next';

const VerifyIdentity = ({
  navigation,
  route,
}: AppNavigationProps<'VerifyIdentity'>) => {
  const {t} = useTranslation();
  const list = [
    {
      key: 1,
      name: t('email_placeholder'),
      desc: t('verify_with') + ' ' + t('email_placeholder'),
      icon: <Sms />,
    },
    {
      key: 2,
      name: t('phone_placeholder'),
      desc: t('verify_with') + ' ' + t('phone_placeholder'),
      icon: <Phone />,
    },
  ];
  const [active, setactive] = useState<number>(1);
  const {email, forget} = route.params;

  const {mutate: forgot, isPending: forgotPending} = useSendOtp({
    onSuccess(data) {
      showToast('successToast', data.message, 'top');
      navigation.navigate('VerificationOtp', {
        email,
        forget,
        method: active == 1 ? 'email' : 'phone',
      });
    },
    onError(err: any) {
      showToast('errorToast', err.errors[0].message, 'top');
    },
  });

  const {mutate, isPending} = useSendOtp({
    onSuccess(data) {
      showToast('successToast', data.message, 'top');
      navigation.navigate('VerificationOtp', {
        email,
        method: active == 1 ? 'email' : 'phone',
      });
    },
    onError(error: any) {
      showToast('errorToast', error.errors[0].message, 'top');
    },
  });

  return (
    <View style={[styles.container, globalStyles.container]}>
      <View>
        <RoundButton onPress={() => navigation.goBack()}>
          <Back color={theme.colors.black} />
        </RoundButton>
        <Text textAlign="left" mt="l" variant="poppinsTitle20black_semibold">
          {forget ? t('forgot_password') : t('verify_identity')}
        </Text>
        <Text
          textAlign="left"
          mt="m"
          mb="m"
          variant="poppins14black_regular"
          color="gray">
          {forget ? t('method') : t('choose_method')}
        </Text>
        {list.map(item => {
          const iconColor =
            active == item.key ? theme.colors.apptheme : theme.colors.gray;
          return (
            <RNBounceable
              key={item.key}
              style={[
                globalStyles.line,
                styles.item,
                {
                  borderWidth: active == item.key ? 1 : 0,
                  borderColor:
                    active == item.key
                      ? theme.colors.apptheme
                      : theme.colors.gray,
                },
              ]}
              onPress={() => setactive(item.key)}>
              {React.isValidElement(item.icon) &&
                React.cloneElement(item.icon as React.ReactElement, {
                  color: iconColor, // Pass color prop only if supported
                })}
              <View style={styles.texts}>
                <Text textAlign="left" variant="poppins14black_medium">
                  {item.name}
                </Text>
                <Text mt="s" variant="poppins12black_regular" color="gray">
                  {item.desc}
                </Text>
              </View>
            </RNBounceable>
          );
        })}
      </View>
      <BaseButton
        label={t('continue')}
        disabled={isPending || forgotPending}
        isLoading={isPending || forgotPending}
        onPress={() =>
          forget
            ? forgot({email: email!, method: 'email'})
            : mutate({email: email!, method: active == 1 ? 'email' : 'phone'})
        }
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
  item: {
    height: 75,
    borderRadius: 8,
    backgroundColor: theme.colors.input,
    marginTop: '4%',
    paddingHorizontal: '5%',
  },
  texts: {marginStart: '5%'},
});

export default VerifyIdentity;
