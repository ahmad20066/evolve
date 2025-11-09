import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {globalStyles} from '@/styles/globalStyles';
import {Text, theme} from '@/components/theme';
import Fire from '@/assets/svg/fire.svg';
import Protein from '@/assets/svg/chicken.svg';
import Fiber from '@/assets/svg/celery.svg';
import Carb from '@/assets/svg/carb.svg';
import Fat from '@/assets/svg/fat.svg';
import {AppNavigationProps} from '@/navigators/navigation';
import BaseButton from '@/components/baseBtn';
import {useDish} from '@/hooks/useDish';
import {Skeleton} from '@rneui/base';
import Pagination from '@/screens/onboarding/components/pagination';
import {useTranslation} from 'react-i18next';
import SlideItem from '../onboarding/components/slideItem';
import ChangeMealsModal from '../my_meals/components/changeMealsModal';
import {showToast} from '@/components/toast';
import {useChangeMeal} from '@/hooks/useChangeMealSelection';

const Dish = ({navigation, route}: AppNavigationProps<'Dish'>) => {
  const {t, i18n} = useTranslation();
  const scrollX = useRef(new Animated.Value(0)).current;
  const [index, setIndex] = useState(0);
  const [date, setdate] = useState('');
  const [visible, setvisible] = useState(false);
  const [type, settype] = useState<number>();
  const [meal, setMeal] = useState<number>();
  const [selection, setselection] = useState<number>();

  const slidesref = useRef<FlatList>(null);
  const {data, isPending} = useDish(route.params.id);

  const images = data?.images.map((image, index) => ({
    key: index,
    main_img: `${image}`,
  }));
  const handleBackSelected = React.useCallback(() => {
    setvisible(false);
  }, []);

  const handleModalItemClicked = React.useCallback(
    (id: number) => {
      setMeal(id);
    },
    [], // Add meal to dependencies
  );

  useEffect(() => {
    if (meal != undefined && selection != undefined)
      mutate({meal_id: meal, selection_id: selection});
  }, [meal, selection]);

  const handleOpenMealClicked = React.useCallback((id: number) => {
    navigation.navigate('Dish', {id});
    setvisible(false);
  }, []);
  const handleEditClicked = React.useCallback((id: number, type: number) => {
    settype(type);
    setselection(id);
    setvisible(true);
  }, []);
  const {mutate, isPending: mealPending} = useChangeMeal({
    onSuccess(data) {
      showToast('successToast', data.message, 'top');
      setvisible(false);
    },
    onError(err: any) {
      showToast('errorToast', err.errors[0].message, 'top');
    },
  });

  const items = [
    {
      key: 1,
      title: t('kcal'),
      count: data?.calories,
      icon: <Fire color={theme.colors.apptheme} width={28} height={28} />,
    },
    {
      key: 2,
      title: t('protein'),
      count: data?.protein,
      icon: <Protein />,
    },
    {
      key: 3,
      title: t('fiber'),
      count: data?.fiber,
      icon: <Fiber />,
    },
    {
      key: 4,
      title: t('carbs'),
      count: data?.carb,
      icon: <Carb />,
    },
    {
      key: 5,
      title: t('fats'),
      count: data?.fats,
      icon: <Fat />,
    },
  ];

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
            <View style={globalStyles.line}>
              <View style={styles.greyitem}>
                <Text variant="poppins12black_regular" color="gray">
                  Lunch
                </Text>
              </View>
              <View style={styles.greyitem}>
                <Text variant="poppins12black_regular" color="gray">
                  Keto Diet
                </Text>
              </View>
              <View style={styles.greyitem}>
                <Text variant="poppins12black_regular" color="gray">
                  High Protein
                </Text>
              </View>
            </View>

            <Text
              textAlign="left"
              mb="s"
              mt="m"
              variant="poppins16black_medium">
              {i18n.language == 'ar' ? data?.name_ar : data?.name}
            </Text>

            <Text
              textAlign="left"
              variant="poppins12black_regular"
              color="gray">
              {i18n.language == 'ar' ? data?.description_ar : data?.description}
            </Text>

            <View style={globalStyles.line2}>
              {items.map(item => (
                <View style={styles.items} key={item.key}>
                  <View style={styles.icon}>{item.icon}</View>
                  <Text variant="poppins12black_regular" color="gray">
                    {item.title}
                  </Text>
                  {isPending ? (
                    <Skeleton
                      height={20}
                      width={50}
                      style={styles.skeletonitem}
                    />
                  ) : (
                    <Text variant="poppins16black_semibold">{item.count}</Text>
                  )}
                </View>
              ))}
            </View>
            <Text
              textAlign="left"
              mb="m"
              mt="m"
              variant="poppins16black_medium">
              {t('ingredients')}
            </Text>
            {data?.ingredients.map(item => (
              <View
                style={[styles.item, globalStyles.line2, globalStyles.shadow]}
                key={item.id}>
                <View style={globalStyles.line}>
                  <Image
                    source={{uri: `${item.image}`}}
                    style={styles.ingredient}
                  />
                  <Text ms="m" variant="poppins12black_regular">
                    {i18n.language == 'ar' ? item.title_ar : item.title}
                  </Text>
                </View>
                <Text variant="poppins12black_medium" color="gray">
                  {item.quantity} {item.unit}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      <View style={[globalStyles.shadow, styles.padd]}>
        <BaseButton
          label={t('choose_another')}
          onPress={() => handleEditClicked(data?.id!, data?.types[0].id!)}
        />
      </View>
      <ChangeMealsModal
        visible={visible}
        onBackToMealsClicked={handleBackSelected}
        onModalItemClicked={handleModalItemClicked}
        onOpenMealClicked={handleOpenMealClicked}
        day={date!}
        type={type}
        isLoading={mealPending}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  greyitem: {
    backgroundColor: theme.colors.lightGray,
    height: 22,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    marginRight: '3%',
  },
  ingredient: {width: 30, height: 30},
  padd: {paddingHorizontal: '5%', paddingVertical: '3%'},
  container: {
    top: -250,
  },
  item: {
    height: 55,
    borderRadius: 8,
    backgroundColor: theme.colors.white,
    paddingHorizontal: '5%',
    marginBottom: '4%',
  },
  skeletonitem: {borderRadius: 8},
  main: {
    marginTop: '5%',
    backgroundColor: theme.colors.screen,
    padding: '5%',
    borderTopLeftRadius: 33,
    borderTopRightRadius: 33,
  },
  items: {
    alignItems: 'center',
    backgroundColor: theme.colors.input,
    height: 102,
    width: 58,
    justifyContent: 'space-between',
    flexDirection: 'column',
    paddingVertical: '2%',
    borderRadius: 14,
    marginTop: '5%',
  },
  icon: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: theme.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Dish;
