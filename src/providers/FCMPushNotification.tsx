import {useAppSelector} from '@/store';
import React, {FC, PropsWithChildren, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import messaging from '@react-native-firebase/messaging';
import {setFCMToken} from '@/store/slices/local';
import notifee, {AuthorizationStatus} from '@notifee/react-native';

export const FCMPushNotificationsProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const {fcm_token} = useAppSelector(state => state.local);
  const dispatch = useDispatch();

  const getToken = async () => {
    if (!fcm_token) {
      const fcmToken = await messaging().getToken();
      dispatch(setFCMToken(fcmToken));
    }
  };

  const checkPermission = async () => {
    const settings = await notifee.requestPermission();

    if (settings.authorizationStatus === AuthorizationStatus.DENIED) {
    } else if (
      settings.authorizationStatus === AuthorizationStatus.AUTHORIZED
    ) {
      getToken();
    } else if (
      settings.authorizationStatus === AuthorizationStatus.PROVISIONAL
    ) {
    }
  };

  useEffect(() => {
    checkPermission();
  }, []);

  return <>{children}</>;
};
