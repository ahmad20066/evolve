import DaySelector from '@/components/daySelector';
import {Text, theme} from '@/components/theme';
import {globalStyles} from '@/styles/globalStyles';
import React, {useEffect, useState} from 'react';
import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import Tick from '@/assets/svg/greentick.svg';
import BaseButton from '@/components/baseBtn';
import Crown from '@/assets/svg/crown.svg';
import Right from '@/assets/svg/right.svg';
import {AppNavigationProps} from '@/navigators/navigation';
import PlanItem from '@/components/planItem';
import RNBounceable from '@freakycoder/react-native-bounceable';
import {useExercisebyDay} from '@/hooks/useExercisebyDay';
import Fire from '@/assets/svg/fire.svg';
import Calendar from '@/assets/svg/calendar.svg';
import Chart from '@/assets/svg/chart.svg';
import Medal from '@/assets/svg/medal2.svg';
import Chat from '@/assets/svg/messages.svg';
import {useCurrentSubs} from '@/hooks/useCurrentSubs';
import {useJoinWorkout} from '@/hooks/useJoinWorkout';
import {showToast} from '@/components/toast';
import {useTranslation} from 'react-i18next';
import FeedbackModal from './components/feedbackModal';
import {useMarkWorkout} from '@/hooks/useMarkWorkout';
import {useMessages} from '@/hooks/useMessages';

