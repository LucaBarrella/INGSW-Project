import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import React from 'react';
import { useColorScheme } from '@/hooks/useColorScheme';

const AuthLayout = () => {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right'
        }}
      >
        <Stack.Screen 
          name="index" 
          options={{
            title: 'Role Selection'
          }}
        />
        <Stack.Screen name="(buyer)" />
        <Stack.Screen name="(agent)" />
        <Stack.Screen name="(admin)" />
      </Stack>
    </ThemeProvider>
  );
}

export default AuthLayout;
