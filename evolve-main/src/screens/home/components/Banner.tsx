import {Skeleton} from '@rneui/base';
import React from 'react';
import {Dimensions, Image, StyleSheet, View} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

interface BannerProps {
  banner: string[];
  isLoading?: boolean;
  height: number;
  timer: number;
}

const {width} = Dimensions.get('window');

const RenderCarouselItem = ({
  height = 200,
  item,
}: {
  height: number;
  item: any;
  index?: number;
}) => {
  return <Image source={{uri: item}} style={[styles.img, {height: height}]} />;
};

const Banner = ({banner, isLoading, height, timer}: BannerProps) => {
  return (
    <View style={styles.container}>
      {isLoading ? (
        <Skeleton width={width - 40} height={height} style={styles.skeleton} />
      ) : (
        <Carousel
          loop
          snapEnabled={true}
          pagingEnabled={true}
          width={width}
          height={height}
          autoPlay={true}
          data={banner}
          autoPlayInterval={timer * 1000}
          // onSnapToItem={(index) => console.log("current index:", index)}
          renderItem={({item}) => RenderCarouselItem({height, item})}
          mode="parallax"
          modeConfig={{
            parallaxScrollingScale: 0.9,
            parallaxScrollingOffset: 50,
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {alignItems: 'center', marginBottom: '5%', marginTop: '2%'},
  img: {borderRadius: 24, width: width * 0.95},
  skeleton: {borderRadius: 24},
});
export default Banner;
