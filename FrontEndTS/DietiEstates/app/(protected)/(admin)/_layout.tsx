import { Stack } from 'expo-router';
import React from 'react';

export default function AdminLayout() {
  return (
    <Stack 
      screenOptions={{ 
        headerShown: true,
        animation: 'slide_from_right',
        headerTitleStyle: { fontFamily: 'SpaceMono' }
      }}
    >
      <Stack.Screen 
        name="home" 
        options={{
          title: 'Admin Dashboard',
          headerBackVisible: false
        }}
      />
      <Stack.Screen 
        name="(tabs)"
        options={{
          title: 'Admin Tabs',
          headerBackVisible: true
        }}
      />
    </Stack>
  );
}
