import {Idays} from '@/types/days';

export const dayNames: Idays[] = [
  'SUN',
  'MON',
  'TUE',
  'WED',
  'THU',
  'FRI',
  'SAT',
];

export const dayNamesFull: Record<Idays, string> = {
  SUN: 'sunday',
  MON: 'monday',
  TUE: 'tuesday',
  WED: 'wednesday',
  THU: 'thursday',
  FRI: 'friday',
  SAT: 'saturday',
};

export const getFullDayName = (abbreviated?: Idays): string => {
  const dayToUse = abbreviated || getCurrentDay(); // Use the provided day or fallback to the current day
  return dayNamesFull[dayToUse] || dayToUse; // Return full name or the abbreviation if not found
};

export const getAbbreviatedDayName = (fullDayName: string): Idays | string => {
  const dayNamesAbbreviated: Record<string, Idays> = {
    sunday: 'SUN',
    monday: 'MON',
    tuesday: 'TUE',
    wednesday: 'WED',
    thursday: 'THU',
    friday: 'FRI',
    saturday: 'SAT',
  };

  const lowerCaseDay = fullDayName?.toLowerCase(); // Normalize input to lowercase for matching
  return dayNamesAbbreviated[lowerCaseDay] || fullDayName; // Return abbreviation or the original name if not found
};

export const getCurrentDay = () => {
  const today = new Date();
  return dayNames[today.getDay()];
};
