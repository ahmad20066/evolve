import React, {useState} from 'react';
import {FlatList, SafeAreaView, StyleSheet, View} from 'react-native';
import Back from '@/assets/svg/arrow-left.svg';
import {globalStyles} from '@/styles/globalStyles';
import RoundButton from '@/components/roundButton';
import {Text, theme} from '@/components/theme';
import {useWeekMeals} from '@/hooks/useWeekMeals';
import Modal from 'react-native-modal';
import ItemSkeleton from '@/components/itemSkeleton';
import ChangeMealsItem from './changeMealsItem';
import BaseButton from '@/components/baseBtn';
import RNBounceable from '@freakycoder/react-native-bounceable';
import Toast from 'react-native-toast-message';
import {toastConfig} from '@/components/toast';
import {useTranslation} from 'react-i18next';

interface mealsProps {
  visible: boolean;
  onBackToMealsClicked: () => void;
  onModalItemClicked: (id: number) => void;
  day: string;
  type?: number;
  onOpenMealClicked: (id: number) => void;
  isLoading: boolean;
}

const ChangeMealsModal = ({
  visible,
  onBackToMealsClicked,
  onModalItemClicked,
  day,
  type,
  onOpenMealClicked,
  isLoading,
}: mealsProps) => {
  const {t} = useTranslation();
  const [selectItem, setselectItem] = useState<number>(1);
  const {data, isPending} = useWeekMeals(day, type);
  const skeletonItems = Array.from({length: 3}, (_, index) => index);
  const handleModalItemClicked = React.useCallback((id?: number) => {
    onModalItemClicked(id!);
  }, []);

  return (
    <Modal
      isVisible={visible}
      animationIn={'fadeInRightBig'}
      animationOut={'fadeOutRightBig'}
      style={styles.modal}
      presentationStyle="overFullScreen">
      <SafeAreaView style={styles.modalContent}>
        <View style={styles.container}>
          <View style={[styles.top, styles.margin]}>
            <View style={globalStyles.line2}>
              <RoundButton onPress={onBackToMealsClicked}>
                <Back color={theme.colors.black} />
              </RoundButton>
              <Text variant="poppins18black_semibold" me="s">
                {t('change_meal')}
              </Text>
              <View />
            </View>
            <View>
              {isPending ? (
                skeletonItems.map((_, index) => <ItemSkeleton key={index} />)
              ) : data?.meals && data.meals.length > 0 ? (
                <FlatList
                  data={data?.meals}
                  keyExtractor={item => item.id.toString()}
                  renderItem={({item}) => (
                    <ChangeMealsItem
                      item={item}
                      selectItem={selectItem}
                      setSelectItem={setselectItem}
                    />
                  )}
                />
              ) : (
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingVertical: 20,
                  }}>
                  <Text variant="poppins14black_regular" color="softGray">
                    {t('no_meals')}
                  </Text>
                </View>
              )}
            </View>
          </View>
          <View style={styles.bottom}>
            <RNBounceable
              style={styles.open}
              onPress={() => {
                onOpenMealClicked(selectItem);
              }}>
              <Text variant="poppins12black_regular" color="cancel">
                {t('open') + ' ' + t('meal')}
              </Text>
            </RNBounceable>
            <BaseButton
              disabled={isLoading}
              isLoading={isLoading}
              label={t('change_btn1') + t('breakfast') + t('change_btn2')}
              onPress={() => {
                handleModalItemClicked(selectItem);
              }}
            />
          </View>
        </View>
      </SafeAreaView>
      <Toast config={toastConfig} />
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    flex: 1,
  },
  open: {
    height: 48,
    borderRadius: 37,
    borderColor: theme.colors.softGray,
    borderWidth: 1,
    backgroundColor: theme.colors.screen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  margin: {marginTop: '5%'},
  modal: {
    margin: 0, // This is important to ensure the modal takes up the full screen
  },
  modalContent: {
    flex: 1,
    backgroundColor: theme.colors.screen,
  },
  bottom: {
    backgroundColor: theme.colors.white,
    paddingHorizontal: '5%',
    paddingTop: '5%',
  },
  top: {paddingHorizontal: '5%'},
});

export default ChangeMealsModal;
