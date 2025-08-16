import {theme} from '@/components/theme';
import React, {useState} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import BaseButton from '@/components/baseBtn';
import Candle from '@/assets/svg/candle.svg';
import Repeat from '@/assets/svg/refresh.svg';
import Dumbell from '@/assets/svg/dumbbell.svg';
import TextInput from '@/components/textinput';
import {useTranslation} from 'react-i18next';

const {height} = Dimensions.get('screen');

interface CompleteExerciseProps {
  reff: any;
  onComplete: (wt: string, reps: string, sets: string) => void;
  isPending: boolean;
}

const CompleteExerciseSheet = ({
  reff,
  onComplete,
  isPending,
}: CompleteExerciseProps) => {
  const {t} = useTranslation();
  const [wt, setwt] = useState('');
  const [reps, setreps] = useState('');
  const [sets, setsets] = useState('');
  return (
    <RBSheet
      ref={reff}
      closeOnPressMask={true}
      height={0.45 * height}
      customStyles={{
        draggableIcon: {
          width: 0,
          height: 0,
        },
        container: styles.container,
      }}>
      <View>
        <TextInput
          placeholder={t('weight_lifted')}
          marginTop={false}
          leftIcon={<Dumbell />}
          onChangeText={setwt}
        />
        <TextInput
          placeholder={t('sets')}
          marginTop={false}
          leftIcon={<Candle />}
          onChangeText={setsets}
        />
        <TextInput
          placeholder={t('reps')}
          marginTop={false}
          leftIcon={<Repeat />}
          onChangeText={setreps}
        />
        <BaseButton
          label={t('complete_exercise')}
          disabled={isPending}
          isLoading={isPending}
          onPress={() => onComplete(wt, reps, sets)}
        />
      </View>
    </RBSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    borderTopStartRadius: 33,
    borderTopEndRadius: 33,
    paddingHorizontal: '5%',
    paddingBottom: '7%',
  },
});

export default CompleteExerciseSheet;
