import {globalStyles} from '@/styles/globalStyles';
import React, {useState} from 'react';
import {Platform, StyleSheet, TextInput, View} from 'react-native';
import Back from '@/assets/svg/arrow-left.svg';
import RoundButton from '@/components/roundButton';
import RNBounceable from '@freakycoder/react-native-bounceable';
import {Text, theme} from '@/components/theme';
import BaseButton from '@/components/baseBtn';
import {AppNavigationProps} from '@/navigators/navigation';
import {useTranslation} from 'react-i18next';

const Weight = ({navigation, route}: AppNavigationProps<'Weight'>) => {
  const {token, gender, age} = route.params;
  const {t} = useTranslation();
  const weight = [
    {label: t('kg'), key: 1},
    {label: t('lb'), key: 2},
  ];
  const [active, setactive] = useState(1);
  const [value, setValue] = useState<number>(50);
  const handleInputChange = (text: string) => {
    const numericValue = parseInt(text, 10);
    if (!isNaN(numericValue)) {
      setValue(numericValue);
    } else {
      setValue(0); // Default to 0 if input is invalid
    }
  };

  const increaseValue = () => {
    setValue(prevValue => prevValue + 5);
  };

  const decreaseValue = () => {
    setValue(prevValue => (prevValue > 0 ? prevValue - 5 : 0)); // Prevent negative values
  };
  return (
    <View style={[globalStyles.container, styles.container]}>
      <View>
        <RoundButton onPress={() => navigation.goBack()}>
          <Back color={theme.colors.black} />
        </RoundButton>
        <Text mt="xl" mb="s" variant="poppins16black_medium" textAlign="center">
          3
          <Text variant="poppins16black_regular" color="gray">
            /6
          </Text>
        </Text>
        <Text mb="s" textAlign="center" variant="unbounded20black_medium">
          {t('whats_your')}{' '}
          <Text variant="unbounded20black_medium" color="apptheme">
            {t('weight')}?
          </Text>
        </Text>
        <Text textAlign="center" variant="poppins14black_regular" color="gray">
          {t('weight_description')}
        </Text>
        <View style={[globalStyles.line, styles.weightype]}>
          {weight.map(item => (
            <RNBounceable
              key={item.key}
              onPress={() => setactive(item.key)}
              style={[
                styles.btn,
                {
                  backgroundColor:
                    active == item.key
                      ? theme.colors.lightGreen
                      : theme.colors.screen,
                },
              ]}>
              <Text
                variant="poppins14black_regular"
                color={active == item.key ? 'black' : 'gray'}>
                {item.label}
              </Text>
            </RNBounceable>
          ))}
        </View>
        <View style={[styles.plusminus, globalStyles.line2]}>
          <RNBounceable style={styles.smallcircles} onPress={decreaseValue}>
            <Text
              variant="poppinsTitle20black_regular"
              lineHeight={30}
              fontSize={21}
              color="white">
              -
            </Text>
          </RNBounceable>
          <View style={globalStyles.line}>
            <TextInput
              style={styles.input}
              value={value.toString()}
              onChangeText={handleInputChange}
              keyboardType="numeric"
              textAlign="center"
            />
            <Text variant="poppins12black_bold" color="apptheme">
              {active == 1 ? t('kg') : t('lb')}
            </Text>
          </View>
          <RNBounceable style={styles.smallcircles} onPress={increaseValue}>
            <Text
              lineHeight={30}
              fontSize={21}
              variant="poppinsTitle20black_regular"
              color="white">
              +
            </Text>
          </RNBounceable>
        </View>
      </View>
      <BaseButton
        label={t('continue')}
        onPress={() =>
          navigation.navigate('Height', {token, age, gender, weight: value})
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: '5%',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  weightype: {alignSelf: 'center', marginVertical: '5%'},
  btn: {
    width: 56,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 35,
  },
  input: {
    width: 30,
    height: 35,
    borderColor: '#ccc',
    fontSize: 16,
    lineHeight: Platform.OS == 'android' ? 12 : 20,
    marginHorizontal: 10,
    fontFamily: 'Poppins-Bold',
    paddingBottom: 0,
  },
  plusminus: {
    borderWidth: 1,
    borderColor: theme.colors.apptheme,
    borderRadius: 51,
    width: 220,
    backgroundColor: theme.colors.input,
    height: 55,
    paddingHorizontal: '3%',
    alignSelf: 'center',
    marginTop: '15%',
  },
  smallcircles: {
    width: 37,
    height: 37,
    borderRadius: 18.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.apptheme,
  },
});

export default Weight;
