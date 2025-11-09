import {Text, theme} from '@/components/theme';
import {globalStyles} from '@/styles/globalStyles';
import RNBounceable from '@freakycoder/react-native-bounceable';
import React, {memo} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import Fire from '@/assets/svg/fire.svg';
import {IMealsofWeek} from '@/types/weakMeals';
import {useTranslation} from 'react-i18next';

interface MealProps {
  item: IMealsofWeek;
  onItemClicked?: (id: number) => void;
}

const MealsItem = ({item, onItemClicked}: MealProps) => {
  const {i18n} = useTranslation();
  const backColor =
    item.types[0].title == 'Breakfast'
      ? '#EB440F1A'
      : item.types[0].title == 'Lunch'
      ? '#EBF0F3'
      : '#E8FCC6';
  return (
    <RNBounceable
      style={[globalStyles.shadow, globalStyles.line, styles.item]}
      onPress={() => onItemClicked && onItemClicked(item.id)}>
      <Image source={{uri: `${item.images[0]}`}} style={styles.img} />
      <View style={styles.details}>
        <Text
          variant="poppins12black_medium"
          numberOfLines={2}
          textTransform="capitalize">
          {i18n.language == 'ar' ? item.name_ar : item.name}
        </Text>
        <View style={globalStyles.line}>
          <Fire color={theme.colors.apptheme} />
          <Text ms="xs" variant="poppins12black_regular" color="gray">
            {item.calories} cal
          </Text>
        </View>
        <View style={globalStyles.line}>
          <View style={[styles.greyitem, {backgroundColor: backColor}]}>
            <Text
              variant="poppins12black_regular"
              color={
                item.types[0].title == 'Breakfast'
                  ? 'apptheme'
                  : item.types[0].title == 'Lunch'
                  ? 'lunch'
                  : 'dinner'
              }>
              {item.types[0].title}
            </Text>
          </View>
        </View>
      </View>
    </RNBounceable>
  );
};

const styles = StyleSheet.create({
  img: {width: 112, height: 90, borderRadius: 8},
  details: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginStart: '5%',
    height: 90,
  },
  item: {marginTop: '5%', padding: '3%', borderRadius: 12},
  greyitem: {
    backgroundColor: theme.colors.lightGray,
    height: 22,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    marginRight: '3%',
  },
});

export default memo(MealsItem);
