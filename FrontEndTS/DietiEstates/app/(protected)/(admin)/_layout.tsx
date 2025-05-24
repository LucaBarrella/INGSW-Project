import { Stack } from 'expo-router';
import React from 'react';
import { useThemeColor } from '@/hooks/useThemeColor';


export default function AdminLayout() {
  const headerBg = useThemeColor({}, 'background');
  const tintColor = useThemeColor({}, 'text');
  
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        title: '',
        animation: 'slide_from_right',
        headerTitleStyle: { fontFamily: 'SpaceMono' },
        headerTintColor: tintColor,
        headerBackVisible: true,
        headerBackTitle: 'Indietro',
        headerStyle: { backgroundColor: headerBg },
      }}
    >
      <Stack.Screen
        name="home"
        options={{
          title: '',
          headerShown: false
        }}
      />
      <Stack.Screen
        name="(tabs)"
        options={{
          title: '',
          headerBackVisible: true,
          }}
      />
    </Stack>
  );
}
