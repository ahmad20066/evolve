import React from 'react';
import {Image, SafeAreaView, StyleSheet, View} from 'react-native';
import Modal from 'react-native-modal';
import Back from '@/assets/svg/arrow-left.svg';
import Scan from '@/assets/svg/scanner.svg';
import RoundButton from '@/components/roundButton';
import {globalStyles} from '@/styles/globalStyles';
import {Text, theme} from '@/components/theme';
import BaseButton from '@/components/baseBtn';
import User from '@/assets/svg/frame.svg';
import Calendar from '@/assets/svg/calendar.svg';
import Card from '@/assets/svg/card.svg';
import Cvv from '@/assets/svg/cvv.svg';
import TextInput from '@/components/textinput';

interface addCardProps {
  visible?: boolean;
  onBackToDashboardClicked: () => void;
  refetch?: Function;
}

const AddNewCardModal = ({visible, onBackToDashboardClicked}: addCardProps) => {
  return (
    <Modal
      statusBarTranslucent={true}
      isVisible={visible}
      style={styles.modal}
      presentationStyle="overFullScreen">
      <SafeAreaView style={styles.modalContent}>
        <View style={styles.container}>
          <View style={globalStyles.line2}>
            <RoundButton onPress={onBackToDashboardClicked}>
              <Back color={theme.colors.black} />
            </RoundButton>
            <Text variant="poppins18black_semibold" me="s">
              Add New Card
            </Text>
            <Scan />
          </View>
          <Image
            source={require('@/assets/images/card.png')}
            style={styles.card}
          />
          <TextInput
            placeholder="Card holder name"
            leftIcon={<User />}
            //   onChangeText={handleChange('name')}
            //   onBlur={handleBlur('name')}
            //   error={errors.name}
            //   touched={touched.name}
          />
          <TextInput
            placeholder="Card number"
            leftIcon={<Card />}
            //   onChangeText={handleChange('name')}
            //   onBlur={handleBlur('name')}
            //   error={errors.name}
            //   touched={touched.name}
          />
          <TextInput
            placeholder="Expiry date"
            leftIcon={<Calendar />}
            keyboardType="number-pad"
            //   onChangeText={handleChange('phone_number')}
            //   onBlur={handleBlur('phone_number')}
            //   error={errors.phone_number}
            //   touched={touched.phone_number}
          />
          <TextInput
            placeholder="CVV"
            leftIcon={<Cvv />}
            keyboardType="number-pad"
            //   onChangeText={handleChange('phone_number')}
            //   onBlur={handleBlur('phone_number')}
            //   error={errors.phone_number}
            //   touched={touched.phone_number}
          />
        </View>
        <View style={[globalStyles.shadow, styles.padd]}>
          <BaseButton label="Continue" />
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0, // This is important to ensure the modal takes up the full screen
  },
  container: {padding: '5%'},
  modalContent: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
  padd: {paddingHorizontal: '5%', paddingVertical: '3%'},
  card: {
    marginTop: '5%',
  },
});

export default AddNewCardModal;
