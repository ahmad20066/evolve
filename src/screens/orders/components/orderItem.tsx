import {Text, theme} from '@/components/theme';
import {IOrders} from '@/hooks/useOrders';
import {globalStyles} from '@/styles/globalStyles';
import RNBounceable from '@freakycoder/react-native-bounceable';
import React, {memo} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View} from 'react-native';

interface OrderItemProps {
  item: IOrders;
  onTrack: (id: number) => void;
  onItemClicked: (id: number) => void;
}

const OrderItem = ({item, onTrack, onItemClicked}: OrderItemProps) => {
  const {t, i18n} = useTranslation();

  const statuscolor =
    item.status === 'out_for_delivery'
      ? theme.colors.lightGreen
      : item.status === 'listed'
      ? theme.colors.gray
      : theme.colors.cancel;
  return (
    <RNBounceable
      style={[globalStyles.shadow, styles.item]}
      onPress={() => onItemClicked(item.id)}>
      <View style={globalStyles.line2}>
        <Text variant="poppins16black_semibold">#{item.id}</Text>
        <View style={[styles.status, {backgroundColor: statuscolor}]}>
          <Text
            textTransform="capitalize"
            variant="poppins12black_regular"
            color="white">
            {item.status}
          </Text>
        </View>
      </View>
      <View style={[globalStyles.line, styles.margin]}>
        <Text variant="poppins14black_regular" color="gray">
          {item.order_date}
        </Text>
        <View style={styles.dot} />
        <Text variant="poppins14black_regular" color="gray">
          {i18n.language == 'ar'
            ? item.deliveryTime.title_ar
            : item.deliveryTime.title}
        </Text>
      </View>
      <View style={styles.margin}>
        {item.status === 'out_for_delivery' && (
          <RNBounceable style={styles.track}>
            <Text variant="poppins14black_regular" color="white">
              {t('track')}
            </Text>
          </RNBounceable>
        )}
      </View>
    </RNBounceable>
  );
};

const styles = StyleSheet.create({
  item: {padding: '5%', borderRadius: 20, marginTop: '5%'},
  status: {
    height: 26,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 37,
  },
  track: {
    backgroundColor: theme.colors.apptheme,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 37,
    height: 38,
  },
  dot: {
    width: 5,
    height: 5,
    backgroundColor: theme.colors.gray,
    marginHorizontal: '5%',
  },
  margin: {marginTop: '4%'},
});

export default memo(OrderItem);
