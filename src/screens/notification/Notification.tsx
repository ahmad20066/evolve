import {globalStyles} from '@/styles/globalStyles';
import React from 'react';
import {SectionList, StyleSheet, View} from 'react-native';
import Back from '@/assets/svg/arrow-left.svg';
import {Text, theme} from '@/components/theme';
import NotificationItem from './components/NotificationItem';
import RoundButton from '@/components/roundButton';
import {AppNavigationProps} from '@/navigators/navigation';
import {INotification, useNotification} from '@/hooks/useNotification';
import {calculateTime} from '@/utils/formatTime';
import {useTranslation} from 'react-i18next';

const Notification = ({navigation}: AppNavigationProps<'Notification'>) => {
  const {t} = useTranslation('');
  const transformNotifications = (noti: INotification[]) => {
    if (!Array.isArray(noti)) return [];
    const grouped = noti?.reduce((acc, item) => {
      const dateKey = calculateTime(item.createdAt);
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(item); // Keep the original object
      return acc;
    }, {} as Record<string, typeof noti>);

    return Object.entries(grouped).map(([date, data]) => ({
      header: `Today, ${date}`, // Adjust if needed
      data,
    }));
  };
  const {data} = useNotification();
  const formattedNoti = transformNotifications(data!);

  const renderHeader = ({section}: {section: any}) => (
    <View style={globalStyles.line}>
      {section?.header && (
        <Text
          marginVertical="m"
          variant="poppins12black_regular"
          color="mediumGray">
          {calculateTime(section?.createdAt)}
        </Text>
      )}
      <View style={styles.line} />
    </View>
  );
  return (
    <View style={[globalStyles.container, styles.container]}>
      <View style={globalStyles.line2}>
        <RoundButton onPress={() => navigation.goBack()}>
          <Back color={theme.colors.black} />
        </RoundButton>
        <Text variant="poppins18black_semibold" me="s">
          {t('notification')}
        </Text>
        <View />
      </View>
      <SectionList
        sections={formattedNoti}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => <NotificationItem item={item} />}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={renderHeader}
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: '5%',
  },
  line: {
    backgroundColor: theme.colors.softGray,
    height: 1,
    width: '90%',
    marginLeft: '5%',
  },
  list: {marginTop: '3%'},
});

export default Notification;
