import React from 'react';
import {StyleSheet, View} from 'react-native';
import Right from '@/assets/svg/right.svg';
import {globalStyles} from '@/styles/globalStyles';
import {Text, theme} from '@/components/theme';
import Burger from '@/assets/svg/burger.svg';
import RNBounceable from '@freakycoder/react-native-bounceable';
import {INotification} from '@/hooks/useNotification';

export interface NotificationProps {
  item: INotification;
}

const NotificationItem = ({item}: NotificationProps) => {
  return (
    <RNBounceable style={[globalStyles.line2, styles.item]}>
      <View style={globalStyles.line}>
        <View style={styles.circle}>
          <Burger width={20} height={20} color={theme.colors.apptheme} />
          {!item.is_read && <View style={styles.dot} />}s
        </View>
        <View>
          <Text color="darkGray" variant="poppins12black_medium">
            {item.title}
          </Text>
          <Text
            variant="poppins12black_regular"
            fontSize={10}
            color="mediumGray"
            mt="xs">
            {item.body}
          </Text>
        </View>
      </View>
      <Right color={theme.colors.black} />
    </RNBounceable>
  );
};

const styles = StyleSheet.create({
  circle: {
    height: 40,
    width: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.input,
    marginRight: '5%',
  },
  item: {paddingVertical: '5%'},
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.lightGreen,
    position: 'absolute',
    top: 0,
    right: 0,
  },
});

export default NotificationItem;
