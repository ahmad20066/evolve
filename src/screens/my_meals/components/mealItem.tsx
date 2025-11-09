import {globalStyles} from '@/styles/globalStyles';
import RNBounceable from '@freakycoder/react-native-bounceable';
import React, {memo} from 'react';
import {ImageBackground, StyleSheet, View} from 'react-native';
import Fire from '@/assets/svg/fire.svg';
import Edit from '@/assets/svg/edit.svg';
import {Text, theme} from '@/components/theme';
import {IMealsMy} from '@/types/myMeal';
import {useTranslation} from 'react-i18next';

interface planInterface {
  item: IMealsMy;
  onItemClicked?: (id: number) => void;
  onEditClicked?: (id: number, type: number) => void;
}

const MealItem = ({item, onItemClicked, onEditClicked}: planInterface) => {
  const {i18n} = useTranslation();
  const backColor =
    item.type == 'Breakfast'
      ? '#EB440F1A'
      : item.type == 'Lunch'
      ? '#EBF0F3'
      : '#E8FCC6';

  return (
    <RNBounceable
      style={[globalStyles.line, styles.item]}
      onPress={() => onItemClicked && onItemClicked(item.meal.id)}>
      <ImageBackground
        source={{uri: `${item.meal.images[0]}`}}
        style={styles.img}
        imageStyle={styles.imgRadius}>
        <RNBounceable
          style={styles.edit}
          onPress={() =>
            onEditClicked &&
            onEditClicked(item.selection_id, item.meal.types[0].id)
          }>
          <Edit />
        </RNBounceable>
      </ImageBackground>
      <View style={styles.details}>
        <View style={globalStyles.line}>
          <View style={[styles.type, {backgroundColor: backColor}]}>
            <Text
              variant="poppins12black_regular"
              fontSize={10}
              color={
                item.type == 'Breakfast'
                  ? 'apptheme'
                  : item.type == 'Lunch'
                  ? 'lunch'
                  : 'dinner'
              }>
              {item.type}
            </Text>
          </View>
        </View>
        <Text
          variant="poppins12black_medium"
          numberOfLines={2}
          textTransform="capitalize">
          {i18n.language == 'ar' ? item.meal.name_ar : item.meal.name}
        </Text>
        <View style={globalStyles.line}>
          {item.meal.calories && (
            <>
              <View style={globalStyles.line}>
                <Fire color={theme.colors.apptheme} />
                <Text ms="xs" variant="poppins12black_regular" color="gray">
                  {item.meal.calories} cal
                </Text>
              </View>
            </>
          )}
        </View>
      </View>
    </RNBounceable>
  );
};

const styles = StyleSheet.create({
  img: {width: 112, height: 80},
  imgRadius: {borderRadius: 8},
  details: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    marginStart: '5%',
    height: 90,
  },
  type: {
    borderRadius: 5,
    height: 20,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    marginHorizontal: '3%',
    paddingVertical: '4%',
    borderBottomWidth: 1,
    borderBlockColor: theme.colors.softGray,
  },
  greyitem: {
    backgroundColor: theme.colors.lightGray,
    height: 22,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    marginRight: '3%',
  },
  edit: {
    backgroundColor: '#000000A1',
    alignSelf: 'flex-start',
    width: 28,
    height: 28,
    borderTopLeftRadius: 8,
    borderEndEndRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greyLine: {
    height: 15,
    width: 1,
    backgroundColor: theme.colors.gray,
    marginHorizontal: '5%',
  },
});

export default memo(MealItem);
