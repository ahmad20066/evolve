import {theme} from '@/components/theme';
import React from 'react';
import {Animated, Dimensions, StyleSheet, View} from 'react-native';

interface paginateProps {
  data:
    | {
        title?: string;
        key: number;
        subtitle?: string;
        main_img: HTMLImageElement | string;
      }[]
    | undefined;
  scrollX: Animated.Value;
  index: number;
}
const {width} = Dimensions.get('screen');

const Pagination = ({data, scrollX}: paginateProps) => {
  return (
    <View style={styles.container}>
      {data?.map((_: any, idx: number) => {
        const inputRange = [(idx - 1) * width, idx * width, (idx + 1) * width];
        const dotWidth = scrollX?.interpolate({
          inputRange,
          outputRange: [8, 34, 8],
          extrapolate: 'clamp',
        });
        const backgroundColor = scrollX?.interpolate({
          inputRange,
          outputRange: [
            theme.colors.softGray,
            theme.colors.lightGreen,
            theme.colors.softGray,
          ],
          extrapolate: 'clamp',
        });
        return (
          <Animated.View
            key={idx.toString()}
            style={[styles.dot, {width: dotWidth, backgroundColor}]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 0,
  },
  dot: {
    width: 8,
    height: 6,
    borderRadius: 4,
    marginHorizontal: 3,
  },
});

export default Pagination;
