import {Text, theme} from '@/components/theme';
import React, {useEffect, useRef} from 'react';
import {Animated, Dimensions, Platform, StyleSheet, View} from 'react-native';
import Svg, {Circle, G} from 'react-native-svg';
import Right from '@/assets/svg/arrow-right.svg';
import RNBounceable from '@freakycoder/react-native-bounceable';
import {globalStyles} from '@/styles/globalStyles';
import {StackNavigationProp} from '@react-navigation/stack';
import {AppRoutes} from '@/navigators/navigation';
import {useTranslation} from 'react-i18next';

interface NextProps {
  scrollTo: () => void;
  percentage: number;
  index: number;
  nav: StackNavigationProp<AppRoutes, keyof AppRoutes>;
}

const {height} = Dimensions.get('screen');

const NextBtn = ({scrollTo, percentage, index, nav}: NextProps) => {
  const {t} = useTranslation();
  const size = 64;
  const strokewidth = 2;
  const center = size / 2;
  const radius = size / 2 - strokewidth / 2;
  const circumference = 2 * Math.PI * radius;
  const progressAnimation = useRef(new Animated.Value(0)).current;
  const progressRef = useRef<Circle>(null);
  const animation = (toValue: number) => {
    return Animated.timing(progressAnimation, {
      toValue,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    animation(percentage);
  }, [percentage]);
  // useEffect(() => {
  //   progressAnimation.addListener(({value}) => {
  //     const strokeDashoffset = circumference - (circumference * value) / 100;

  //     if (progressRef.current) {
  //       progressRef.current.setNativeProps({
  //         strokeDashoffset,
  //       });
  //     }
  //   });

  //   // Clean up the listener when the component unmounts
  //   return () => {
  //     progressAnimation.removeAllListeners();
  //   };
  // }, []);

  return (
    <View
      style={[
        styles.container,
        {alignItems: index != 3 ? 'center' : 'stretch'},
      ]}>
      {index == 3 ? (
        <RNBounceable
          style={[styles.btn2, globalStyles.line]}
          onPress={() => nav.navigate('Login')}>
          <Text me="s" variant="poppins14black_regular" color="white">
            {t('onboard_button_text')}
          </Text>
          <Right color={theme.colors.black} />
        </RNBounceable>
      ) : (
        <>
          <Svg width={size} height={size} fill={theme.colors.white}>
            <G rotation={'-90'} origin={center}>
              <Circle
                stroke={theme.colors.softGray}
                cx={center}
                cy={center}
                r={radius}
                strokeWidth={strokewidth}
              />
              <Circle
                ref={progressRef}
                stroke={theme.colors.apptheme}
                cx={center}
                cy={center}
                r={radius}
                strokeWidth={strokewidth}
                strokeDasharray={circumference}
                strokeDashoffset={circumference - (circumference * 90) / 100}
              />
            </G>
          </Svg>

          <RNBounceable style={styles.btn} onPress={scrollTo}>
            <Right color={theme.colors.black} />
          </RNBounceable>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: Platform.OS == 'android' ? height * 0.15 : height * 0.18,
    justifyContent: 'center',
  },
  btn: {
    position: 'absolute',
    backgroundColor: theme.colors.apptheme,
    borderRadius: 100,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn2: {
    height: 50,
    borderRadius: 50,
    backgroundColor: theme.colors.apptheme,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: '5%',
  },
});

export default NextBtn;
