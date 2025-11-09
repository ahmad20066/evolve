import RNBounceable from '@freakycoder/react-native-bounceable';
import React, {ReactNode} from 'react';
import {StyleSheet} from 'react-native';

interface roundBtnProps {
  children: ReactNode;
  onPress: () => void;
  props?: any; // Additional props to be passed to the component, e.g., testID or accessibilityLabel.
}

const RoundButton = ({children, onPress, props}: roundBtnProps) => {
  return (
    <RNBounceable {...{onPress}} {...{props}} style={[styles.dropdownButton]}>
      {children}
    </RNBounceable>
  );
};

const styles = StyleSheet.create({
  dropdownButton: {
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default RoundButton;
