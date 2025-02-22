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
            // 'fa6-brands:google',
            // 'fa6-brands:meta',
            // 'fa6-brands:github',
            // 'fa6-brand:apple',
            'devicon:google',
            
            'lineicons:google',
            'lineicons:meta-alt',
            'lineicons:github',
            'lineicons:apple-brand',
            'lineicons:emoji-sad',

            'material-symbols:key-outline',
            'material-symbols:person-add-outline',
            'material-symbols:real-estate-agent-outline',
            'material-symbols:sim-card-download-outline',

            'material-symbols:push-pin',
            'material-symbols:push-pin-outline',
            'material-symbols:home-outline',
            'material-symbols:visibility-outline-rounded',
            'material-symbols:calendar-month-outline',
            'material-symbols:attach-money'
          ],
        },
      ],
    ],
  };
};
