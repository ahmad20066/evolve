import {globalStyles} from '@/styles/globalStyles';
import React, {useState} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import Back from '@/assets/svg/arrow-left.svg';
import {Text, theme} from '@/components/theme';
import RNBounceable from '@freakycoder/react-native-bounceable';
import RoundButton from '@/components/roundButton';
import {AppNavigationProps} from '@/navigators/navigation';
import BaseButton from '@/components/baseBtn';
import Tick from '@/assets/svg/tick-square.svg';
import Run from '@/assets/svg/runner.svg';
import {showToast} from '@/components/toast';
import {useSports} from '@/hooks/useSports';
import {useTranslation} from 'react-i18next';

const Sport = ({navigation, route}: AppNavigationProps<'Sport'>) => {
  const {t, i18n} = useTranslation();
  const {token, age, weight, height, gender} = route.params;
  const [active, setactive] = useState<number>();
  const {data} = useSports();
  return (
    <View style={[globalStyles.container, styles.container]}>
      <View>
        <RoundButton onPress={() => navigation.goBack()}>
          <Back color={theme.colors.black} />
        </RoundButton>
        <Text mt="xl" mb="s" variant="poppins16black_medium" textAlign="center">
          5
          <Text variant="poppins16black_regular" color="gray">
            /6
          </Text>
        </Text>
        <Text mb="s" textAlign="center" variant="unbounded20black_medium">
          {t('what')}{' '}
          <Text variant="unbounded20black_medium" color="apptheme">
            {t('sports')}{' '}
          </Text>
          {t('do_you_play')}
        </Text>
        <Text
          mb="xl"
          textAlign="center"
          variant="poppins14black_regular"
          color="gray">
          {t('sports_description')}
        </Text>
        {data?.map(item => (
          <RNBounceable
            style={[
              globalStyles.line2,
              styles.item,
              styles.boxWithShadow,
              {
                borderColor:
                  active == item.id
                    ? theme.colors.lightGreen
                    : theme.colors.white,
              },
            ]}
            onPress={() => setactive(item.id)}
            key={item.id}>
            <View style={globalStyles.line}>
              {item.image ? (
                <Image style={styles.image} source={{uri: `${item.image}`}} />
              ) : (
                <Run />
              )}
              <Text ms="m" variant="poppins14black_regular" color="gray">
                {i18n.language == 'ar' ? item.title_ar : item.title}
              </Text>
            </View>
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
      <BaseButton
        label={t('continue')}
        onPress={() => {
          if (active === undefined) {
            showToast(
              'errorToast',
              'Please select your favourite sport',
              'top',
            );
          } else {
            navigation.navigate('About', {
              token,
              gender,
              age,
              weight,
              height,
              sport: active,
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
  item: {
    borderWidth: 1,
    height: 55,
    borderRadius: 8,
    backgroundColor: theme.colors.white,
    paddingHorizontal: '5%',
    marginTop: '5%',
  },
  image: {width: 24, height: 24},
  boxWithShadow: {
    shadowColor: '#0000000D',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
});

export default Sport;
