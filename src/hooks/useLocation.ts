import {useEffect, useState} from 'react';
import Geolocation from '@react-native-community/geolocation';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {Platform} from 'react-native';

interface Location {
  latitude: number | null;
  longitude: number | null;
}
const useLocation = () => {
  const [location, setLocation] = useState<Location>({
    latitude: null,
    longitude: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getLocation = async () => {
      try {
        if (Platform.OS === 'ios') {
          // your code using Geolocation and asking for authorisation with
          Geolocation.requestAuthorization();
        }
        const permissionStatus =
          Platform.OS === 'ios'
            ? await check(
                PERMISSIONS.IOS.LOCATION_ALWAYS ||
                  PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
              )
            : await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);

        if (permissionStatus === RESULTS.GRANTED) {
          Geolocation.getCurrentPosition(
            position => {
              const {latitude, longitude} = position.coords;
              setLocation({latitude, longitude});
              setLoading(false); // Set loading to false when location is obtained
            },
            error => {
              console.error(error);
              setLoading(false); // Set loading to false in case of an error
            },
            {
              enableHighAccuracy: false,
              timeout: 10000,
            },
          );
        } else {
          const result =
            Platform.OS === 'ios'
              ? await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
              : await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
          if (result === RESULTS.GRANTED) {
            getLocation();
          } else {
            setLoading(false); // Set loading to false if permission is not granted
          }
        }
      } catch (error) {
        console.error(error);
        setLoading(false); // Set loading to false in case of an unexpected error
      }
    };

    getLocation();
  }, []);

  return {location, loading};
};

export default useLocation;
