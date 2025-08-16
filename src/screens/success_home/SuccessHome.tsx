import {globalStyles} from '@/styles/globalStyles';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import BaseButton from '@/components/baseBtn';
import {AppNavigationProps} from '@/navigators/navigation';
import {Text, theme} from '@/components/theme';
import LinearGradient from 'react-native-linear-gradient';
import {CommonActions} from '@react-navigation/native';
import Crown from '@/assets/svg/crown.svg';
import {useTranslation} from 'react-i18next';

const SuccessHome = ({navigation}: AppNavigationProps<'SuccessHome'>) => {
  const {t} = useTranslation();
  return (
    <View style={[globalStyles.container, styles.container]}>
      <View />
      <View style={styles.center}>
        <View style={styles.box1}>
          <View style={styles.box2}>
            <LinearGradient style={styles.box3} colors={['#E97956', '#EB440F']}>
              <Crown color={theme.colors.white} width={47} height={47} />
            </LinearGradient>
          </View>
        </View>
        <Text mt="xl" variant="poppins18black_semibold">
          {t('congrats')}
        </Text>
        <Text
          mt="s"
          textAlign="center"
          marginHorizontal="m"
          variant="poppins14black_regular"
          color="gray">
          {t('congrats_details')}
        </Text>
      </View>
      <BaseButton
        label={t('view_schedule')}
        onPress={() =>
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'MainTab'}],
            }),
          )
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
  box1: {
    height: 170,
    width: 170,
    borderRadius: 85,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EB440F1F',
  },
  box2: {
    backgroundColor: '#EB440F66',
    height: 130,
    width: 130,
    borderRadius: 65,
    justifyContent: 'center',
    alignItems: 'center',
  },
  box3: {
    height: 88,
    width: 88,
    borderRadius: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: {alignItems: 'center'},
});

export default SuccessHome;
