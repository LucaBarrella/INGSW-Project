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
            // Icone Material Symbols usate in Step1 e Step5
            'material-symbols:factory-outline',
            'material-symbols:landscape-outline',
            'material-symbols:close-rounded',
            'material-symbols:add-photo-alternate-outline-rounded',
            // Icone esistenti (alcune già usate in Step1)
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
            'material-symbols:check-circle-outline', // Aggiunta icona mancante

            'material-symbols:push-pin',
            'material-symbols:push-pin-outline',
            'material-symbols:home-outline',
            'material-symbols:visibility-outline-rounded',
            'material-symbols:calendar-month-outline',
            'material-symbols:attach-money',

            'material-symbols:favorite-rounded',
            'material-symbols:favorite-outline-rounded',


            //! DELETE ALL ICONS BELOW:
            'mdi:account-edit',
            'mdi:cog',
            'mdi:help-circle',
            'mdi:logout',
            'mdi:account-circle',
            'mdi:chevron-right',


            //!
            'mdi:home',
            'mdi:land-fields',
            'mdi:office-building',
            'mdi:factory'
          ],
        },
      ],
    ],
  };
};
