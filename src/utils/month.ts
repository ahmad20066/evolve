export const calculateMonths = (days: number): number => {
  const averageDaysInMonth = 30.44;
  return Math.round(days / averageDaysInMonth);
};
