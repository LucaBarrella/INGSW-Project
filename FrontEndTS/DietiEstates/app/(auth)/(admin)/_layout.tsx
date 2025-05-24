import { Stack } from 'expo-router';
import React from 'react';

export default function AdminAuthLayout() {
  return (
    <Stack 
      screenOptions={{ 
        headerShown: false,
        animation: 'slide_from_right',
        headerTitleStyle: { fontFamily: 'SpaceMono' }
      }}
    >
      <Stack.Screen 
        name="login"
        options={{
          title: 'Accesso Admin',
          headerBackTitle: 'Indietro',
          headerTintColor: '#4F46E5'
        }}
      />
    </Stack>
  );
}
