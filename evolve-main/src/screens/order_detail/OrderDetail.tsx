import React from 'react';
import {FlatList, ScrollView, StyleSheet, View} from 'react-native';
import Back from '@/assets/svg/arrow-left.svg';
import {globalStyles} from '@/styles/globalStyles';
import RoundButton from '@/components/roundButton';
import {Text, theme} from '@/components/theme';
import {useTranslation} from 'react-i18next';
import {AppNavigationProps} from '@/navigators/navigation';
import LinearGradient from 'react-native-linear-gradient';
import Location from '@/assets/svg/location.svg';
import Clock from '@/assets/svg/clock.svg';
import RNBounceable from '@freakycoder/react-native-bounceable';
import Right from '@/assets/svg/right.svg';
import {useOrdersbyID} from '@/hooks/useOrderbyID';
import MealsItem from '../menu/components/MealsItem';

const OrderDetail = ({
  navigation,
  route,
}: AppNavigationProps<'OrderDetail'>) => {
  const {t, i18n} = useTranslation();
  const {id} = route.params;
  const {data} = useOrdersbyID(id);
  return (
    <View style={[globalStyles.container, styles.container]}>
      <View style={globalStyles.line2}>
        <RoundButton onPress={() => navigation.goBack()}>
          <Back color={theme.colors.black} />
        </RoundButton>
        <Text variant="poppins18black_semibold" me="s">
          {t('orders')} : {id}
        </Text>
        <View />
      </View>
      <ScrollView>
        <View style={[globalStyles.shadow, styles.box]}>
          <Text textAlign="left" variant="poppins16black_semibold">
            {t('add_time')}
          </Text>
          <View style={styles.greyLine} />
          <RNBounceable style={globalStyles.line2}>
            <View style={globalStyles.line}>
              <View style={styles.box2}>
                <LinearGradient
                  style={styles.box3}
                  colors={['#FCC6B5', '#FF5F2D']}>
                  <Location color={theme.colors.white} width={20} height={20} />
                </LinearGradient>
              </View>
              <View>
                <Text textAlign="left" variant="poppins14black_semibold">
                  {data?.subscription.address.address_label}
                </Text>
                <Text
                  textAlign="left"
                  variant="poppins12black_regular"
                  numberOfLines={2}>
                  {data?.subscription.address.street},{' '}
                  {data?.subscription.address.city}
                </Text>
              </View>
            </View>
            <Right color={theme.colors.darkGray} />
          </RNBounceable>
          <View style={styles.greyLine} />
          <View style={globalStyles.line}>
            <View style={styles.box2}>
              <LinearGradient
                style={styles.box3}
                colors={['#FCC6B5', '#FF5F2D']}>
                <Clock color={theme.colors.white} width={20} height={20} />
              </LinearGradient>
            </View>
            <View>
              <Text textAlign="left" variant="poppins14black_semibold">
                Time
              </Text>
              <Text variant="poppins12black_regular">
                {i18n.language == 'ar'
                  ? data?.subscription.delivery_time.title_ar
                  : data?.subscription.delivery_time.title}
              </Text>
            </View>
          </View>
        </View>
        <FlatList
          data={data?.meals}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => <MealsItem item={item} />}
        />
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: '5%',
    paddingTop: '5%',
  },
  box: {padding: '5%', borderRadius: 12, marginVertical: '5%'},
  box2: {
    backgroundColor: '#FDC0AE',
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  box3: {
    height: 32,
    width: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  greyLine: {
    backgroundColor: theme.colors.lightGray,
    height: 1,
    marginVertical: '4%',
  },
});

export default OrderDetail;
