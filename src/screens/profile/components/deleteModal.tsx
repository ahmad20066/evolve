import {Text, theme} from '@/components/theme';
import {showToast} from '@/components/toast';
import {useDeleteAccount} from '@/hooks/useDeleteAccount';
import {removeAccessToken} from '@/store/slices/local';
import {globalStyles} from '@/styles/globalStyles';
import RNBounceable from '@freakycoder/react-native-bounceable';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import Modal from 'react-native-modal';
import {useDispatch} from 'react-redux';

interface deleteProps {
  visible?: boolean;
  onBackToProfileClicked: () => void;
}
const DeleteModal = ({visible, onBackToProfileClicked}: deleteProps) => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const {mutate, isPending} = useDeleteAccount({
    onSuccess(data) {
      showToast('successToast', data.message, 'top');
      dispatch(removeAccessToken());
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
        <Text textAlign="center" variant="poppins16black_medium">
          {t('delete_account')}
        </Text>
        <Text
          textAlign="left"
          variant="poppins14black_regular"
          marginVertical="m"
          color="gray">
          {t('delete_account_confirm')}
        </Text>
        <View style={globalStyles.line2}>
          <RNBounceable
            onPress={() => onBackToProfileClicked()}
            style={[
              styles.btn,
              {
                borderColor: theme.colors.apptheme,
                borderWidth: 1,
                marginRight: '5%',
              },
            ]}>
            <Text variant="poppins14black_regular" color="apptheme">
              {t('cancel')}
            </Text>
          </RNBounceable>
          <RNBounceable
            disabled={isPending}
            onPress={() => mutate({})}
            style={[styles.btn, {backgroundColor: theme.colors.error}]}>
            {isPending ? (
              <ActivityIndicator color={theme.colors.white} />
            ) : (
              <Text variant="poppins14black_regular" color="white">
                {t('yes')}
              </Text>
            )}
          </RNBounceable>
        </View>
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
  btn: {
    height: 48,
    borderRadius: 51,
    alignItems: 'center',
    justifyContent: 'center',
    width: '47%',
  },
});

export default DeleteModal;
