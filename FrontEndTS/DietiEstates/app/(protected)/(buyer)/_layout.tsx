import { Stack } from 'expo-router';
import React from 'react';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function BuyerLayout() {

  const headerBg = useThemeColor({}, 'background');
  const tintColor = useThemeColor({}, 'text');


  return (
    <Stack 
      screenOptions={{ 
        headerShown: false,
        animation: 'slide_from_right',
        headerTitleStyle: { fontFamily: 'Poppins' },
        headerStyle: { backgroundColor: headerBg },
        headerTintColor: tintColor,
      }}
    >
      <Stack.Screen 
        name="(tabs)"
        options={{
        }}
      />
      <Stack.Screen 
        name="search"
        options={{
        headerShown: true,
        title: '',
        animation: 'slide_from_right',
        headerBackTitle: 'Home',
      }}
      />
    </Stack>
  );
}