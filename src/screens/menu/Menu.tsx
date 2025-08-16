import DaySelector from '@/components/daySelector';
import {globalStyles} from '@/styles/globalStyles';
import React, {useState} from 'react';
import {FlatList, ScrollView, StyleSheet, View} from 'react-native';
import Back from '@/assets/svg/arrow-left.svg';
import RoundButton from '@/components/roundButton';
import {Text, theme} from '@/components/theme';
import {AppNavigationProps} from '@/navigators/navigation';
import RNBounceable from '@freakycoder/react-native-bounceable';
import MealsItem from './components/MealsItem';
import {useWeekMeals} from '@/hooks/useWeekMeals';
import {useDietTypes} from '@/hooks/useDietTypes';
import ItemSkeleton from '@/components/itemSkeleton';

const Menu = ({navigation}: AppNavigationProps<'Menu'>) => {
  const [active, setactive] = useState(1);
  const [date, setdate] = useState('');
  const handleItemClicked = React.useCallback((id: number) => {
    navigation.navigate('Dish', {id});
  }, []);
  const itemFullDate = new Date();
  const formattedDate = itemFullDate.toISOString().split('T')[0];
  const {data} = useDietTypes();
  const {data: weekMeals, isPending} = useWeekMeals(
    date != '' ? date : formattedDate,
    active,
  );
  const skeletonItems = Array.from({length: 3}, (_, index) => index);
  return (
    <View style={[globalStyles.container, styles.container]}>
      <View style={globalStyles.line2}>
        <RoundButton onPress={() => navigation.goBack()}>
          <Back color={theme.colors.black} />
        </RoundButton>
        <Text variant="poppins18black_semibold" me="s">
          Menu
        </Text>
        <View />
      </View>
      <DaySelector onDateSelected={e => setdate(e)} />
      <View
        style={[globalStyles.line2, styles.mealContainer, globalStyles.shadow]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {data?.map(item => (
            <RNBounceable
              key={item.id}
              onPress={() => setactive(item.id)}
              style={[
                styles.btn,
                active == item.id && {backgroundColor: theme.colors.apptheme},
              ]}>
              <Text
                variant="poppins12black_medium"
                textTransform="capitalize"
                color={active == item.id ? 'white' : 'black'}>
                {item.title}
              </Text>
            </RNBounceable>
          ))}
        </ScrollView>
      </View>
      {isPending ? (
        skeletonItems.map((_, index) => <ItemSkeleton key={index} />)
      ) : (
        <FlatList
          data={weekMeals?.meals}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <MealsItem item={item} onItemClicked={handleItemClicked} />
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {padding: '5%'},
  mealContainer: {paddingHorizontal: '3%', height: 50, borderRadius: 8},
  btn: {
    height: 34,
    width: 100,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Menu;
