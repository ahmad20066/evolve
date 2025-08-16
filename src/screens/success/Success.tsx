import {globalStyles} from '@/styles/globalStyles';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import Back from '@/assets/svg/arrow-left.svg';
import RoundButton from '@/components/roundButton';
import BaseButton from '@/components/baseBtn';
import {AppNavigationProps} from '@/navigators/navigation';
import Ranking from '@/assets/svg/ranking.svg';
import {Text, theme} from '@/components/theme';
import LinearGradient from 'react-native-linear-gradient';
import {useSetupAccount} from '@/hooks/useSetupAccount';
import {showToast} from '@/components/toast';
import {useDispatch} from 'react-redux';
import {setAccessToken} from '@/store/slices/local';
import {useTranslation} from 'react-i18next';

const Success = ({navigation, route}: AppNavigationProps<'Success'>) => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const {token, about, age, weight, gender, height, sport} = route.params;
  const {mutate, isPending} = useSetupAccount(token, {
    onSuccess(data) {
      showToast('successToast', data.message, 'top');
      dispatch(setAccessToken(token));
    },
    onError(err: any) {
      showToast('errorToast', err.errors[0].message, 'top');
    },
  });
  return (
    <View style={[globalStyles.container, styles.container]}>
      <RoundButton onPress={() => navigation.goBack()}>
        <Back color={theme.colors.black} />
      </RoundButton>
      <View style={styles.center}>
        <View style={styles.box1}>
          <View style={styles.box2}>
            <LinearGradient style={styles.box3} colors={['#E97956', '#EB440F']}>
              <Ranking />
            </LinearGradient>
          </View>
        </View>
        <Text mt="xl" variant="poppins18black_semibold">
          {t('all_set')}
        </Text>
        <Text
          mt="s"
          textAlign="center"
          variant="poppins14black_regular"
          color="gray">
          {t('success')}
        </Text>
      </View>
      <BaseButton
        label={t('save')}
        isLoading={isPending}
        disabled={isPending}
        onPress={() =>
          mutate({
            gender,
            age: Number(age),
            weight,
            height: Number(height),
            sport,
            sport_duration: about.time,
            goal: about.goal,
            training_location: about.location,
          })
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

export default Success;
