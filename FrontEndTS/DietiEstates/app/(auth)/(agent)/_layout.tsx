import { Stack } from 'expo-router';
import React from 'react';

export default function AgentAuthLayout() {
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
          title: 'Accesso Agente',
          headerBackTitle: 'Indietro',
          headerTintColor: '#4F46E5'
        }}
      />
    </Stack>
  );
}
