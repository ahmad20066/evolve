const path = require('path');
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

// Resolve project root - handle junction paths
const projectRoot = path.resolve(__dirname);
const defaultConfig = getDefaultConfig(projectRoot);
const {assetExts, sourceExts} = defaultConfig.resolver;

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  projectRoot: projectRoot,
  watchFolders: [projectRoot],
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    assetExts: assetExts.filter(ext => ext !== 'svg'),
    sourceExts: [...sourceExts, 'svg'],
  },
};

module.exports = mergeConfig(defaultConfig, config);
