import React, {useEffect, useState} from 'react';
import {ImageBackground, SafeAreaView, StyleSheet, View} from 'react-native';
import Modal from 'react-native-modal';
import Back from '@/assets/svg/arrow-left.svg';
import Bottle from '@/assets/svg/bottle.svg';
import Breathe from '@/assets/svg/breathe.svg';
import RNBounceable from '@freakycoder/react-native-bounceable';
import {Text, theme} from '@/components/theme';
import {globalStyles} from '@/styles/globalStyles';
import {useTranslation} from 'react-i18next';

interface coolingProps {
  visible?: boolean;
  onBackToWorkoutClicked: () => void;
  time: number;
}
const CoolingModal = ({
  visible,
  onBackToWorkoutClicked,
  time,
}: coolingProps) => {
  const {t} = useTranslation();
  const [seconds, setSeconds] = useState(time);
  const [progress, setProgress] = useState(100); // Percentage for circular progress

  useEffect(() => {
    if (isNaN(time) || time <= 0) return; // Handle NaN case
    setSeconds(time); // Reset seconds whenever time changes
    setProgress(100);
    const interval = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimeout(onBackToWorkoutClicked, 0); // ✅ Schedule state update outside render phase
          return 0;
        }
        return prev - 1;
      });

      setProgress(prev => Math.max(prev - 100 / time, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [time, onBackToWorkoutClicked]);
  return (
    <Modal
      statusBarTranslucent={true}
      isVisible={visible}
      animationIn={'slideInUp'}
      animationOut={'slideOutDown'}
      style={styles.modal}
      presentationStyle="overFullScreen">
      <ImageBackground
        source={require('@/assets/images/cool.png')}
        style={styles.modalContent}>
        <SafeAreaView style={styles.container}>
          <RNBounceable style={styles.back} onPress={onBackToWorkoutClicked}>
            <Back color={theme.colors.white} />
          </RNBounceable>
          <View>
            <View style={[globalStyles.line, styles.label]}>
              <Text mr="m" variant="poppins16black_semibold" color="white">
                {t('breathe')}
              </Text>
              <Breathe />
              <Text
                marginHorizontal="s"
                variant="poppins16black_semibold"
                color="white">
                &{'  '}
                {t('drink')}
              </Text>
              <Bottle />
            </View>
            <View style={styles.circle}>
              <View
                style={[
                  styles.progressCircle,
                  {
                    transform: [{rotate: `${(360 * progress) / 100}deg`}],
                  },
                ]}
              />
              <Text
                variant="poppins32black_medium"
                color="white"
                fontSize={40}
                lineHeight={44}>
                {seconds}
              </Text>
            </View>
          </View>
          <View />
        </SafeAreaView>
      </ImageBackground>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0, // This is important to ensure the modal takes up the full screen
  },
  container: {
    padding: '5%',
    flexDirection: 'column',
    justifyContent: 'space-between',
    flex: 1,
  },
  back: {marginStart: '5%'},
  circle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 15,
    borderColor: '#fff',
    position: 'relative',
    overflow: 'hidden',
    alignSelf: 'center',
    marginTop: '5%',
  },
  progressCircle: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 10,
    borderColor: theme.colors.apptheme,
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  modalContent: {
    flex: 1,
    height: '100%',
  },
  label: {alignSelf: 'center'},
});

export default CoolingModal;
