import {theme} from '@/components/theme';
import {Skeleton} from '@rneui/themed';
import React from 'react';
import {StyleSheet, View} from 'react-native';

const SkeletonItem = () => {
  return (
    <View style={styles.item}>
      <Skeleton animation="pulse" width={164} height={106} style={styles.img} />
      <Skeleton animation="pulse" width={80} height={15} style={styles.text} />
      <Skeleton animation="pulse" width={60} height={15} style={styles.text} />
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    width: 184,
    borderRadius: 12,
    justifyContent: 'space-between',
    padding: 10,
    flexDirection: 'column',
    marginLeft: 20,
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: theme.colors.white,
  },
  img: {borderRadius: 8},
  text: {marginTop: '5%', borderRadius: 8},
});

export default SkeletonItem;
