import React from 'react';
import {StyleSheet, View} from 'react-native';
import Tick from '@/assets/svg/tick-circle.svg';
import Calendar from '@/assets/svg/calendar.svg';
import {Text, theme} from './theme';
import {globalStyles} from '@/styles/globalStyles';
import RNBounceable from '@freakycoder/react-native-bounceable';
import Crown from '@/assets/svg/crown.svg';
import {useTranslation} from 'react-i18next';
import {IPricing} from '@/types/pricing';
import {calculateMonths} from '@/utils/month';
import {IWorkoutPlans} from '@/hooks/useWorkoutPlans';

interface packageProps {
  item: IWorkoutPlans;
  active: number | undefined;
  setActive: (active: number) => void;
  onItemSelected: (item: IWorkoutPlans) => void;
  islast?: boolean;
}
const WorkoutSelector = ({
  item,
  active,
  setActive,
  onItemSelected,
  islast,
}: packageProps) => {
  const isActive = active === item.id;
  const {i18n} = useTranslation();

  return (
    <RNBounceable
      style={[
        styles.container,
        {marginRight: islast ? 20 : 0},
        isActive && {
          borderWidth: 1,
          borderColor: theme.colors.apptheme,
        },
      ]}
      onPress={() => {
        setActive(item.id);
        onItemSelected(item);
      }}>
      <View style={styles.svg}>
        <Crown color={theme.colors.black} />
      </View>
      <Text
        style={styles.text}
        mt="m"
        mb="s"
        variant="poppins16black_semibold"
        textTransform="capitalize"
        numberOfLines={1}>
        {i18n.language == 'ar' ? item.name_ar : item.name}
      </Text>
      {/* <View style={[globalStyles.line, styles.margin]}>
        <Fire width={18} height={18} color={theme.colors.mediumGray} />
        <Text
          ms="s"
          style={styles.text}
          variant="poppins14black_regular"
          color="gray"
          numberOfLines={1}>
          Serves up to {item.calories} cal
        </Text>
      </View> */}
      <View style={[globalStyles.line, styles.margin]}>
        <Calendar width={18} height={18} color={theme.colors.mediumGray} />
        <Text ms="s" variant="poppins14black_regular" color="gray">
          Skip any time
        </Text>
      </View>
      <View style={[globalStyles.line, styles.margin]}>
        <Tick color={theme.colors.mediumGray} />
        <Text ms="s" variant="poppins14black_regular" color="gray">
          1 week/ 6day
        </Text>
      </View>
      <View style={[globalStyles.line, styles.margin]}>
        <Text
          variant="poppins12black_semibold"
          color="apptheme"
          lineHeight={12}>
          SAR
        </Text>
        <Text
          variant="poppins18black_semibold"
          color="apptheme"
          fontSize={24}
          lineHeight={41}>
          {item?.pricings?.[0]?.price}
        </Text>
        <Text variant="poppins12black_regular" color="gray" lineHeight={41}>
          / {calculateMonths(item?.pricings?.[0]?.number_of_days)} month
          {calculateMonths(item?.pricings?.[0]?.number_of_days) > 1 ? 's' : ''}
        </Text>
      </View>
    </RNBounceable>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 25,
    paddingBottom: 15,
    borderRadius: 12,
    shadowColor: '#0000001A',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.8,
    shadowRadius: 10,
    backgroundColor: theme.colors.white,
    elevation: 5,
    marginVertical: 20,
    marginLeft: 20,
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    maxWidth: 225,
  },
  margin: {marginTop: '5%'},
  svg: {
    backgroundColor: theme.colors.input,
    justifyContent: 'center',
    alignItems: 'center',
    width: 48,
    height: 48,
    borderRadius: 12,
  },
  text: {maxWidth: 150},
});

export default WorkoutSelector;
