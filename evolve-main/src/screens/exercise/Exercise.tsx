import {AppNavigationProps} from '@/navigators/navigation';
import React, {useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import Pagination from '../onboarding/components/pagination';
import {globalStyles} from '@/styles/globalStyles';
import {Text, theme} from '@/components/theme';
import Candle from '@/assets/svg/candle.svg';
import Repeat from '@/assets/svg/refresh.svg';
import Clock from '@/assets/svg/clock.svg';
import Reshcedule from '@/assets/svg/refresh2.svg';
import Cross from '@/assets/svg/cross.svg';
import Disclaimer from '@/assets/svg/request.svg';
import Tick from '@/assets/svg/greentick.svg';
import Right from '@/assets/svg/right.svg';
import Trophy from '@/assets/svg/cup.svg';
import RNBounceable from '@freakycoder/react-native-bounceable';
import {useExercise} from '@/hooks/useExercise';
import Video from '@/components/video';
import {showToast} from '@/components/toast';
import CompleteExerciseSheet from './components/completeExerciseSheet';
import SlideItem from '../onboarding/components/slideItem';
import {useTranslation} from 'react-i18next';
import {useExerciseDone} from '@/hooks/useExerciseDone';
import CoolingModal from './components/coolingModal';

const {width} = Dimensions.get('screen');

const Exercise = ({navigation, route}: AppNavigationProps<'Exercise'>) => {
  const {t, i18n} = useTranslation();
  const {id, workout_id} = route.params;
  const scrollX = useRef(new Animated.Value(0)).current;
  const [index, setIndex] = useState(0);
  const [visible, setvisible] = useState(false);
  const [coolingVisible, setcoolingVisible] = useState(false);
  const slidesref = useRef<FlatList>(null);
  const completeExercisereff = useRef<any>();

  const handleOnScroll = (event: any) => {
    Animated.event([{nativeEvent: {contentOffset: {x: scrollX}}}], {
      useNativeDriver: false,
    })(event);
  };
  const handleOnViewableItemsChanged = useRef(({viewableItems}: any) => {
    setIndex(viewableItems[0].index);
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;
  const scrollBack = () => {
    if (index > 0) {
      slidesref.current?.scrollToIndex({index: index - 1});
    }
  };
  const {data: exercise} = useExercise(id, workout_id);
  const images = exercise?.image_urls.map((item, index) => ({
    key: index,
    main_img: `${item}`,
  }));

  const handleBackClicked = React.useCallback(() => {
    setvisible(false);
  }, []);
  const handleBackWorkoutClicked = React.useCallback(() => {
    setcoolingVisible(false);
    navigation.goBack();
  }, []);
  const handleCompleteExercise = React.useCallback(
    (wt: string, reps: string, sets: string) => {
      mutate({
        exercise_id: id,
        workout_id,
        stats: [{set: Number(sets), reps: Number(reps), weight: Number(wt)}],
      });
    },
    [],
  );
  const {mutate, isPending} = useExerciseDone({
    onSuccess(data) {
      showToast('successToast', data.message, 'top');
      (exercise?.cooling_time ?? 0) > 0 && setcoolingVisible(true);
    },
    onError(error: any) {
      showToast('errorToast', error.errors[0].message, 'bottom');
    },
  });

  return (
    <View style={globalStyles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <FlatList
          data={images}
          renderItem={({item}) => (
            <SlideItem
              item={item}
              scrollBack={scrollBack}
              index={index}
              nav={navigation}
              backflag
            />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToAlignment="center"
          pagingEnabled
          onScroll={handleOnScroll}
          onViewableItemsChanged={handleOnViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          ref={slidesref}
        />
        <View style={styles.container}>
          <Pagination data={images} scrollX={scrollX} index={index} />
          <View style={styles.main}>
            <RNBounceable
              style={[globalStyles.line, styles.board]}
              onPress={() =>
                navigation.navigate('Leaderboard', {
                  id,
                  label:
                    i18n.language == 'ar'
                      ? exercise?.name_ar!
                      : exercise?.name!,
                })
              }>
              <Trophy />
              <Text
                marginHorizontal="s"
                variant="poppins12black_medium"
                color="apptheme">
                {t('show_leaderboard')}
              </Text>
              <Right />
            </RNBounceable>
            <Text
              textAlign="left"
              mb="s"
              mt="s"
              variant="poppins16black_medium">
              {i18n.language == 'ar' ? exercise?.name_ar : exercise?.name}
            </Text>
            <Text
              textAlign="left"
              variant="poppins12black_regular"
              color="gray">
              {i18n.language == 'ar'
                ? exercise?.description_ar
                : exercise?.description}
            </Text>
            <Text
              textAlign="left"
              mb="m"
              mt="m"
              variant="poppins16black_medium">
              {t('about_program')}
            </Text>
            <View style={globalStyles.line}>
              {exercise?.stats.sets && (
                <View
                  style={[
                    globalStyles.line,
                    styles.greyitem,
                    {backgroundColor: theme.colors.softGray, borderRadius: 8},
                  ]}>
                  <Candle color={theme.colors.apptheme} />
                  <Text variant="poppins12black_regular" color="gray" ms="s">
                    2 sets
                  </Text>
                </View>
              )}
              {exercise?.stats.reps && (
                <View
                  style={[
                    globalStyles.line,
                    styles.greyitem,
                    {backgroundColor: theme.colors.softGray, borderRadius: 8},
                  ]}>
                  <Repeat color={theme.colors.apptheme} />
                  <Text variant="poppins12black_regular" color="gray" ms="s">
                    2 times
                  </Text>
                </View>
              )}
              {exercise?.stats.duration && (
                <View
                  style={[
                    globalStyles.line,
                    styles.greyitem,
                    {backgroundColor: theme.colors.softGray, borderRadius: 8},
                  ]}>
                  <Clock color={theme.colors.apptheme} />
                  <Text variant="poppins12black_regular" color="gray" ms="s">
                    {exercise?.stats.duration} min
                  </Text>
                </View>
              )}
            </View>
            <Text
              textAlign="left"
              mb="m"
              mt="m"
              variant="poppins16black_medium">
              {t('target')}
            </Text>
            <Image
              source={{uri: `${exercise?.target_muscles_image}`}}
              style={styles.target}
            />
            {/* <Text mb="m" mt="m" variant="poppins16black_medium">
              Notes
            </Text>
            {data?.notes.map(note => (
              <View style={[globalStyles.line, styles.margin]}>
                <Tick />
                <Text variant="poppins14black_regular" color="gray" ms="s">
                  {note}
                </Text>
              </View>
            ))} */}

            {/* <Text mb="m" mt="m" variant="poppins16black_medium">
              Do you want to
            </Text>
            <View style={[globalStyles.line, {flexWrap: 'wrap'}]}>
              <RNBounceable
                style={[
                  globalStyles.line,
                  styles.greyitem,
                  {
                    backgroundColor: theme.colors.input,
                    borderRadius: 22,
                    paddingHorizontal: '6%',
                  },
                ]}>
                <Text mr="s" variant="poppins12black_medium" color="gray">
                  Skip this exercise
                </Text>
                <Cross color={theme.colors.gray} />
              </RNBounceable>
              <RNBounceable
                style={[
                  globalStyles.line,
                  styles.greyitem,
                  {
                    backgroundColor: theme.colors.input,
                    borderRadius: 22,
                    paddingHorizontal: '6%',
                  },
                ]}>
                <Text mr="s" variant="poppins12black_medium" color="gray">
                  Rescheduled it
                </Text>
                <Reshcedule color={theme.colors.gray} />
              </RNBounceable>
              <RNBounceable
                style={[
                  globalStyles.line,
                  styles.greyitem,
                  {
                    backgroundColor: theme.colors.input,
                    borderRadius: 22,
                    marginTop: '5%',
                    paddingHorizontal: '6%',
                  },
                ]}>
                <Text mr="s" variant="poppins12black_medium" color="gray">
                  Request to change this exercise
                </Text>
                <Disclaimer />
              </RNBounceable>
            </View> */}
          </View>
        </View>
      </ScrollView>
      <View style={[globalStyles.shadow, styles.padd, globalStyles.line2]}>
        <RNBounceable
          style={[
            styles.btn,
            {borderWidth: 1.5, borderColor: theme.colors.apptheme},
          ]}
          onPress={() => setvisible(true)}>
          <Text variant="poppins14black_regular" color="apptheme">
            {t('play')}
          </Text>
        </RNBounceable>
        {exercise?.status != 'completed' && (
          <RNBounceable
            onPress={() => completeExercisereff.current.open()}
            style={[styles.btn, {backgroundColor: theme.colors.apptheme}]}>
            <Text variant="poppins14black_regular" color="white">
              {t('finish')}
            </Text>
          </RNBounceable>
        )}
      </View>
      <Video
        visible={visible}
        onBackClicked={handleBackClicked}
        url={exercise?.video_url}
      />
      <CompleteExerciseSheet
        reff={completeExercisereff}
        onComplete={handleCompleteExercise}
        isPending={isPending}
      />
      <CoolingModal
        onBackToWorkoutClicked={handleBackWorkoutClicked}
        visible={coolingVisible}
        time={exercise?.cooling_time!}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  padd: {paddingHorizontal: '5%', paddingTop: '6%', paddingBottom: '10%'},
  container: {
    top: -250,
  },
  target: {height: 190, width: width * 0.85, alignSelf: 'center'},
  item: {
    height: 55,
    borderRadius: 8,
    backgroundColor: theme.colors.white,
    paddingHorizontal: '5%',
    marginBottom: '4%',
  },
  board: {
    backgroundColor: theme.colors.lightGreen,
    height: 34,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '5%',
  },
  main: {
    marginTop: '5%',
    backgroundColor: theme.colors.screen,
    padding: '5%',
    borderTopLeftRadius: 33,
    borderTopRightRadius: 33,
  },
  greyitem: {
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    marginRight: '3%',
  },
  btn: {
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 51,
    width: '46%',
  },
  margin: {marginBottom: '2%'},
});

export default Exercise;
