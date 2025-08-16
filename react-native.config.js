module.exports = {
  project: {
    ios: {},
    android: {},
  },
  assets: ['./src/assets/fonts/'],
  dependencies: {
    'react-native-iap': {
      platforms: {
        android: null, // disable Android build
      },
    },
  },
};
