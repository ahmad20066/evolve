import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack';
import React, { Fragment, JSX } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from '@shopify/restyle';
import Toast from 'react-native-toast-message';
import { StatusBar, StyleSheet } from 'react-native';
import { theme } from '@/components/theme';
import { toastConfig } from '@/components/toast';
import { AppRoutes } from './navigation';
import Login from '@/screens/login';
import Signup from '@/screens/signup';
import Gender from '@/screens/gender';
import Age from '@/screens/age';
import Weight from '@/screens/weight';
import Height from '@/screens/height';
import Sport from '@/screens/sport';
import About from '@/screens/about';
import Success from '@/screens/success';
import VerifyIdentity from '@/screens/verify_identity';
import MainTab from './mainTab';
import Notification from '@/screens/notification';
import Subscription from '@/screens/subscription';
import Menu from '@/screens/menu';
import DeliveryTime from '@/screens/delivery_time';
import Payment from '@/screens/payment';
import Dish from '@/screens/dish';
import Exercise from '@/screens/exercise';
import Info from '@/screens/personalized_info';
import Info2 from '@/screens/personalized_info2';
import Info3 from '@/screens/personalized_info3';
import { useAppSelector } from '@/store';
import Exercises from '@/screens/exercises';
import Location from '@/screens/location';
import Workout from '@/screens/workout';
import Leaderboard from '@/screens/leaderboard';
import VerificationOtp from '@/screens/verfication_otp';
import Onboard from '@/screens/onboarding';
import SuccessHome from '@/screens/success_home';
import ResetPassword from '@/screens/reset_password';
import TermsnPolicy from '@/screens/other_info';
import Faq from '@/screens/faq';
import Order from '@/screens/orders';
import OrderDetail from '@/screens/order_detail';
import Chat from '@/screens/chat';
import { SafeAreaView } from 'react-native-safe-area-context';

const Stack = createStackNavigator<AppRoutes>();
const LoginScreens = [
  { Onboard },
  { Login },
  { Signup },
  { Gender },
  { Age },
  { Weight },
  { Height },
  { Sport },
  { About },
  { Success },
  { VerifyIdentity },
  { VerificationOtp },
  { ResetPassword },
];
const Screens = [
  { MainTab },
  { Notification },
  { Subscription },
  { Menu },
  { DeliveryTime },
  { Payment },
  { Dish },
  { Exercise },
  { Exercises },
  { Info },
  { Info2 },
  { Info3 },
  { Location },
  { Workout },
  { Leaderboard },
  { SuccessHome },
  { TermsnPolicy },
  { Faq },
  { Order },
  { OrderDetail },
  { Chat },
];

type TScreens = keyof (typeof Screens)[0];
type LoginScreen = keyof (typeof LoginScreens)[0];

const ApplicationNavigator = () => {
  const { access_token } = useAppSelector(state => state.local);
  return (
    <NavigationContainer>
      <ThemeProvider {...{ theme }}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            ...TransitionPresets.SlideFromRightIOS,
            gestureEnabled: true,
          }}
        >
          {!!access_token
            ? Screens.map(item => {
                const [name, Component] = Object.entries(item)[0] as [
                  TScreens,
                  () => JSX.Element, // TypeScript type for components
                ];

                // Define ScreenComponent to handle conditional SafeAreaView wrapping
                const ScreenComponent = (props: any) => {
                  return name === 'Dish' || name === 'Exercise' ? (
                    <Component {...props} />
                  ) : (
                    <SafeAreaView
                      style={styles.container}
                      edges={['top', 'bottom']}
                    >
                      <StatusBar animated={true} barStyle={'dark-content'} />
                      <Component {...props} />
                    </SafeAreaView>
                  );
                };

                return (
                  <Stack.Screen
                    key={name}
                    name={name}
                    component={ScreenComponent}
                    options={{
                      gestureEnabled: name != 'SuccessHome', // Disable gestures for 'Exercise' screen
                    }}
                  />
                );
              })
            : LoginScreens.map(item => {
                const [name, Component] = Object.entries(item)[0] as [
                  LoginScreen,
                  () => JSX.Element, // TypeScript type for components
                ];

                // Define ScreenComponent to handle conditional SafeAreaView wrapping
                const ScreenComponent = (props: any) => {
                  return name === 'Onboard' ? (
                    <Component {...props} />
                  ) : (
                    <SafeAreaView
                      style={styles.container}
                      edges={['top', 'bottom']}
                    >
                      <StatusBar animated={true} barStyle={'dark-content'} />
                      <Component {...props} />
                    </SafeAreaView>
                  );
                };

                return (
                  <Stack.Screen
                    key={name}
                    name={name}
                    component={ScreenComponent}
                  />
                );
              })}
        </Stack.Navigator>
        <Toast bottomOffset={5} config={toastConfig} />
      </ThemeProvider>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  topSafe: { flex: 0, backgroundColor: theme.colors.screen },
});

export default ApplicationNavigator;
