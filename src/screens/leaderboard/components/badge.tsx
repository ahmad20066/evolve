import React, {ReactNode} from 'react';
import {StyleSheet, View} from 'react-native';
import Rank from '@/assets/svg/rank.svg';
import {Text} from '@/components/theme';

interface BadgeProps {
  leftIcon?: ReactNode;
  maincolor: string;
  color2: string;
  children: ReactNode;
}

const Badge = ({maincolor, color2, children}: BadgeProps) => {
  return (
    <View style={styles.container}>
      <Rank color={maincolor} />
      <View style={[styles.center, {backgroundColor: color2}]}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    width: 20,
    height: 20,
    borderRadius: 10,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {alignItems: 'center', justifyContent: 'center'},
});

export default Badge;