const Workout = ({navigation, route}: AppNavigationProps<'Workout'>) => {
  const home_date = route.params?.home_date || '';
  const {t, i18n} = useTranslation();
  const [date, setdate] = useState('');
  const [btn, setbtn] = useState('Join the session');
  const [visibleFeedback, setvisibleFeedback] = useState(false);

  const itemFullDate = new Date();
  const formattedDate = itemFullDate.toISOString().split('T')[0];
  const [final_date, setFinalDate] = useState(
    date !== '' ? date : home_date !== '' ? home_date : formattedDate,
  );
  useEffect(() => {
    setFinalDate(
      date !== '' ? date : home_date !== '' ? home_date : formattedDate,
    );
  }, [date, home_date, formattedDate]);
  const {data, refetch, isFetching} = useExercisebyDay(final_date);
  const {data: currentPlan} = useCurrentSubs();
  const handleBackClicked = React.useCallback(() => {
    setvisibleFeedback(false);
  }, []);
  const dayNumber = new Date(home_date).getDate();
  const {data: msg} = useMessages();

  const {mutate, isPending} = useJoinWorkout({
    onSuccess(data) {
      showToast('successToast', data.message, 'top');
      refetch();
      setbtn('Complete session');
    },
    onError(err: any) {
      showToast('errorToast', err.errors[0].message, 'top');
    },
  });

  const {mutate: workout, isPending: workoutPending} = useMarkWorkout({
    onSuccess(data) {
      setvisibleFeedback(true);
      refetch();
      showToast('successToast', data.message, 'top');
    },
    onError(err: any) {
      showToast('errorToast', err.errors[0].message, 'top');
    },
  });

  const handleItemClicked = React.useCallback(
    (id: number) => {
      navigation.navigate('Exercise', {id, workout_id: data?.id});
    },
    [data],
  );

  return (
    <ScrollView
      style={globalStyles.container}
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          tintColor={theme.colors.apptheme}
          refreshing={isFetching}
          onRefresh={refetch}
        />
      }
      showsVerticalScrollIndicator={false}>
      <Text textAlign="left" variant="poppins18black_semibold">
        {i18n.language == 'ar'
          ? currentPlan?.fitnessSubscription.package.name_ar
          : currentPlan?.fitnessSubscription?.package.name}
      </Text>
      <DaySelector onDateSelected={e => setdate(e)} day={dayNumber} />
      {currentPlan?.fitnessSubscription?.package.type != 'group' &&
        data &&
        data?.exercises?.length > 0 && (
          <>
            <View style={[globalStyles.line, styles.margin]}>
              <Text variant="poppins16black_medium" me="s">
                {t('fitness')}
              </Text>
              <Medal />
            </View>
            <View style={globalStyles.line2}>
              <View style={globalStyles.line}>
                <View style={styles.image}>
                  <Image
                    source={require('@/assets/images/user.png')}
                    style={styles.pro}
                  />
                </View>
                <Text variant="poppins14black_regular" ms="s">
                  {msg?.coach == null ? t('wait_coach') : msg?.coach}
                </Text>
              </View>
              <RNBounceable
                style={[styles.chat, globalStyles.line]}
                onPress={() => navigation.navigate('Chat')}>
                <Chat />
                <Text variant="poppins12black_medium" ms="s">
                  {t('chat')}
                </Text>
              </RNBounceable>
            </View>
          </>
        )}
      {data && (
        <>
          <Text textAlign="left" variant="poppins16black_medium" mt="l">
            {i18n.language == 'ar' ? data?.title_ar : data?.title}
          </Text>
          <Text
            textAlign="left"
            variant="poppins12black_regular"
            color="gray"
            mt="s">
            {i18n.language == 'ar' ? data?.description_ar : data?.description}
          </Text>
          {/* <Text textAlign="left" variant="poppins16black_medium" mt="l" mb="s">
            {t('about_session')}
          </Text>
          <View style={globalStyles.line}>
            <View style={[globalStyles.line, styles.greyitem]}>
              <Fire color={theme.colors.apptheme} width={18} height={18} />
              <Text variant="poppins12black_regular" color="gray" ms="s">
                2 sets
              </Text>
            </View>
            {data?.duration && (
              <View style={[globalStyles.line, styles.greyitem]}>
                <Calendar color={theme.colors.apptheme} />
                <Text variant="poppins12black_regular" color="gray" ms="s">
                  {data?.duration} min
                </Text>
              </View>
            )}
            {data?.difficulty_level && (
              <View style={[globalStyles.line, styles.greyitem]}>
                <Chart color={theme.colors.apptheme} />
                <Text variant="poppins12black_regular" color="gray" ms="s">
                  {data?.difficulty_level}
                </Text>
              </View>
            )}
          </View> */}
          {Object.keys(data).length > 0 && (
            <Text
              textAlign="left"
              variant="poppins16black_medium"
              mt="l"
              mb="m">
              {t('exercises')}
            </Text>
          )}
          <View style={[globalStyles.shadow, {borderRadius: 12}]}>
            {data?.exercises?.map(item => (
              <PlanItem
                key={item.id}
                item={item}
                onItemClicked={handleItemClicked}
              />
            ))}
          </View>
          {Object.keys(data).length > 0 &&
            !data?.session_joined &&
            final_date === formattedDate && (
              <BaseButton
                label={btn || 'Join the session'}
                isLoading={isPending}
                disabled={isPending}
                onPress={() => mutate({workout_id: data?.id})}
              />
            )}
          {!data?.session_completed &&
            data?.session_joined &&
            final_date === formattedDate && (
              <BaseButton
                label={'Workout Done'}
                isLoading={workoutPending}
                disabled={workoutPending}
                onPress={() => workout({workout_id: data?.id})}
              />
            )}
        </>
      )}
      <FeedbackModal
        visible={visibleFeedback}
        onBackToExerciseClicked={handleBackClicked}
        workout_id={data?.id!}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: '5%',
  },
  margin: {marginBottom: '2%'},
  chat: {
    backgroundColor: theme.colors.lightGreen,
    height: 36,
    borderRadius: 20,
    paddingHorizontal: '6%',
  },
  btn: {
    backgroundColor: theme.colors.softGray,
    height: 34,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '5%',
  },
  greyitem: {
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    marginRight: '3%',
    backgroundColor: theme.colors.softGray,
    borderRadius: 8,
  },
  image: {
    width: 40,
    height: 40,
    borderColor: theme.colors.lightGreen,
    borderRadius: 20,
    borderWidth: 1,
  },
  pro: {width: 36, height: 36, borderRadius: 18},
});

export default Workout;
