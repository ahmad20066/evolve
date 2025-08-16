import {globalStyles} from '@/styles/globalStyles';
import React from 'react';
import {ActivityIndicator, ScrollView, StyleSheet, View} from 'react-native';
import Back from '@/assets/svg/arrow-left.svg';
import RoundButton from '@/components/roundButton';
import {Text, theme} from '@/components/theme';
import {AppNavigationProps} from '@/navigators/navigation';
import Crown from '@/assets/svg/crown.svg';
import BaseButton from '@/components/baseBtn';
import RNBounceable from '@freakycoder/react-native-bounceable';
import {useCurrentSubs} from '@/hooks/useCurrentSubs';
import {formatDate} from '@/utils/formatTime';
import {useCancelSub} from '@/hooks/useCancelSubscription';
import {showToast} from '@/components/toast';
import {CommonActions} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {useRenewWorkout} from '@/hooks/useRenewWorkout';
import {useRenewMeal} from '@/hooks/useRenewMeal';

const Subscription = ({navigation}: AppNavigationProps<'Subscription'>) => {
  const {t, i18n} = useTranslation();
  const {data} = useCurrentSubs();
  const {mutate: renewWorkout, isPending: workoutPending} = useRenewWorkout({
    onSuccess(data) {
      showToast('successToast', data.message, 'top');
    },
    onError(err: any) {
      showToast('errorToast', err.errors[0].message, 'top');
    },
  });

  const {mutate: renewMeal, isPending: mealPending} = useRenewMeal({
    onSuccess(data) {
      showToast('successToast', data.message, 'top');
    },
    onError(err: any) {
      showToast('errorToast', err.errors[0].message, 'top');
    },
  });

  const {mutate, isPending} = useCancelSub({
    onSuccess(data) {
      showToast('successToast', data.message, 'top');
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'MainTab'}],
        }),
      );
    },
    onError(err: any) {
      showToast('errorToast', err.errors[0].message, 'top');
    },
  });
  const items = [
    ...(data?.dietSubscription !== null
      ? [
          {
            key: data?.dietSubscription.id,
            type: t('meal_plan'),
            timePlan: data?.dietSubscription?.type,
            expiryTime:
              'Ends on ' + formatDate(data?.dietSubscription?.end_date),
            remainingDays: '4 day to next payment',
            price: data?.dietSubscription?.meal_plan?.price_monthly,
            renewalType: t('renewal'),
            packageName:
              i18n.language == 'ar'
                ? data?.dietSubscription.meal_plan.title_ar
                : data?.dietSubscription?.meal_plan.title,
            desc: t('membership_details'),
          },
        ]
      : []),
    ...(data?.fitnessSubscription !== null
      ? [
          {
            key: data?.fitnessSubscription.id,
            type: 'Workout Plan',
            timePlan: data?.fitnessSubscription?.pricing.title,
            expiryTime:
              'Ends on ' + formatDate(data?.fitnessSubscription?.end_date),
            remainingDays: '4 day to next payment',
            price: data?.fitnessSubscription?.pricing.price,
            renewalType: t('renewal'),
            packageName:
              i18n.language == 'ar'
                ? data?.fitnessSubscription?.package.name_ar
                : data?.fitnessSubscription?.package.name,
            desc: t('membership_details'),
          },
        ]
      : []),
  ];
  return (
    <View style={[globalStyles.container, styles.container]}>
      <View style={globalStyles.line2}>
        <RoundButton onPress={() => navigation.goBack()}>
          <Back color={theme.colors.black} />
        </RoundButton>
        <Text variant="poppins18black_semibold" me="s">
          {t('subscription')}
        </Text>
        <View />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {items.length == 0 ? (
          <Text textAlign="center" mt="xxl" variant="poppins14black_regular">
            {t('no_sub')}
          </Text>
        ) : (
          items?.map(item => (
            <View key={item.key}>
              <Text
                textAlign="left"
                mt="l"
                mb="m"
                variant="poppins16black_semibold">
                {item.type}
              </Text>
              <View key={item.key} style={styles.item}>
                <View style={globalStyles.line}>
                  <View style={styles.box}>
                    <Crown color={theme.colors.black} />
                  </View>
                  <View>
                    <Text
                      mb="s"
                      variant="poppins16black_semibold"
                      textTransform="capitalize"
                      textAlign="left"
                      numberOfLines={2}
                      style={styles.title}
                      color="apptheme">
                      {item.timePlan} {t('plan')}
                    </Text>
                    <Text variant="poppins12black_regular">
                      {item.remainingDays} {item.expiryTime}
                    </Text>
                  </View>
                </View>
                <View style={styles.smallbox}>
                  <Text
                    textAlign="left"
                    variant="poppins12black_regular"
                    mb="s">
                    {item.packageName}
                  </Text>
                  <View style={globalStyles.line}>
                    <Text variant="poppins12black_semibold" lineHeight={13}>
                      SAR
                    </Text>
                    <Text variant="poppins18black_semibold" lineHeight={35}>
                      {item.price}
                    </Text>
                    <Text variant="poppins16black_regular" lineHeight={35}>
                      /{item.timePlan == 'monthly' ? 'Month' : 'Week'}
                    </Text>
                  </View>
                </View>
                <Text
                  variant="poppins12black_regular"
                  color="gray"
                  mb="s"
                  textAlign="left">
                  {item.desc}
                </Text>
                <BaseButton
                  label={t('renew')}
                  disabled={mealPending || workoutPending}
                  isLoading={mealPending || workoutPending}
                  onPress={() =>
                    item.type == 'Meal Plan'
                      ? renewMeal({id: item.key!})
                      : renewWorkout({id: item.key!})
                  }
                />
                <RNBounceable
                  style={styles.cancel}
                  onPress={() =>
                    mutate({
                      id: item.key!,
                      type: item.type == 'Meal Plan' ? 'diet' : 'fitness',
                    })
                  }>
                  {isPending ? (
                    <ActivityIndicator color={theme.colors.apptheme} />
                  ) : (
                    <Text variant="poppins12black_regular" color="cancel">
                      {t('cancel_membership')}
                    </Text>
                  )}
                </RNBounceable>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: '5%',
    paddingTop: '5%',
  },
  title: {width: '70%'},
  item: {
    shadowColor: '#0000001A',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.8,
    shadowRadius: 10,
    backgroundColor: theme.colors.white,
    elevation: 5,
    borderRadius: 20,
    padding: '4%',
  },
  box: {
    width: 57,
    height: 57,
    borderRadius: 12,
    backgroundColor: theme.colors.input,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '3%',
  },
  smallbox: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.softGray,
    backgroundColor: theme.colors.screen,
    marginVertical: '5%',
    padding: '3%',
  },
  dot: {
    width: 5,
    height: 5,
    backgroundColor: theme.colors.gray,
    borderRadius: 2.5,
    marginHorizontal: '3%',
  },
  cancel: {
    height: 48,
    borderRadius: 37,
    borderColor: theme.colors.softGray,
    borderWidth: 1,
    backgroundColor: theme.colors.screen,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Subscription;
