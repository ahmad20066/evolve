import React, {useRef} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import Back from '@/assets/svg/arrow-left.svg';
import {globalStyles} from '@/styles/globalStyles';
import RoundButton from '@/components/roundButton';
import {Text, theme} from '@/components/theme';
import {AppNavigationProps} from '@/navigators/navigation';
import ExercisesItem from './components/ExerciseItem';
import Setting from '@/assets/svg/setting-4.svg';
import ExerciseLevelSheet from './components/ExerciseLevelSheet';
import {usePackageWorkouts} from '@/hooks/usePackageWorkouts';
import {showToast} from '@/components/toast';
import {useTranslation} from 'react-i18next';

export const exerciseitems = [
  {
    key: 1,
    name: '01-BARELL FRONT RAISES',
    set: '3',
    rep: '4',
    img: require('@/assets/images/workout.png'),
    type: 'Shoulders exercise',
  },
  {
    key: 2,
    name: '02-DELT LATERALS',
    set: '3',
    rep: '4',
    img: require('@/assets/images/workout.png'),
    type: 'Shoulders exercise',
  },
];
const Exercises = ({navigation, route}: AppNavigationProps<'Exercises'>) => {
  const {t} = useTranslation();
  const {id} = route.params;
  const refRBSheet = useRef<any>();
  const {data} = usePackageWorkouts(id);
  const handleItemClicked = React.useCallback(() => {
    showToast('errorToast', 'Please purchase a subscription', 'top');
  }, []);
  return (
    <View style={[globalStyles.container, styles.container]}>
      <View style={globalStyles.line2}>
        <RoundButton onPress={() => navigation.goBack()}>
          <Back color={theme.colors.black} />
        </RoundButton>
        <Text variant="poppins18black_semibold" me="s">
          {t('workout')}
        </Text>
        {/* <RNBounceable onPress={() => refRBSheet.current.open()}>
          <Setting />
        </RNBounceable> */}
        <View />
      </View>
      <FlatList
        data={data}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <ExercisesItem item={item} onItemClicked={handleItemClicked} />
        )}
      />
      <ExerciseLevelSheet reff={refRBSheet} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {padding: '5%'},
  mealContainer: {padding: '3%', height: 50, borderRadius: 8},
  btn: {
    height: 34,
    width: 150,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Exercises;
