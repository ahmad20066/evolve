import DaySelector from '@/components/daySelector';
import {Text} from '@/components/theme';
import {useMyMeals} from '@/hooks/useMyMeals';
import {globalStyles} from '@/styles/globalStyles';
import React, {useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import MealItem from './components/mealItem';
import ItemSkeleton from '@/components/itemSkeleton';
import {AppNavigationProps} from '@/navigators/navigation';
import {useCurrentSubs} from '@/hooks/useCurrentSubs';
import ChangeMealsModal from './components/changeMealsModal';
import {useChangeMeal} from '@/hooks/useChangeMealSelection';
import {showToast} from '@/components/toast';
import {useTranslation} from 'react-i18next';

const MyMeals = ({navigation}: AppNavigationProps<'MyMeals'>) => {
  const {t, i18n} = useTranslation();
  const [date, setdate] = useState('');
  const [visible, setvisible] = useState(false);
  const [type, settype] = useState<number>();
  const [selection, setselection] = useState<number>();
  const itemFullDate = new Date();
  const formattedDate = itemFullDate.toISOString().split('T')[0];
  const {
    data: weekMeals,
    isPending,
    refetch,
  } = useMyMeals(date != '' ? date : formattedDate);
  const {mutate, isPending: mealPending} = useChangeMeal({
    onSuccess(data) {
      showToast('successToast', data.message, 'top');
      setvisible(false);
      refetch();
    },
    onError(err: any) {
      showToast('errorToast', err.errors[0].message, 'top');
    },
  });

  const skeletonItems = Array.from({length: 3}, (_, index) => index);
  const handleItemClicked = React.useCallback((id: number) => {
    navigation.navigate('Dish', {id});
    setvisible(false);
  }, []);
  const handleEditClicked = React.useCallback((id: number, type: number) => {
    settype(type);
    setselection(id);
    setvisible(true);
  }, []);
  const handleBackSelected = React.useCallback(() => {
    setvisible(false);
  }, []);

  const selectionRef = React.useRef<number | undefined>(selection);

  React.useEffect(() => {
    selectionRef.current = selection;
  }, [selection]);

  const handleModalItemClicked = React.useCallback(
    (id: number) => {
      if (selection != undefined && id != undefined) {
        mutate({meal_id: id, selection_id: selectionRef.current!});
      } else {
        showToast('errorToast', 'Please select a meal', 'top');
      }
    },
    [selection], // Add meal to dependencies
  );

  const handleOpenMealClicked = React.useCallback((id: number) => {
    navigation.navigate('Dish', {id});
    setvisible(false);
  }, []);
  const {data} = useCurrentSubs();

  return (
    <View style={[globalStyles.container, styles.container]}>
      <Text
        textAlign="left"
        variant="poppins18black_semibold"
        me="s"
        textTransform="capitalize">
        {i18n.language == 'ar'
          ? data?.dietSubscription.meal_plan.title_ar
          : data?.dietSubscription?.meal_plan.title}
      </Text>
      <DaySelector onDateSelected={e => setdate(e)} />
      <View style={globalStyles.line}>
        <Text me="s" variant="poppins16black_medium">
          {t('meals_today')}
        </Text>
      </View>
      <View style={[{borderRadius: 12, marginTop: '5%'}]}>
        {isPending ? (
          skeletonItems.map((_, index) => <ItemSkeleton key={index} />)
        ) : weekMeals?.meals && weekMeals.meals.length > 0 ? (
          <View style={globalStyles.shadow}>
            <FlatList
              data={weekMeals?.meals}
              contentContainerStyle={styles.list}
              showsVerticalScrollIndicator={false}
              keyExtractor={item => item.selection_id.toString()}
              renderItem={({item}) => (
                <MealItem
                  item={item}
                  onItemClicked={handleItemClicked}
                  onEditClicked={handleEditClicked}
                />
              )}
            />
          </View>
        ) : (
          <Text variant="poppins16black_medium" textAlign="center">
            {t('no_meals')}
          </Text>
        )}
      </View>
      <ChangeMealsModal
        visible={visible}
        onBackToMealsClicked={handleBackSelected}
        onModalItemClicked={handleModalItemClicked}
        onOpenMealClicked={handleOpenMealClicked}
        day={date != '' ? date : formattedDate}
        type={type}
        isLoading={mealPending}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: '5%',
  },
  list: {
    paddingBottom: 150,
  },
});

export default MyMeals;
