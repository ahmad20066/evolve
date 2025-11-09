import {globalStyles} from '@/styles/globalStyles';
import React, {useCallback} from 'react';
import {FlatList, RefreshControl, StyleSheet, View} from 'react-native';
import Back from '@/assets/svg/arrow-left.svg';
import RoundButton from '@/components/roundButton';
import {Text, theme} from '@/components/theme';
import {useTranslation} from 'react-i18next';
import {AppNavigationProps} from '@/navigators/navigation';
import OrderItem from './components/orderItem';
import {useOrders} from '@/hooks/useOrders';

const Order = ({navigation}: AppNavigationProps<'Order'>) => {
  const {t} = useTranslation();
  const handleTrack = useCallback((id: number) => {
    navigation.navigate('OrderDetail', {id});
  }, []);
  const {data, refetch, isFetching} = useOrders();

  return (
    <View style={[globalStyles.container, styles.container]}>
      <View style={globalStyles.line2}>
        <RoundButton onPress={() => navigation.goBack()}>
          <Back color={theme.colors.black} />
        </RoundButton>
        <Text variant="poppins18black_semibold" me="s">
          {t('orders')}
        </Text>
        <View />
      </View>
      <FlatList
        data={data}
        renderItem={({item}) => (
          <OrderItem item={item} onItemClicked={handleTrack} />
        )}
        keyExtractor={item => item.id.toString()}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            tintColor={theme.colors.apptheme}
            refreshing={isFetching}
            onRefresh={refetch}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: '5%',
    paddingTop: '5%',
  },
});

export default Order;
