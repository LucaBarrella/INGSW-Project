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
            'material-symbols:house-outline',
            'material-symbols:business-center-outline',
            'material-symbols:admin-panel-settings-outline',
            
            'octicon:mark-github-16',
            'octicon:mark-github-24',
            'logos:google-icon',
            'logos:meta-icon',

            // Icone Colorabili! 
            'fa6-brands:google',
            'fa6-brands:meta',
            'fa6-brands:github',
          ],
        },
      ],
    ],
  };
};