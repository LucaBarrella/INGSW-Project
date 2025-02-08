// @@iconify-code-gen

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import "../global.css";

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const STACK_SCREENS = [
  { name: "(auth)" },
  { name: "(protected)", options: { gestureEnabled: false } },
  { name: "+not-found", options: { presentation: 'modal' as const } }
];

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }} initialRouteName="(auth)">
        {STACK_SCREENS.map(screen => (
          <Stack.Screen 
            key={screen.name}
            name={screen.name} 
            options={{
              headerShown: false,
              ...screen.options
            }}
          />
        ))}
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
