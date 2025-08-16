import {globalStyles} from '@/styles/globalStyles';
import React, {useEffect, useRef, useState} from 'react';
import {Dimensions, ScrollView, StyleSheet, View} from 'react-native';
import Back from '@/assets/svg/arrow-left.svg';
import RoundButton from '@/components/roundButton';
import {Text, theme} from '@/components/theme';
import {AppNavigationProps} from '@/navigators/navigation';
import RBSheet from 'react-native-raw-bottom-sheet';
import TextInput from '@/components/textinput';
import BaseButton from '@/components/baseBtn';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {useTranslation} from 'react-i18next';
import {useMapAddress} from '@/hooks/useMapAddress';
import useLocation from '@/hooks/useLocation';
import MapView, {Marker} from 'react-native-maps';

const {height} = Dimensions.get('screen');

const LoginSchema = Yup.object().shape({
  label: Yup.string().trim(),
  building: Yup.string().required('Building name is required').trim(),
  street: Yup.string().required('Street name is required').trim(),
  city: Yup.string().required('City name is required').trim(),
  state: Yup.string().required('State name is required').trim(),
  zip: Yup.string().required('Zip code is required').trim(),
  notes: Yup.string().trim(),
});

const Location = ({navigation, route}: AppNavigationProps<'Location'>) => {
  const reff = useRef<any>();
  const {t} = useTranslation();
  const {delivery_id, meal_plan_id} = route.params;
  const [region, setRegion] = useState({
    latitude: 21.5834,
    longitude: 39.167505,
  });
  const myApiKey = 'AIzaSyBkpxyIg1CgrHgmbpdmvr3aMh5n43Me_PQ';
  const {data} = useMapAddress(myApiKey, region.latitude, region.longitude);
  const {loading, location} = useLocation();

  useEffect(() => {
    // Open the RBSheet when the screen opens
    reff.current?.open();
  }, []);
  const {handleChange, handleBlur, handleSubmit, errors, touched} = useFormik({
    validationSchema: LoginSchema,
    initialValues: {
      label: '',
      building: '',
      street: '',
      city: '',
      state: '',
      zip: '',
      notes: '',
    },
    onSubmit: value => {
      reff.current.close();
      navigation.navigate('Payment', {
        meal_plan_id,
        delivery_id,
        address: {
          street: value.street,
          city: value.city,
          address_label: value.label,
          building: value.building,
          postal_code: value.zip,
          delivery_notes: value.notes,
          state: value.state,
        },
      });
    },
  });
  return (
    <View style={globalStyles.container}>
      {loading ? (
        <MapView
          showsUserLocation={true}
          onRegionChange={region => setRegion(region)}
          showsMyLocationButton={true}
          style={styles.maps}
          initialRegion={{
            latitude: location.latitude ?? 21.5834,
            longitude: location.longitude ?? 39.167505,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}>
          {/* <Marker draggable={true} coordinate={region} /> */}
        </MapView>
      ) : null}
      <View style={[globalStyles.line2, styles.head]}>
        <RoundButton onPress={() => navigation.goBack()}>
          <Back color={theme.colors.black} />
        </RoundButton>
        <Text variant="poppins18black_semibold" me="xxl">
          {t('location')}
        </Text>
        <View />
      </View>
      <RBSheet
        ref={reff}
        closeOnPressMask={true}
        height={0.75 * height}
        customStyles={{
          draggableIcon: {
            width: 0,
            height: 0,
          },
          container: styles.container,
        }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.margin}>
            <TextInput
              marginTop={true}
              placeholder={t('address')}
              onChangeText={handleChange('label')}
              onBlur={handleBlur('label')}
            />
          </View>
          <View style={styles.margin}>
            <TextInput
              marginTop={true}
              placeholder={t('building')}
              onChangeText={handleChange('building')}
              onBlur={handleBlur('building')}
              error={errors.building}
              touched={touched.building}
            />
          </View>
          <View style={styles.margin}>
            <TextInput
              marginTop={true}
              placeholder={t('street')}
              onChangeText={handleChange('street')}
              onBlur={handleBlur('street')}
              error={errors.street}
              touched={touched.street}
            />
          </View>
          <View style={styles.margin}>
            <TextInput
              marginTop={true}
              placeholder={t('city')}
              onChangeText={handleChange('city')}
              onBlur={handleBlur('city')}
              error={errors.city}
              touched={touched.city}
            />
          </View>
          <View style={styles.margin}>
            <TextInput
              marginTop={true}
              placeholder={t('state')}
              onChangeText={handleChange('state')}
              onBlur={handleBlur('state')}
              error={errors.state}
              touched={touched.state}
            />
          </View>
          <View style={styles.margin}>
            <TextInput
              marginTop={true}
              placeholder={t('postal_code')}
              onChangeText={handleChange('zip')}
              onBlur={handleBlur('zip')}
              error={errors.zip}
              touched={touched.zip}
            />
          </View>
          <View style={styles.margin}>
            <TextInput
              marginTop={true}
              placeholder={t('delivery_notes')}
              onChangeText={handleChange('notes')}
              onBlur={handleBlur('notes')}
            />
          </View>
          <BaseButton
            label={t('continue')}
            onPress={handleSubmit as () => void}
          />
        </ScrollView>
      </RBSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  padd: {paddingHorizontal: '5%', paddingVertical: '3%'},
  container: {
    backgroundColor: theme.colors.white,
    borderTopStartRadius: 33,
    borderTopEndRadius: 33,
    paddingHorizontal: '5%',
    paddingVertical: '7%',
  },
  margin: {marginTop: '3%'},
  maps: {width: '100%', height: height},
  head: {
    margin: '5%',
    position: 'absolute',
    top: 0,
    width: '100%',
  },
});

export default Location;
