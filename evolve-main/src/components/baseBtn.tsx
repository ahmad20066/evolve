import RNBounceable from '@freakycoder/react-native-bounceable';
import React from 'react';
import {Text, theme} from './theme';
import {ActivityIndicator, StyleSheet} from 'react-native';

interface btnProps {
  onPress?: () => void;
  label: string;
  disabled?: boolean;
  isLoading?: boolean;
  mb?: number;
  mt?: number;
}

const BaseButton = ({
  onPress,
  label,
  disabled,
  isLoading,
  mt,
  mb,
}: btnProps) => {
  return (
    <RNBounceable
      disabled={disabled}
      {...{onPress}}
      style={[styles.btn, {marginTop: mt, marginBottom: mb}]}>
      {isLoading ? (
        <ActivityIndicator color={theme.colors.white} />
      ) : (
        <Text color="white" variant="poppins14black_regular">
          {label}
        </Text>
      )}
    </RNBounceable>
  );
};
const styles = StyleSheet.create({
  btn: {
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 51,
    backgroundColor: theme.colors.apptheme,
    marginVertical: '5%',
  },
});
export default BaseButton;
