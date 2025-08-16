import RoundButton from '@/components/roundButton';
import {Text, theme} from '@/components/theme';
import {AppNavigationProps} from '@/navigators/navigation';
import {globalStyles} from '@/styles/globalStyles';
import RNBounceable from '@freakycoder/react-native-bounceable';
import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import Back from '@/assets/svg/arrow-left.svg';
import BaseButton from '@/components/baseBtn';
import {WheelPicker} from 'react-native-infinite-wheel-picker';
import {useTranslation} from 'react-i18next';

const {height} = Dimensions.get('screen');

const Age = ({navigation, route}: AppNavigationProps<'Age'>) => {
  const {t} = useTranslation();
  const initialData = Array.from({length: 70}, (_, index) => index + 1);
  const [selectedIndex, setSelectedIndex] = React.useState(10);

  const {token, gender} = route.params;

  return (
    <View style={[globalStyles.container, styles.container]}>
      <View>
        <RoundButton onPress={() => navigation.goBack()}>
          <Back color={theme.colors.black} />
        </RoundButton>
        <Text mt="xl" mb="s" variant="poppins16black_medium" textAlign="center">
          2
          <Text variant="poppins16black_regular" color="gray">
            /6
          </Text>
        </Text>
        <Text mb="s" textAlign="center" variant="unbounded20black_medium">
          {t('whats_your')}{' '}
          <Text variant="unbounded20black_medium" color="apptheme">
            {t('age')}?
          </Text>
        </Text>
        <Text textAlign="center" variant="poppins14black_regular" color="gray">
          {t('age_description')}
        </Text>
        <WheelPicker
          initialSelectedIndex={15}
          data={initialData}
          restElements={2}
          elementHeight={80}
          onChangeValue={value => {
            setSelectedIndex(value);
          }}
          infiniteScroll={false}
          selectedIndex={selectedIndex}
          containerStyle={styles.containerStyle}
          selectedLayoutStyle={styles.selectedLayoutStyle}
          elementTextStyle={styles.elementTextStyle}
          elementContainerStyle={styles.elementContainerStyle}
        />
        ;
      </View>
      <BaseButton
        label={t('continue')}
        onPress={() =>
          navigation.navigate('Weight', {
            token,
            gender,
            age: (selectedIndex + 1).toString(),
          })
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
  elementTextStyle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 40,
    color: theme.colors.apptheme,
  },
  selectedLayoutStyle: {
    backgroundColor: theme.colors.white,
    borderTopWidth: 4,
    borderBottomWidth: 4,
    borderTopColor: theme.colors.lightGreen,
    borderBottomColor: theme.colors.lightGreen,
    width: 48,
    alignSelf: 'center',
  },
  elementContainerStyle: {height: height * 0.5},
  containerStyle: {marginVertical: '10%'},
});

export default Age;
