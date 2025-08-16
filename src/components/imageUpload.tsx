import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, View} from 'react-native';
const includeExtra = true;
import {
  CameraOptions,
  ImageLibraryOptions,
  launchImageLibrary,
} from 'react-native-image-picker';
import RNBounceable from '@freakycoder/react-native-bounceable';
import Plus from '@/assets/svg/plus.svg';
import {theme} from './theme';

interface Action {
  title: string;
  type: 'capture' | 'library';
  options: CameraOptions | ImageLibraryOptions;
}
const actions: Action[] = [
  {
    title: 'Upload Gallery Images ',
    type: 'library',
    options: {
      selectionLimit: 1,
      mediaType: 'photo',
      includeBase64: false,
      includeExtra,
      maxHeight: 200,
      maxWidth: 200,
    },
  },
];
interface uploadProps {
  onSelect: (t: string) => void;
  img?: string;
}

const ImageUpload = ({onSelect, img}: uploadProps) => {
  const [response, setResponse] = useState<any>(null);
  const onButtonPress = React.useCallback((type: any, options: any) => {
    launchImageLibrary(options, setResponse);
  }, []);

  useEffect(() => {
    onSelect(response?.assets && response?.assets);
  }, [response]);

  return (
    <>
      {actions.map(({title, type, options}) => {
        return (
          <RNBounceable key={title}>
            {response?.assets ? (
              response?.assets.map(({uri}: {uri: string}) => {
                return (
                  <View style={styles.imgborder} key={uri}>
                    <Image
                      resizeMode="cover"
                      resizeMethod="scale"
                      style={[styles.pic]}
                      source={{uri: uri}}
                    />
                  </View>
                );
              })
            ) : (
              <RNBounceable
                style={styles.plus}
                onPress={() => {
                  onButtonPress(type, options);
                }}>
                <Plus />
              </RNBounceable>
            )}
          </RNBounceable>
        );
      })}
    </>
  );
};

const styles = StyleSheet.create({
  imgborder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: theme.colors.apptheme,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  pic: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  plus: {justifyContent: 'center', height: 60, marginStart: 10},
});

export default ImageUpload;
