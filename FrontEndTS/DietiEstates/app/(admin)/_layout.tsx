import { Stack } from 'expo-router';
import React from 'react';

export default function AdminLayout() {
  return (
    <Stack 
      screenOptions={{ headerShown: false }}
      initialRouteName="dashboard"
    >
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
