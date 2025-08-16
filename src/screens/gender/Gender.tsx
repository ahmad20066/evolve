import RoundButton from '@/components/roundButton';
import {AppNavigationProps} from '@/navigators/navigation';
import {globalStyles} from '@/styles/globalStyles';
import React, {useState} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import Back from '@/assets/svg/arrow-left.svg';
import {Text, theme} from '@/components/theme';
import RNBounceable from '@freakycoder/react-native-bounceable';
import BaseButton from '@/components/baseBtn';
import {showToast} from '@/components/toast';
import {useTranslation} from 'react-i18next';

const Gender = ({navigation, route}: AppNavigationProps<'Gender'>) => {
  const {t} = useTranslation();
  const [active, setactive] = useState<number>();
  const {token} = route.params;

  const gender = [
    {label: t('male'), key: 1, img: require('@/assets/images/male.png')},
    {label: t('female'), key: 2, img: require('@/assets/images/female.png')},
  ];

  return (
    <View style={[globalStyles.container, styles.container]}>
      <View>
        <RoundButton onPress={() => navigation.goBack()}>
          <Back color={theme.colors.black} />
        </RoundButton>
        <Text mt="xl" mb="s" variant="poppins16black_medium" textAlign="center">
          1
          <Text variant="poppins16black_regular" color="gray">
            /6
          </Text>
        </Text>
        <Text mb="s" textAlign="center" variant="unbounded20black_medium">
          {t('tell_us')}{' '}
          <Text variant="unbounded20black_medium" color="apptheme">
            {t('gender')}
          </Text>
        </Text>
        <Text textAlign="center" variant="poppins14black_regular" color="gray">
          {t('gender_description')}
        </Text>
        {gender.map(item => (
          <RNBounceable
            key={item.key}
            style={[
              styles.gender,
              active === item.key && {
                borderColor: theme.colors.apptheme,
                backgroundColor: '#FF3D000D',
              },
            ]}
            onPress={() => setactive(item.key)}>
            <Image source={item.img} />
            <Text variant="poppins16black_medium" mt="m">
              {item.label}
            </Text>
          </RNBounceable>
        ))}
      </View>
      <BaseButton
        label={t('continue')}
        onPress={() => {
          if (active === undefined) {
            showToast('errorToast', 'Please select your gender', 'top');
          } else {
            navigation.navigate('Age', {
              token,
              gender: active == 1 ? 'male' : 'female',
            });
          }
        }}
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
  gender: {
    width: 157,
    height: 157,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: theme.colors.softGray,
    marginTop: '10%',
  },
});

export default Gender;
