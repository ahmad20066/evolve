import BaseButton from '@/components/baseBtn';
import TextInput from '@/components/textinput';
import {Text, theme} from '@/components/theme';
import {showToast} from '@/components/toast';
import {useSetWeight} from '@/hooks/useSetWeight';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View} from 'react-native';
import Modal from 'react-native-modal';

interface EditProps {
  visible?: boolean;
  onBackToProfileClicked: () => void;
  previousWt: number;
  refetch: () => void;
}
const EditModal = ({
  visible,
  onBackToProfileClicked,
  previousWt,
  refetch,
}: EditProps) => {
  const {t} = useTranslation();
  const [weight, setweight] = useState('');
  const {mutate, isPending} = useSetWeight({
    onSuccess(data) {
      showToast('successToast', data.message, 'top');
      refetch();
      onBackToProfileClicked();
    },
    onError(err: any) {
      showToast('errorToast', err.errors[0].message, 'top');
    },
  });
  return (
    <Modal
      isVisible={visible}
      animationIn={'slideInUp'}
      animationOut={'slideOutDown'}
      presentationStyle="overFullScreen"
      onBackdropPress={onBackToProfileClicked}>
      <View style={styles.modalView}>
        <Text textAlign="left" variant="poppins16black_medium">
          {t('edit_wt')}
        </Text>
        <Text
          textAlign="left"
          variant="poppins14black_regular"
          mt="m"
          mb="s"
          color="gray">
          {t('previous_wt')}
        </Text>
        <TextInput
          marginTop
          placeholder={'80 ' + t('kg')}
          editable={false}
          value={previousWt?.toString() + ' ' + t('kg')}
        />
        <Text
          textAlign="left"
          variant="poppins14black_regular"
          mt="m"
          mb="s"
          color="gray">
          {t('new_wt')}
        </Text>
        <TextInput
          marginTop
          placeholder={'80 ' + t('kg')}
          onChangeText={e => setweight(e)}
        />
        <BaseButton
          label={t('confirm_btn')}
          mb={0}
          mt={20}
          isLoading={isPending}
          disabled={isPending}
          onPress={() => mutate({weight: Number(weight)})}
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
});

export default EditModal;
