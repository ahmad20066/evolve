import {globalStyles} from '@/styles/globalStyles';
import RNBounceable from '@freakycoder/react-native-bounceable';
import React, {memo} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {Text, theme} from './theme';
import Candle from '@/assets/svg/candle.svg';
import Repeat from '@/assets/svg/refresh.svg';
import Reshcedule from '@/assets/svg/refresh2.svg';
import Cross from '@/assets/svg/cross.svg';
import Tick from '@/assets/svg/tick-orange.svg';
import Clock from '@/assets/svg/clock.svg';
import {IExercise} from '@/types/exercises';
import {useTranslation} from 'react-i18next';

interface planInterface {
  item: IExercise;
  onItemClicked: (id: number) => void;
  meal?: boolean;
}

const PlanItem = ({item, onItemClicked}: planInterface) => {
  const {i18n} = useTranslation();
  return (
    <RNBounceable
      style={[globalStyles.line, styles.item]}
      onPress={() => onItemClicked(item.id)}>
      <Image source={{uri: `${item?.image_urls[0]}`}} style={styles.img} />
      <View style={styles.details}>
        <View style={globalStyles.line}>
          {item.status === 'completed' ? (
            <Tick color={theme.colors.apptheme} />
          ) : (
            item.status === 'pending' && (
              <Reshcedule color={theme.colors.apptheme} />
            )
          )}
          <Text
            textTransform="capitalize"
            variant="poppins12black_regular"
            ms="s"
            color="apptheme">
            {item.status}
          </Text>
        </View>
        <Text
          textAlign="left"
          variant="poppins12black_medium"
          numberOfLines={2}>
          {i18n.language == 'ar' ? item.name_ar : item.name}
        </Text>
        <View style={globalStyles.line}>
          {item?.stats?.duration && (
            <View style={globalStyles.line}>
              <Clock color={theme.colors.gray} />
              <Text ms="xs" variant="poppins12black_regular" color="gray">
                {item.stats.duration} mins
              </Text>
            </View>
          )}
          {item?.stats?.sets && (
            <View style={globalStyles.line}>
              <Candle color={theme.colors.gray} />
              <Text ms="xs" variant="poppins12black_regular" color="gray">
                {item.stats.sets} Sets
              </Text>
            </View>
          )}
          {item?.stats?.reps && (
            <>
              <View style={styles.greyLine} />
              <View style={globalStyles.line}>
                <Repeat color={theme.colors.gray} />
                <Text ms="xs" variant="poppins12black_regular" color="gray">
                  {item.stats.reps} reps
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
  img: {width: 112, height: 80, borderRadius: 8},
  details: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    marginStart: '5%',
    height: 90,
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
  greyLine: {
    height: 15,
    width: 1,
    backgroundColor: theme.colors.gray,
    marginHorizontal: '5%',
  },
});

export default memo(PlanItem);
