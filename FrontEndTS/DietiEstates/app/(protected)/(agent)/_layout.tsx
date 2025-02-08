import { Stack } from 'expo-router';
import React from 'react';

export default function AgentLayout() {
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
          title: 'Agent Dashboard',
          headerBackVisible: false
        }}
      />
    </Stack>
  );
}
