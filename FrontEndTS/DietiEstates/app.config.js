require('dotenv').config();

module.exports = {
  expo: {
    name: "DietiEstates",
    slug: "DietiEstates",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/logo.jpeg",
    scheme: "dietiestates",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    androidStatusBar: {
      translucent: false 
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.fabbest.dietiestates",
      config: {
        googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY
      }
    },
    android: {
      googleServicesFile: "google-services.json",
      adaptiveIcon: {
        foregroundImage: "./assets/images/logo.jpeg",
        backgroundColor: "#ffffff"
      },
      config: {
        googleMaps: {apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}
      },
      package: "com.fabbest.dietiestates"
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/logo.jpeg",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff"
        }
      ],
      "expo-localization",
      "expo-secure-store",
      "expo-font"
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      router: {},
      eas: {
        projectId: "4cd742cb-7c0e-4e08-abd4-9f9c90b506d6"
      }
    },
    owner: "lucabarrella"
  }
}