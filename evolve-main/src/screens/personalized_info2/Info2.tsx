import {globalStyles} from '@/styles/globalStyles';
import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import Back from '@/assets/svg/arrow-left.svg';
import RoundButton from '@/components/roundButton';
import {Text, theme} from '@/components/theme';
import RNBounceable from '@freakycoder/react-native-bounceable';
import BaseButton from '@/components/baseBtn';
import Squat from '@/assets/svg/squat.svg';
import {AppNavigationProps} from '@/navigators/navigation';

const Info2 = ({navigation}: AppNavigationProps<'Info'>) => {
  const [sum, setsum] = useState(0);
  const increaseValue = () => {
    setsum(sum + 5);
  };
  const decreaseValue = () => {
    if (sum != 0) setsum(sum - 5);
  };

  return (
    <View style={[globalStyles.container, styles.container]}>
      <View>
        <View style={globalStyles.line2}>
          <RoundButton onPress={() => navigation.goBack()}>
            <Back color={theme.colors.black} />
          </RoundButton>
          <RNBounceable>
            <Text variant="poppins14black_regular" color="gray">
              Skip for now
            </Text>
          </RNBounceable>
        </View>
        <Text mt="xl" mb="s" variant="poppins16black_medium" textAlign="center">
          2
          <Text variant="poppins16black_regular" color="gray">
            /3
          </Text>
        </Text>
        <Text mb="s" textAlign="center" variant="unbounded20black_medium">
          What is the weight of the{' '}
          <Text variant="unbounded20black_medium" color="apptheme">
            Squat{' '}
          </Text>
          that you lift?
        </Text>
        <Text textAlign="center" variant="poppins14black_regular" color="gray">
          We will use this data to give you the best{'\n'}diet, don’t worry you
          can edit later
        </Text>
        <View style={styles.circle}>
          <Squat />
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
          <Text variant="poppins16black_bold">
            {sum}
            <Text variant="poppins12black_bold" color="apptheme">
              {' '}
              KG
            </Text>
          </Text>
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
        label="Continue"
        onPress={() => navigation.navigate('Info3')}
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
  circle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.input,
    alignSelf: 'center',
    marginVertical: '10%',
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

export default Info2;
