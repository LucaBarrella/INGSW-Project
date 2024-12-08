module.exports = function(api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      [
        'react-native-iconify/babel',
        {
          icons: [
            'material-symbols:key-outline',
            'material-symbols:business-center-outline',
            'material-symbols:admin-panel-settings-outline',
          ],
        },
      ],
    ],
  };
};