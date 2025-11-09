import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import Toast, {ToastPosition} from 'react-native-toast-message';
import {Text, theme} from '@/components/theme';
import Success from '@/assets/svg/verify.svg';
import Error from '@/assets/svg/information.svg';

interface toastprop {
  text1?: string;
}

const {width} = Dimensions.get('window');

export const toastConfig = {
  successToast: ({text1}: toastprop) => (
    <View style={[styles.toast, styles.shadow]}>
      <View style={[styles.circle, {backgroundColor: '#19B93C1F'}]}>
        <Success />
      </View>
      <Text ml="s" variant="poppins14black_medium">
        {text1}
      </Text>
    </View>
  ),
  errorToast: ({text1}: toastprop) => (
    <View style={[styles.toast, styles.shadow]}>
      <View style={[styles.circle, {backgroundColor: '#DF3F321F'}]}>
        <Error />
      </View>
      <Text ml="s" variant="poppins14black_medium" style={styles.text}>
        {text1}
      </Text>
    </View>
  ),
};

export function showToast(
  toastType: 'successToast' | 'errorToast',
  message: string,
  position: ToastPosition,
) {
  Toast.show({
    type: toastType,
    text1: message,
    position: position,
  });
}

const styles = StyleSheet.create({
  toast: {
    width: 0.9 * width,
    borderRadius: 37,
    paddingHorizontal: '3%',
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 60,
    backgroundColor: theme.colors.white,
    paddingVertical: 10,
  },
  text: {maxWidth: 300},
  circle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadow: {
    shadowColor: '#0000001A',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
});
