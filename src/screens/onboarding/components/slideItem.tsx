import {Text, theme} from '@/components/theme';
import {globalStyles} from '@/styles/globalStyles';
import React from 'react';
import {
  Dimensions,
  ImageBackground,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import Back from '@/assets/svg/arrow-left.svg';
import RNBounceable from '@freakycoder/react-native-bounceable';
import {StackNavigationProp} from '@react-navigation/stack';
import {AppRoutes} from '@/navigators/navigation';
import RoundButton from '@/components/roundButton';
import {useTranslation} from 'react-i18next';

interface SlideProps {
  item: {
    title?: string;
    key: number;
    subtitle?: string;
    main_img: string | HTMLImageElement;
  };
  local?: boolean;
  scrollBack: () => void;
  index: number;
  nav?: StackNavigationProp<AppRoutes, keyof AppRoutes>;
  backflag?: boolean;
}

const {width, height} = Dimensions.get('screen');

const SlideItem = ({
  item,
  scrollBack,
  index,
  nav,
  backflag,
  local,
}: SlideProps) => {
  const {t} = useTranslation();
  const imageSource = local ? item.main_img : {uri: item.main_img};
  return (
    <View style={styles.container}>
      <ImageBackground
        resizeMode="cover"
        source={imageSource}
        defaultSource={require('@/assets/images/workout.png')}
        style={styles.logo}
        borderBottomLeftRadius={30}
        borderBottomRightRadius={30}>
        <View style={[globalStyles.line2, styles.margin]}>
          {backflag ? (
            <RoundButton onPress={() => nav?.goBack()}>
              <Back color={theme.colors.white} />
            </RoundButton>
          ) : index != 0 ? (
            <RoundButton onPress={scrollBack}>
              <Back color={theme.colors.white} />
            </RoundButton>
          ) : (
            <View />
          )}
          {!backflag && (
            <RNBounceable onPress={() => nav?.navigate('Login')}>
              <Text variant="poppins16black_regular" color="white">
                {t('skip')}
              </Text>
            </RNBounceable>
          )}
        </View>
      </ImageBackground>
      <Text mt="xl" textAlign="center" variant="unbounded20black_medium">
        {item.title}
      </Text>
      <Text
        marginHorizontal="l"
        mt="s"
        textAlign="center"
        lineHeight={27}
        variant="poppins16black_regular"
        color="gray">
        {item.subtitle}
      </Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    width: width,
    height: Platform.OS == 'android' ? height * 0.6 : height * 0.65,
  },
  logo: {
    width: width,
    height: Platform.OS == 'android' ? height * 0.6 : height * 0.65,
  },
  margin: {marginTop: '20%', marginHorizontal: '5%'},
});

export default SlideItem;
