import {Text, theme} from '@/components/theme';
import React, {useState} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import Heart from '@/assets/svg/heart.svg';
import Abs from '@/assets/svg/abs.svg';
import Rank from '@/assets/svg/ranking2.svg';
import Medal from '@/assets/svg/medal.svg';
import Tooth from '@/assets/svg/tooth.svg';
import Legs from '@/assets/svg/legs.svg';
import RNBounceable from '@freakycoder/react-native-bounceable';
import {globalStyles} from '@/styles/globalStyles';
import BaseButton from '@/components/baseBtn';

interface ExerciseProps {
  reff: any;
}

const {height} = Dimensions.get('screen');

const list = [
  {key: 1, sport: 'Beginner', icon: <Heart />},
  {key: 2, sport: 'Intermediate', icon: <Medal />},
  {key: 4, sport: 'Expert', icon: <Rank />},
];

const list2 = [
  {key: 1, sport: 'Upper Body', icon: <Abs />},
  {key: 2, sport: 'Middle Body', icon: <Tooth />},
  {key: 4, sport: 'Lower Body', icon: <Legs />},
];

const ExerciseLevelSheet = ({reff}: ExerciseProps) => {
  const [active, setactive] = useState<number>();
  const [active2, setactive2] = useState<number>();
  return (
    <RBSheet
      ref={reff}
      closeOnPressMask={true}
      height={0.75 * height}
      customStyles={{
        draggableIcon: {
          width: 0,
          height: 0,
        },
        container: styles.container,
      }}>
      <Text variant="poppins16black_semibold">Exercises Level</Text>
      {list.map(item => (
        <RNBounceable
          style={[
            styles.item,
            globalStyles.shadow,
            {
              borderColor:
                active == item.key
                  ? theme.colors.lightGreen
                  : theme.colors.white,
            },
          ]}
          onPress={() => setactive(item.key)}
          key={item.key}>
          <View style={globalStyles.line}>
            {item.icon}
            <Text ms="m" variant="poppins14black_regular" color="gray">
              {item.sport}
            </Text>
          </View>
        </RNBounceable>
      ))}
      <Text mt="l" variant="poppins16black_semibold">
        Exercises Type
      </Text>
      {list2.map(item => (
        <RNBounceable
          style={[
            styles.item,
            globalStyles.shadow,
            {
              borderColor:
                active2 == item.key
                  ? theme.colors.lightGreen
                  : theme.colors.white,
            },
          ]}
          onPress={() => setactive2(item.key)}
          key={item.key}>
          <View style={globalStyles.line}>
            {item.icon}
            <Text ms="m" variant="poppins14black_regular" color="gray">
              {item.sport}
            </Text>
          </View>
        </RNBounceable>
      ))}
      <BaseButton label="Apply" />
    </RBSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    borderTopStartRadius: 33,
    borderTopEndRadius: 33,
    paddingHorizontal: '5%',
    paddingVertical: '7%',
  },
  item: {
    borderWidth: 1,
    height: 55,
    borderRadius: 8,
    backgroundColor: theme.colors.white,
    paddingHorizontal: '5%',
    marginTop: '4%',
    justifyContent: 'center',
  },
});

export default ExerciseLevelSheet;
