import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import Clock from '@/assets/svg/clock.svg';
import Fire from '@/assets/svg/fire.svg';
import {Text, theme} from '@/components/theme';
import {globalStyles} from '@/styles/globalStyles';
import RNBounceable from '@freakycoder/react-native-bounceable';

interface exploreprops {
  title: string;
  image: string;
  cal: number;
  type?: string;
  time?: string;
  onPress: () => void;
}

const ExploreItem = ({
  title,
  image,
  cal,
  type,
  time,
  onPress,
}: exploreprops) => {
  return (
    <RNBounceable style={styles.container} {...{onPress}}>
      <Image source={{uri: `${image}`}} style={styles.img} />
      <Text
        marginVertical="m"
        textAlign="left"
        variant="poppins14black_semibold"
        numberOfLines={1}>
        {title}
      </Text>

      <View style={globalStyles.line}>
        <Fire color={theme.colors.apptheme} />
        <Text ms="s" variant="poppins12black_regular" color="gray">
          {cal} cal
        </Text>
        <View />
        {time && (
          <>
            <View style={styles.line} />
            <Clock color={theme.colors.apptheme} />
            <Text ms="s" variant="poppins12black_regular" color="gray">
              {time} min
            </Text>
          </>
        )}
      </View>
      {type && (
        <Text
          variant="poppins12black_regular"
          fontSize={10}
          numberOfLines={1}
          textTransform="capitalize"
          color="gray">
          {type}
        </Text>
      )}
    </RNBounceable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 184,
    borderRadius: 12,
    shadowColor: '#0000001A',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.8,
    shadowRadius: 10,
    backgroundColor: theme.colors.white,
    elevation: 5,
    justifyContent: 'space-between',
    padding: 10,
    flexDirection: 'column',
    marginLeft: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  img: {width: 164, height: 106, borderRadius: 8, alignSelf: 'center'},
  line: {
    backgroundColor: theme.colors.gray,
    height: 10,
    width: 1,
    marginHorizontal: '5%',
  },
});

export default ExploreItem;
