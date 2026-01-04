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
            'material-symbols:garage-outline',
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
            'material-symbols:park',

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
            'material-symbols:key',
            'material-symbols:person-add-outline',
            'material-symbols:real-estate-agent-outline',
            'material-symbols:sim-card-download-outline',
            'material-symbols:check-circle-outline',

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
            'mdi:garage',
            'mdi:account-group',
            'mdi:shield-account',
            'mdi:lock-reset',
            'mdi:home-city',



            'material-symbols:square-foot',
            'material-symbols:flash-on',
            'material-symbols:bed',
            'material-symbols:bathtub',
            'material-symbols:exit-to-app',
            'material-symbols:fire-extinguisher',
            'material-symbols:height',
            'material-symbols:forest',
            'material-symbols:history-rounded',
            'material-symbols:factory-outline',
            'material-symbols:garage-outline',
            'material-symbols:info',
            'material-symbols:energy-savings-leaf-outline',
            'lucide:arrow-right',
            'lucide:chevron-right',

            'material-symbols:description-outline',
            'material-symbols:location-on-outline',
            'material-symbols:search',
            'material-symbols:keyboard-arrow-down',
            'material-symbols:keyboard-arrow-down-rounded',
            'material-symbols:assignment-turned-in-outline',
            'material-symbols:store-outline',
            'material-symbols:space-dashboard-outline',
            'material-symbols:add-a-photo-outline',
            'material-symbols:info-outline',
            'material-symbols:arrow-back-rounded',
            'material-symbols:check-circle-outline',
            'material-symbols:check-circle-rounded',
            'material-symbols:edit-outline',


            'material-symbols:location-on',
            'material-symbols:search-rounded',
            'material-symbols:check-rounded',
            'material-symbols:add-road',
            'material-symbols:euro',
            'material-symbols:square-foot',
            'material-symbols:apartment',
            'material-symbols:sell',
            'material-symbols:key',
            'material-symbols:description',
            'material-symbols:assignment-turned-in',
            'material-symbols:add-a-photo',
            'material-symbols:keyboard-arrow-up-rounded',
            'material-symbols:edit-outline',
            'material-symbols:close-rounded',
            'material-symbols:history-edu-outline',
            'material-symbols:add-a-photo',
            'material-symbols:add-road-rounded',
            'material-symbols:check-rounded',
            'material-symbols:search-rounded',


          ],
        },
      ],
    ],
  };
};
