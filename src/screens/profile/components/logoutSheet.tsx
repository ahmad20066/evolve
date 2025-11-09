import {Text, theme} from '@/components/theme';
import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import RBSheet from 'react-native-raw-bottom-sheet';
import {useDispatch} from 'react-redux';
import Logout from '@/assets/svg/logout.svg';
import RNBounceable from '@freakycoder/react-native-bounceable';
import {globalStyles} from '@/styles/globalStyles';
import {removeAccessToken} from '@/store/slices/local';
import {useTranslation} from 'react-i18next';

const {height} = Dimensions.get('screen');

interface LogoutProps {
  reff: any;
}

const LogoutSheet = ({reff}: LogoutProps) => {
  const dispatch = useDispatch();
  const {t} = useTranslation();

  return (
    <RBSheet
      ref={reff}
      closeOnPressMask={true}
      height={0.35 * height}
      customStyles={{
        draggableIcon: {
          width: 0,
          height: 0,
        },
        container: styles.container,
      }}>
      <View style={styles.center}>
        <View style={styles.box1}>
          <View style={styles.box2}>
            <LinearGradient style={styles.box3} colors={['#E97956', '#EB440F']}>
              <Logout color={theme.colors.white} width={26} height={26} />
            </LinearGradient>
          </View>
        </View>
        <Text marginVertical="l" variant="poppins16black_medium">
          {t('logout_confirm')}
        </Text>
        <View style={globalStyles.line2}>
          <RNBounceable
            onPress={() => reff.current.close()}
            style={[
              styles.btn,
              {
                borderColor: theme.colors.apptheme,
                borderWidth: 1,
                marginRight: '5%',
              },
            ]}>
            <Text variant="poppins14black_regular" color="apptheme">
              {t('cancel')}
            </Text>
          </RNBounceable>
          <RNBounceable
            onPress={() => dispatch(removeAccessToken())}
            style={[styles.btn, {backgroundColor: theme.colors.apptheme}]}>
            <Text variant="poppins14black_regular" color="white">
              {t('yes')}
            </Text>
          </RNBounceable>
        </View>
      </View>
    </RBSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    borderTopStartRadius: 33,
    borderTopEndRadius: 33,
    paddingHorizontal: '5%',
    paddingVertical: '7%',
  },
  box1: {
    height: 92,
    width: 92,
    borderRadius: 46,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EB440F1F',
  },
  box2: {
    backgroundColor: '#EB440F66',
    height: 72,
    width: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  box3: {
    height: 48,
    width: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: {alignItems: 'center'},
  btn: {
    height: 48,
    borderRadius: 51,
    alignItems: 'center',
    justifyContent: 'center',
    width: '47%',
  },
});

export default LogoutSheet;
