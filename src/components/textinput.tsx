import React, {ReactNode, useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {
  TextInput as RNTextInput,
  StyleSheet,
  TextInputProps as RNTextInputProps,
} from 'react-native';
import {Text, theme} from './theme';
import {globalStyles} from '@/styles/globalStyles';
import RNBounceable from '@freakycoder/react-native-bounceable';
import {useTranslation} from 'react-i18next';

interface TextInputProps extends RNTextInputProps {
  touched?: boolean;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  onPressIcon?: () => void;
  marginTop?: boolean;
  rightText?: string;
  onPress?: () => void;
  isLoading?: boolean;
}

const TextInput = ({
  touched,
  error,
  leftIcon,
  rightIcon,
  onPressIcon,
  marginTop,
  rightText,
  onPress,
  isLoading,
  ...props
}: TextInputProps) => {
  const {i18n} = useTranslation();
  const [isFocused, setIsFocused] = useState(false);
  const iconColor = isFocused ? theme.colors.apptheme : theme.colors.gray;
  return (
    <View>
      <View
        style={[
          globalStyles.line2,
          styles.box,
          {marginTop: !marginTop ? '7%' : 0},
          isFocused && {
            backgroundColor: '#FF3D000D',
            borderWidth: 1,
            borderColor: theme.colors.apptheme,
          },
        ]}>
        {React.isValidElement(leftIcon) &&
          React.cloneElement(leftIcon as React.ReactElement, {
            color: iconColor, // Pass color prop only if supported
          })}
        <RNTextInput
          style={[styles.input]}
          placeholderTextColor={theme.colors.gray}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          textAlign={i18n.language == 'en' ? 'left' : 'right'}
          {...props}
        />
        <RNBounceable {...{onPress: onPressIcon}}>
          {React.isValidElement(rightIcon) &&
            React.cloneElement(rightIcon as React.ReactElement, {
              color: iconColor, // Pass color prop only if supported
            })}
        </RNBounceable>
        {rightText && isLoading ? (
          <ActivityIndicator color={theme.colors.apptheme} />
        ) : (
          <RNBounceable {...{onPress}}>
            <Text variant="poppins12black_medium" color={'apptheme'} ms="s">
              {rightText}
            </Text>
          </RNBounceable>
        )}
      </View>

      {error && touched && (
        <Text ms="s" variant="poppins12black_medium" mt="s" color="error">
          {error as string}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: theme.colors.black,
    paddingStart: '4%',
    height: 55,
    flex: 1,
  },
  box: {
    height: 55,
    backgroundColor: theme.colors.input,
    paddingHorizontal: '5%',
    borderRadius: 8,
  },
});

export default TextInput;
