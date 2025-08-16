import {Text, theme} from '@/components/theme';
import {globalStyles} from '@/styles/globalStyles';
import React, {useCallback, useRef, useState} from 'react';
import {
  I18nManager,
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  View,
} from 'react-native';
import User from '@/assets/svg/profile.svg';
import Bell from '@/assets/svg/notification-bing.svg';
import Right from '@/assets/svg/right.svg';
import Sub from '@/assets/svg/wallet.svg';
import Privacy from '@/assets/svg/tick-square.svg';
import Faq from '@/assets/svg/message.svg';
import Setting from '@/assets/svg/setting.svg';
import Order from '@/assets/svg/bag.svg';
import Logout from '@/assets/svg/logout.svg';
import RNBounceable from '@freakycoder/react-native-bounceable';
import {AppNavigationProps} from '@/navigators/navigation';
import EditModal from './components/editModal';
import LogoutSheet from './components/logoutSheet';
import {useGetProfile} from '@/hooks/useGetProfile';
import {useCurrentSubs} from '@/hooks/useCurrentSubs';
import PersonalDataModal from './components/personalDataModal';
import {useTranslation} from 'react-i18next';
import RNRestart from 'react-native-restart';
import {useAppSelector} from '@/store';
import DeleteModal from './components/deleteModal';

