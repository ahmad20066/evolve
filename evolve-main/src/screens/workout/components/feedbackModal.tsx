import BaseButton from '@/components/baseBtn';
import {Text, theme} from '@/components/theme';
import {showToast} from '@/components/toast';
import {useFeedback} from '@/hooks/useFeedback';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, TextInput, View} from 'react-native';
import Modal from 'react-native-modal';
import Frown from '@/assets/svg/frowning.svg';
import FrownDull from '@/assets/svg/frowning-dull.svg';
import Smile from '@/assets/svg/smiling.svg';
import SmileDull from '@/assets/svg/smiledull.svg';
import GrinningDull from '@/assets/svg/grinning-dull.svg';
import Grinning from '@/assets/svg/grinning.svg';
import NormalDull from '@/assets/svg/neutral-dull.svg';
import Normal from '@/assets/svg/neutral.svg';
import LaughDull from '@/assets/svg/laugh-dull.svg';
import Laugh from '@/assets/svg/laugh.svg';
import {globalStyles} from '@/styles/globalStyles';
import RNBounceable from '@freakycoder/react-native-bounceable';

interface feedbackProps {
  visible?: boolean;
  onBackToExerciseClicked: () => void;
  workout_id: number;
}

const FeedbackModal = ({
  visible,
  onBackToExerciseClicked,
  workout_id,
}: feedbackProps) => {
  const {t} = useTranslation();
  const [feedback, setfeedback] = useState('');
  const [rating, setrating] = useState(3);
  const {mutate, isPending} = useFeedback({
    onSuccess(data) {
      showToast('successToast', data.message, 'top');
      onBackToExerciseClicked();
    },
    onError(error: any) {
      showToast('errorToast', error.errors[0].message, 'top');
    },
  });
  return (
    <Modal
      isVisible={visible}
      animationIn={'slideInUp'}
      onBackdropPress={onBackToExerciseClicked}
      animationOut={'slideOutDown'}>
      <View style={styles.modalView}>
        <Text variant="poppins16black_medium">
          {t('share your feedback with your trainer')}
        </Text>
        <Text
          mt="s"
          variant="poppins12black_regular"
          color="gray"
          textAlign="left">
          {t('feedback_description')}
        </Text>
        <View style={[globalStyles.line2, styles.margin]}>
          <RNBounceable onPress={() => setrating(1)}>
            {rating == 1 ? <Frown /> : <FrownDull />}
          </RNBounceable>
          <RNBounceable onPress={() => setrating(2)}>
            {rating == 2 ? <Normal /> : <NormalDull />}
          </RNBounceable>
          <RNBounceable onPress={() => setrating(3)}>
            {rating == 3 ? <Smile /> : <SmileDull />}
          </RNBounceable>
          <RNBounceable onPress={() => setrating(4)}>
            {rating == 4 ? <Grinning /> : <GrinningDull />}
          </RNBounceable>
          <RNBounceable onPress={() => setrating(5)}>
            {rating == 5 ? <Laugh /> : <LaughDull />}
          </RNBounceable>
        </View>
        <TextInput
          textAlignVertical="top"
          multiline
          placeholderTextColor={theme.colors.gray}
          style={styles.input}
          placeholder={t('share_feedback')}
          onChangeText={setfeedback}
        />
        <BaseButton
          isLoading={isPending}
          disabled={isPending}
          label={t('send_feedback')}
          mt={20}
          onPress={() =>
            mutate({
              message: feedback,
              workout_id: workout_id,
              rating: rating,
            })
          }
        />
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  modalView: {
    backgroundColor: theme.colors.white,
    borderRadius: 24,
    padding: '5%',
    width: '100%',
  },
  input: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: theme.colors.black,
    height: 116,
    backgroundColor: theme.colors.input,
    borderRadius: 8,
    marginTop: '3%',
    padding: '5%',
  },
  margin: {marginVertical: '3%'},
});
export default FeedbackModal;
