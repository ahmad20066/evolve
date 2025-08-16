import RNBounceable from '@freakycoder/react-native-bounceable';
import React, {useEffect, useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Text, theme} from './theme';
import {Idays} from '@/types/days';
import {useTranslation} from 'react-i18next';

interface DayItem {
  key: Idays; // Store the original Idays key
  label: string; // Store the translated label
  date: number;
}

interface DayProps {
  onDateSelected: (e: string) => void;
  day?: number;
}

const DaySelector = ({onDateSelected, day}: DayProps) => {
  const {t} = useTranslation();
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  const handlePress = (date: number) => {
    setSelectedDate(date);
  };

  useEffect(() => {
    if (day != undefined) setSelectedDate(day);
  }, [day]);

  const getCurrentWeek = (): DayItem[] => {
    const today = new Date();

    const dayKeys: Record<Idays, string> = {
      SUN: t('sun'),
      MON: t('mon'),
      TUE: t('tue'),
      WED: t('wed'),
      THU: t('thu'),
      FRI: t('fri'),
      SAT: t('sat'),
    };
    const dayIndexMap: Record<number, Idays> = {
      0: 'SUN',
      1: 'MON',
      2: 'TUE',
      3: 'WED',
      4: 'THU',
      5: 'FRI',
      6: 'SAT',
    };

    const weekDates: DayItem[] = [];
    for (let i = 0; i < 7; i++) {
      const current = new Date(today);
      current.setDate(today.getDate() + i);

      const dayKey = dayIndexMap[current.getDay()];
      const dayLabel = dayKeys[dayKey]; // Get translated label

      weekDates.push({
        key: dayKey, // Store the Idays enum key
        label: dayLabel, // Store the translated name
        date: current.getDate(),
      });
    }
    return weekDates;
  };

  const currentWeek = useMemo(() => getCurrentWeek(), []);
  const renderItem = ({item}: {item: DayItem}) => {
    const isSelected = item.date === selectedDate;
    const isToday = item.date === new Date().getDate();

    const itemFullDate = new Date();
    itemFullDate.setDate(item.date); // Set the day of the month
    const formattedDate = itemFullDate.toISOString().split('T')[0];

    return (
      <RNBounceable
        key={item.date}
        style={[
          styles.item,
          isToday && {backgroundColor: theme.colors.softGray},
          isSelected && {backgroundColor: theme.colors.apptheme},
        ]}
        onPress={() => {
          handlePress(item.date);
          onDateSelected(formattedDate);
        }}>
        <Text
          variant="poppins12black_regular"
          textTransform="uppercase"
          color={isSelected ? 'white' : 'black'}
          textAlign="center">
          {item.label}
        </Text>
        <Text
          mt="s"
          color={isSelected ? 'white' : 'black'}
          variant="poppins12black_regular"
          textAlign="center">
          {item.date}
        </Text>
      </RNBounceable>
    );
  };

  return (
    <View style={styles.container}>
      {currentWeek.map(item => renderItem({item}))}
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    height: 64,
    width: 40,
    backgroundColor: theme.colors.white,
    borderRadius: 10,
    shadowColor: '#0000001A',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
    justifyContent: 'center',
  },
  container: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: '5%',
    marginBottom: '10%',
  },
});

export default DaySelector;
