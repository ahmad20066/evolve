import React, { useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
const includeExtra = true;
import {
  CameraOptions,
  ImageLibraryOptions,
  launchImageLibrary,
} from "react-native-image-picker";
import RNBounceable from "@freakycoder/react-native-bounceable";
import Plus from "@/assets/svg/plus.svg";
import { theme } from "./theme";

interface Action {
  title: string;
  type: "capture" | "library";
  options: CameraOptions | ImageLibraryOptions;
}
const actions: Action[] = [
  {
    title: "Upload Gallery Images ",
    type: "library",
    options: {
      selectionLimit: 1,
      mediaType: "photo",
      includeBase64: false,
      includeExtra,
      quality: 1,
      assetRepresentationMode: "current",
    },
  },
];
interface ImageFile {
  uri: string;
  name: string;
  type: string;
  width?: number;
  height?: number;
  fileSize?: number;
  base64?: string;
}

interface uploadProps {
  onSelect: (file: ImageFile) => void;
  img?: string;
}

const ImageUpload = ({ onSelect, img }: uploadProps) => {
  const [response, setResponse] = useState<any>(null);
  const onButtonPress = React.useCallback((type: any, options: any) => {
    launchImageLibrary(options, setResponse);
  }, []);

  useEffect(() => {
    if (response?.assets && response.assets.length > 0) {
      const a = response.assets[0];
      // Build a file object suitable for FormData append on the caller side
      const file: ImageFile = {
        uri: a.uri || "",
        name: a.fileName || "image.jpg",
        type: a.type || "image/jpeg",
        width: a.width,
        height: a.height,
        fileSize: a.fileSize,
        base64: a.base64,
      };
      onSelect(file);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  return (
    <>
      {actions.map(({ title, type, options }) => {
        return (
          <RNBounceable key={title}>
            {response?.assets ? (
              response?.assets.map(({ uri }: { uri: string }) => {
                return (
                  <View style={styles.imgborder} key={uri}>
                    <Image
                      resizeMode="cover"
                      resizeMethod="scale"
                      style={[styles.pic]}
                      source={{ uri: uri }}
                    />
                  </View>
                );
              })
            ) : (
              <RNBounceable
                style={styles.plus}
                onPress={() => {
                  onButtonPress(type, options);
                }}
              >
                {img ? (
                  <View style={styles.imgborder}>
                    <Image
                      resizeMode="cover"
                      resizeMethod="scale"
                      style={[styles.pic]}
                      source={{ uri: img }}
                    />
                  </View>
                ) : (
                  <Image
                    style={styles.img}
                    source={require("@/assets/images/user.png")}
                  />
                )}
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
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  img: { alignSelf: "center", marginTop: "5%" },
  pic: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  plus: {
    justifyContent: "center",
    height: 60,
    marginStart: 10,
    marginVertical: 30,
  },
});

export default ImageUpload;
