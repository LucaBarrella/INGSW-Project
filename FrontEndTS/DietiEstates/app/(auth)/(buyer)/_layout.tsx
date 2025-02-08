import { Stack } from 'expo-router';
import React from 'react';

export default function BuyerAuthLayout() {
  return (
    <Stack 
      screenOptions={{ 
        headerShown: true,
        animation: 'slide_from_right',
        headerTitleStyle: { fontFamily: 'SpaceMono' }
      }}
    >
      <Stack.Screen 
        name="login"
        options={{
          title: 'Accesso Utente',
          headerBackTitle: 'Indietro',
          headerTintColor: '#4F46E5'
        }}
      />
      <Stack.Screen 
        name="register"
        options={{
          title: 'Registrazione',
          headerBackTitle: 'Indietro',
          headerTintColor: '#4F46E5'
        }}
      />
    </Stack>
  );
}
