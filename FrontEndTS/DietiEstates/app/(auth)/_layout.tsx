import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import React from 'react';
import { useColorScheme } from '@/hooks/useColorScheme';

const AuthLayout = () => {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(buyer)/login" options={{ headerShown: false }} />
        <Stack.Screen name="(buyer)/register" options={{ headerShown: false }} />
        <Stack.Screen name="(agent)/login" options={{ headerShown: true }} />
        <Stack.Screen name="(admin)/login" options={{ headerShown: true }} />
      </Stack>
    </ThemeProvider>
  );
}

export default AuthLayout;