import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import React from 'react';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useThemeColor } from '@/hooks/useThemeColor';

const AuthLayout = () => {
  const colorScheme = useColorScheme();
  const headerBg = useThemeColor({}, 'background');
  const headerText = useThemeColor({}, 'text');

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerShown: true,
          animation: 'slide_from_right',
          headerStyle: { backgroundColor: headerBg },
          headerTintColor: headerText,
          headerTitleStyle: { fontFamily: 'SpaceMono' }
        }}
      >
        <Stack.Screen 
          name="index" 
          options={{
            title: 'Role Selection',
            headerShown: false
          }}
        />
        <Stack.Screen name="(buyer)" 
          options={{ 
            title : '',
            headerBackTitle: 'Indietro'
          }}
        />
        <Stack.Screen name="(agent)" 
          options={{ 
            title : '',
            headerBackTitle: 'Indietro'
          }}
        />
        <Stack.Screen name="(admin)" 
          options={{ 
            title : '',
            headerBackTitle: 'Indietro'
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}

export default AuthLayout;
