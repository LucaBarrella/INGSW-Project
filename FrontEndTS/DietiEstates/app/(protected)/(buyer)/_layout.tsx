import { Stack } from 'expo-router';
import React from 'react';

export default function BuyerLayout() {
  return (
    <Stack 
      screenOptions={{ 
        headerShown: false,
        animation: 'slide_from_right',
        headerTitleStyle: { fontFamily: 'SpaceMono' }
      }}
    >
      <Stack.Screen 
        name="(tabs)"
        options={{
        }}
      />
    </Stack>
  );
}
