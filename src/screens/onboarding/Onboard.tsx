import {theme} from '@/components/theme';
import {AppNavigationProps} from '@/navigators/navigation';
import React, {useRef, useState} from 'react';
import {Animated, FlatList, StyleSheet, View} from 'react-native';
import Pagination from '@/screens/onboarding/components/pagination';
import {useTranslation} from 'react-i18next';
import SlideItem from './components/slideItem';
import NextBtn from './components/nextBtn';

const Onboard = ({navigation}: AppNavigationProps<'Onboard'>) => {
  const {t} = useTranslation();
  const scrollX = useRef(new Animated.Value(0)).current;
  const [index, setIndex] = useState(0);
  const slidesref = useRef<FlatList>(null);

  const list = [
    {
      title: t(`onboard_label1`),
      key: 1,
      main_img: require('@/assets/images/onboard1.png'),
      subtitle: t('onboard_description1'),
    },
    {
      title: t(`onboard_label2`),
      key: 2,
      subtitle: t('onboard_description2'),
      main_img: require('@/assets/images/onboard2.png'),
    },
    {
      title: t(`onboard_label3`),
      key: 3,
      subtitle: t('onboard_description3'),
      main_img: require('@/assets/images/onboard3.png'),
    },
    {
      title: t(`onboard_label4`),
      key: 4,
      subtitle: t('onboard_description4'),
      main_img: require('@/assets/images/onboard4.png'),
    },
  ];

  const handleOnScroll = (event: any) => {
    Animated.event([{nativeEvent: {contentOffset: {x: scrollX}}}], {
      useNativeDriver: false,
    })(event);
  };
  const handleOnViewableItemsChanged = useRef(({viewableItems}: any) => {
    setIndex(viewableItems[0].index);
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const scrollTo = () => {
    if (index < list.length - 1) {
      slidesref.current?.scrollToIndex({index: index + 1});
    }
  };
  const scrollBack = () => {
    if (index > 0) {
      slidesref.current?.scrollToIndex({index: index - 1});
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <FlatList
          data={list}
          renderItem={({item}) => (
            <SlideItem
              item={item}
              scrollBack={scrollBack}
              index={index}
              nav={navigation}
              local
            />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToAlignment="center"
          pagingEnabled
          onScroll={handleOnScroll}
          onViewableItemsChanged={handleOnViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          ref={slidesref}
        />
      </View>
      <Pagination data={list} scrollX={scrollX} index={index} />
      <NextBtn
        scrollTo={scrollTo}
        index={index}
        percentage={(index + 1) * (100 / list.length)}
        nav={navigation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  top: {flex: 3},
});
export default Onboard;
