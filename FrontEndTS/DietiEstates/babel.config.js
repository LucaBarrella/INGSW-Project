module.exports = function (api) {
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
            'ion:chevron-back',
            'ion:chevron-forward',

            // Icone Material Symbols usate in Step1 e Step5
            'material-symbols:factory-outline',
            'material-symbols:landscape-outline',
            'material-symbols:close-rounded',
            'material-symbols:add-photo-alternate-outline-rounded',
            // Icone esistenti (alcune già usate in Step1)
            'material-symbols:house-outline',
            'material-symbols:business-center-outline',
            'material-symbols:admin-panel-settings-outline',
            // Nuove icone material-symbols
            'material-symbols:arrow-back-ios',
            'material-symbols:directions-car',
            'material-symbols:school',
            'material-symbols:local-hospital',
            'material-symbols:shopping-bag',
            'material-symbols:train',

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
            'material-symbols:calendar-today',
            'material-symbols:update',
            'material-symbols:attach-money',
            'material-symbols:settings-outline',
            'material-symbols:logout',
            'material-symbols:chevron-right',
            'material-symbols:account-circle',
            'material-symbols:shield-person',
            'material-symbols:map-outline-rounded',
            'material-symbols:list-alt-outline-rounded',
            'material-symbols:favorite-rounded',
            'material-symbols:favorite-outline-rounded',
            'material-symbols:help',
            'material-symbols:error-outline', // Aggiunta per gestione errori meteo
            'material-symbols:hourglass-empty', // Aggiunta per indicatore caricamento meteo

            // New weather icons
            "meteocons:clear-day-fill",
            "meteocons:partly-cloudy-day-fill",
            "meteocons:overcast-day-fill",
            "meteocons:fog-day-fill",
            "meteocons:fog-day-fill",
            "meteocons:partly-cloudy-day-drizzle-fill",
            "meteocons:overcast-day-drizzle-fill",
            "meteocons:extreme-day-drizzle-fill",
            "meteocons:partly-cloudy-day-hail-fill",
            "meteocons:overcast-day-hail-fill",
            "meteocons:overcast-day-rain-fill",
            "meteocons:partly-cloudy-day-snow-fill",
            "meteocons:overcast-day-snow-fill",
            "meteocons:extreme-day-snow-fill",
            "meteocons:partly-cloudy-day-rain-fill",
            "meteocons:extreme-day-rain-fill",
            "meteocons:thunderstorms-day-extreme-fill",
            "meteocons:thunderstorms-day-extreme-snow-fill",


            //! DELETE ALL ICONS BELOW:
            'mdi:account-edit',
            'mdi:cog',
            'mdi:help-circle',
            'mdi:logout',
            'mdi:account-circle',
            'mdi:chevron-right',
            'mdi:card-account-details-outline', // Aggiunta per profilo agente
            'mdi:star-box-outline',             // Aggiunta per profilo agente
            'mdi:calendar-clock-outline',       // Aggiunta per profilo agente
            'mdi:office-building-outline',      // Aggiunta per profilo agente


            //!
            'mdi:home',
            'mdi:land-fields',
            'mdi:office-building',
            'mdi:factory',



            'material-symbols:square-foot',
            'material-symbols:flash-on',
            'material-symbols:bed',
            'material-symbols:bathtub',
            'material-symbols:exit-to-app',
            'material-symbols:fire-extinguisher',
            'material-symbols:height',
            'material-symbols:forest',
            'material-symbols:history-rounded'
          ],
        },
      ],
    ],
  };
};
