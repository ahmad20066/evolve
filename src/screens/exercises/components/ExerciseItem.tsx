import {Text, theme} from '@/components/theme';
import {globalStyles} from '@/styles/globalStyles';
import RNBounceable from '@freakycoder/react-native-bounceable';
import React, {memo} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {getAbbreviatedDayName} from '@/utils/day';
import {useTranslation} from 'react-i18next';
import {IPackageWorkouts} from '@/hooks/usePackageWorkouts';

interface MealProps {
  item: IPackageWorkouts;
  onItemClicked: (item: IPackageWorkouts) => void;
}

const ExercisesItem = ({item, onItemClicked}: MealProps) => {
  const {i18n, t} = useTranslation();
  const type = item.type == 'group' ? t('group') : t('personalized');
  return (
    <RNBounceable
      style={[globalStyles.shadow, globalStyles.line2, styles.item]}
      onPress={() => onItemClicked(item)}>
      <View style={[globalStyles.line, {flex: 1}]}>
        <Image source={{uri: `${item.image}`}} style={styles.img} />
        <View style={styles.details}>
          <Text
            textAlign="left"
            variant="poppins12black_medium"
            numberOfLines={2}>
            {i18n.language == 'ar' ? item.title_ar : item.title}
          </Text>
          <View style={globalStyles.line}>
            <Text
              textTransform="capitalize"
              variant="poppins12black_regular"
              color="gray">
              {type}
            </Text>
          </View>
          <View style={globalStyles.line}>
            <View style={styles.greyitem}>
              <Text variant="poppins12black_regular" color="gray">
                {item.duration} min
              </Text>
            </View>
            <View style={styles.greyitem}>
              <Text variant="poppins12black_regular" color="gray">
                {item.difficulty_level}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.day}>
        <Text variant="poppins12black_medium" color="apptheme">
          {getAbbreviatedDayName(item.day!)}
        </Text>
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
  day: {alignSelf: 'flex-start'},
  greyitem: {
    backgroundColor: theme.colors.lightGray,
    height: 22,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    marginRight: '3%',
  },
  greyLine: {
    height: 15,
    width: 1,
    backgroundColor: theme.colors.gray,
    marginHorizontal: '5%',
  },
});

export default memo(ExercisesItem);
