import {theme} from '@/components/theme';
import {StyleSheet} from 'react-native';

export const globalStyles = StyleSheet.create({
  line: {flexDirection: 'row', alignItems: 'center'},
  line2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  container: {flex: 1, backgroundColor: theme.colors.screen},
  shadow: {
    backgroundColor: theme.colors.white,
    shadowColor: '#0000001A',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
});
