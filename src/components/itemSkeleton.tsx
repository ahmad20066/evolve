import {globalStyles} from '@/styles/globalStyles';
import {Skeleton} from '@rneui/base';
import React from 'react';
import {StyleSheet, View} from 'react-native';

const ItemSkeleton = () => {
  return (
    <View style={[globalStyles.shadow, globalStyles.line, styles.item]}>
      <Skeleton animation="pulse" height={90} width={112} style={styles.img} />
      <View style={styles.details}>
        <Skeleton
          animation="pulse"
          width={160}
          height={15}
          style={styles.text}
        />
        <Skeleton
          animation="pulse"
          width={80}
          height={15}
          style={styles.text}
        />
        <Skeleton
          animation="pulse"
          width={80}
          height={15}
          style={styles.text}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {marginTop: '5%', padding: '3%', borderRadius: 12},
  img: {borderRadius: 12},
  details: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginStart: '5%',
    height: 90,
  },
  text: {marginTop: '5%', borderRadius: 8},
});

export default ItemSkeleton;
