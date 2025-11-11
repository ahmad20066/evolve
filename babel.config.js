const path = require('path');

const presets = ["@react-native/babel-preset"];
const plugins = [];

plugins.push(
  [
    "module-resolver",
    {
      root: [path.resolve(__dirname, "src")],
      extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
  ],
  "react-native-worklets/plugin"
);

module.exports = {
  presets,
  overrides: [
    {
      plugins: [
        [
          "@babel/plugin-transform-private-methods",
          {
            loose: true,
          },
        ],
      ],
    },
  ],
  plugins,
};