const Profile = ({navigation}: AppNavigationProps<'Profile'>) => {
  const {t, i18n} = useTranslation();
  const [isEnabled, setIsEnabled] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [deleteVisible, setdeleteVisible] = useState(false);
  const [personalVisible, setpersonalVisible] = useState(false);
  const logoutreff = useRef<any>();
  const {language} = useAppSelector(state => state.local);

  const handleBackToProfileClicked = React.useCallback(() => {
    setModalVisible(false);
    setpersonalVisible(false);
  }, []);

  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const languageSwitch = useCallback(() => {
    const newLanguage = i18n.language === 'ar' ? 'en' : 'ar';

    i18n
      .changeLanguage(newLanguage)
      .then(() => {
        const shouldBeRTL = newLanguage === 'ar';

        if (I18nManager.isRTL !== shouldBeRTL) {
          I18nManager.forceRTL(shouldBeRTL);
          RNRestart.restart();
        }
      })
      .catch(err => {
        console.log('something went wrong while applying RTL');
      });
  }, []);
  const {data, refetch} = useGetProfile();
  const {data: currentPlan} = useCurrentSubs();
  const totalCount = currentPlan
    ? Object.values(currentPlan || {}).filter(
        value => typeof value === 'object' && value !== null,
      ).length
    : 0;

  return (
    <ScrollView style={[globalStyles.container, styles.container]}>
      <View style={[globalStyles.line, {marginLeft: '5%'}]}>
        <Image
          source={require('@/assets/images/male.png')}
          style={styles.user}
        />
        <View>
          <Text
            textAlign="left"
            variant="poppins14black_semibold"
            textTransform="capitalize">
            {data?.name}
          </Text>
          {currentPlan != null && (
            <Text mt="s" variant="poppins12black_regular" color="gray">
              {i18n.language == 'ar'
                ? currentPlan?.dietSubscription?.meal_plan.title_ar
                : currentPlan?.dietSubscription?.meal_plan.title}{' '}
              {totalCount === 2 && '|'}{' '}
              {i18n.language == 'ar'
                ? currentPlan?.fitnessSubscription?.package.name_ar
                : currentPlan?.fitnessSubscription?.package.name}
            </Text>
          )}
        </View>
      </View>
      <View style={[globalStyles.line2, styles.margin]}>
        <RNBounceable style={[styles.details, globalStyles.shadow]}>
          <Text variant="poppins14black_medium" color="apptheme">
            {data?.height} {t('cm')}
          </Text>
          <Text variant="poppins12black_regular" color="gray" mt="xs">
            {t('height')}
          </Text>
        </RNBounceable>
        <RNBounceable
          style={[styles.details, globalStyles.shadow]}
          onPress={() => setModalVisible(true)}>
          <Text variant="poppins14black_medium" color="apptheme">
            {data?.weight} {t('kg')}
          </Text>
          <Text variant="poppins12black_regular" color="gray" mt="xs">
            {t('weight')}
          </Text>
        </RNBounceable>
        <RNBounceable style={[styles.details, globalStyles.shadow]}>
          <Text variant="poppins14black_medium" color="apptheme">
            {data?.age}
          </Text>
          <Text variant="poppins12black_regular" color="gray" mt="xs">
            {t('age')}
          </Text>
        </RNBounceable>
      </View>
      <View style={styles.box}>
        <Text
          textAlign="left"
          variant="poppins16black_semibold"
          textTransform="capitalize">
          {t('account')}
        </Text>
        <RNBounceable
          style={[globalStyles.line2, styles.item]}
          onPress={() => navigation.navigate('Order')}>
          <View style={globalStyles.line}>
            <Order />
            <Text ms="s" variant="poppins12black_regular" color="gray">
              {t('orders')}
            </Text>
          </View>
          <Right color={theme.colors.black} />
        </RNBounceable>
        <RNBounceable
          style={[globalStyles.line2, styles.item]}
          onPress={() => setpersonalVisible(true)}>
          <View style={globalStyles.line}>
            <User color={theme.colors.apptheme} width={18} height={18} />
            <Text ms="s" variant="poppins12black_regular" color="gray">
              {t('personal_data')}
            </Text>
          </View>
          <Right color={theme.colors.black} />
        </RNBounceable>
        <RNBounceable
          style={[globalStyles.line2, styles.item]}
          onPress={() => navigation.navigate('Subscription')}>
          <View style={globalStyles.line}>
            <Sub />
            <Text ms="s" variant="poppins12black_regular" color="gray">
              {t('subscription')}
            </Text>
          </View>
          <Right color={theme.colors.black} />
        </RNBounceable>
      </View>
      <View style={styles.box}>
        <Text textAlign="left" variant="poppins16black_semibold">
          {t('notification')}
        </Text>
        <RNBounceable style={[globalStyles.line2, styles.item]}>
          <View style={globalStyles.line}>
            <Bell color={theme.colors.apptheme} width={18} height={18} />
            <Text ms="s" variant="poppins12black_regular" color="gray">
              {t('pop_up_noti')}
            </Text>
          </View>
          <Switch
            trackColor={{
              false: theme.colors.input,
              true: theme.colors.lighyellow,
            }}
            thumbColor={theme.colors.white}
            ios_backgroundColor={theme.colors.input}
            onValueChange={toggleSwitch}
            value={isEnabled}
            style={styles.switch}
          />
        </RNBounceable>
      </View>
      <View style={styles.box}>
        <Text variant="poppins16black_semibold" textAlign="left">
          {t('other')}
        </Text>
        <RNBounceable style={[globalStyles.line2, styles.item]}>
          <View style={globalStyles.line}>
            <Bell color={theme.colors.apptheme} width={18} height={18} />
            <Text ms="s" variant="poppins12black_regular" color="gray">
              Language
            </Text>
          </View>
          <Switch
            trackColor={{
              false: theme.colors.input,
              true: theme.colors.lighyellow,
            }}
            thumbColor={theme.colors.white}
            ios_backgroundColor={theme.colors.input}
            onValueChange={languageSwitch}
            value={language}
            style={styles.switch}
          />
        </RNBounceable>
        <RNBounceable
          style={[globalStyles.line2, styles.item]}
          onPress={() => navigation.navigate('Faq')}>
          <View style={globalStyles.line}>
            <Faq />
            <Text ms="s" variant="poppins12black_regular" color="gray">
              {t('faq')}
            </Text>
          </View>
          <Right color={theme.colors.black} />
        </RNBounceable>
        <RNBounceable
          style={[globalStyles.line2, styles.item]}
          onPress={() => navigation.navigate('TermsnPolicy', {policy: true})}>
          <View style={globalStyles.line}>
            <Privacy color={theme.colors.apptheme} width={18} height={18} />
            <Text ms="s" variant="poppins12black_regular" color="gray">
              {t('privacy_policy')}
            </Text>
          </View>
          <Right color={theme.colors.black} />
        </RNBounceable>
        <RNBounceable
          style={[globalStyles.line2, styles.item]}
          onPress={() => navigation.navigate('TermsnPolicy', {policy: false})}>
          <View style={globalStyles.line}>
            <Setting />
            <Text ms="s" variant="poppins12black_regular" color="gray">
              {t('terms')}
            </Text>
          </View>
          <Right color={theme.colors.black} />
        </RNBounceable>
        <RNBounceable
          style={[globalStyles.line2, styles.item]}
          onPress={() => logoutreff.current.open()}>
          <View style={globalStyles.line}>
            <Logout color={theme.colors.apptheme} />
            <Text ms="s" variant="poppins12black_regular" color="gray">
              {t('logout')}
            </Text>
          </View>
        </RNBounceable>
        <RNBounceable
          style={[globalStyles.line2, styles.item]}
          onPress={() => setdeleteVisible(true)}>
          <View style={globalStyles.line}>
            <Logout color={theme.colors.error} />
            <Text ms="s" variant="poppins12black_regular" color="error">
              {t('delete_account')}
            </Text>
          </View>
        </RNBounceable>
      </View>
      <EditModal
        visible={isModalVisible}
        onBackToProfileClicked={handleBackToProfileClicked}
        previousWt={data?.weight!}
        refetch={refetch}
      />
      <PersonalDataModal
        visible={personalVisible}
        onBackToProfileClicked={handleBackToProfileClicked}
        refetch={refetch}
      />
      <LogoutSheet reff={logoutreff} />
      <DeleteModal
        visible={deleteVisible}
        onBackToProfileClicked={() => setdeleteVisible(false)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {paddingVertical: '4%'},
  user: {width: 55, height: 55, borderRadius: 28, marginRight: '3%'},
  details: {
    height: 65,
    width: 101,
    borderRadius: 12,
    paddingHorizontal: '5%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  switch: {transform: [{scaleX: 0.6}, {scaleY: 0.6}]},
  margin: {margin: '5%'},
  box: {
    shadowColor: '#0000001A',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.8,
    shadowRadius: 10,
    backgroundColor: theme.colors.white,
    elevation: 5,
    padding: '5%',
    borderRadius: 12,
    marginTop: '5%',
    marginHorizontal: '5%',
  },
  item: {marginTop: '5%'},
});

export default Profile;
