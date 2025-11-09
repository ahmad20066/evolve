import {globalStyles} from '@/styles/globalStyles';
import RNBounceable from '@freakycoder/react-native-bounceable';
import React, {memo} from 'react';
import {ImageBackground, StyleSheet, View} from 'react-native';
import Fire from '@/assets/svg/fire.svg';
import {Text, theme} from '@/components/theme';
import {IMealsofWeek} from '@/types/weakMeals';
import {useTranslation} from 'react-i18next';

interface planInterface {
  item: IMealsofWeek;
  meal?: boolean;
  selectItem?: number;
  setSelectItem: (id: number) => void;
}

const ChangeMealItem = ({item, selectItem, setSelectItem}: planInterface) => {
  const {i18n, t} = useTranslation();
  return (
    <RNBounceable
      style={[
        globalStyles.line,
        globalStyles.shadow,
        styles.item,
        selectItem == item.id && {
          borderColor: theme.colors.apptheme,
          borderWidth: 1.5,
        },
      ]}
      onPress={() => setSelectItem(item.id)}>
      <ImageBackground
        source={{uri: `${item.images[0]}`}}
        style={styles.img}
        imageStyle={styles.imgRadius}
      />
      <View style={styles.details}>
        <Text
          textAlign="left"
          variant="poppins12black_medium"
          numberOfLines={2}
          textTransform="capitalize">
          {i18n.language == 'ar' ? item.name_ar : item.name}
        </Text>
        <View style={globalStyles.line}>
          {item.calories && (
            <>
              <View style={globalStyles.line}>
                <Fire color={theme.colors.apptheme} />
                <Text ms="xs" variant="poppins12black_regular" color="gray">
                  {item.calories} {t('cal')}
                </Text>
              </View>
            </>
          )}
        </View>
      </View>
    </RNBounceable>
  );
};

const styles = StyleSheet.create({
  img: {width: 112, height: 90},
  imgRadius: {borderRadius: 8},
  details: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    marginStart: '5%',
    height: 90,
  },
  type: {
    borderRadius: 5,
    height: 20,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    paddingHorizontal: '3%',
    paddingVertical: '3.5%',
    borderRadius: 12,
    marginTop: '5%',
  },
  greyitem: {
    backgroundColor: theme.colors.lightGray,
    height: 22,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    marginRight: '3%',
  },
  edit: {
    backgroundColor: '#000000A1',
    alignSelf: 'flex-start',
    width: 28,
    height: 28,
    borderTopLeftRadius: 8,
    borderEndEndRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greyLine: {
    height: 15,
    width: 1,
    backgroundColor: theme.colors.gray,
    marginHorizontal: '5%',
  },
});

export default memo(ChangeMealItem);
