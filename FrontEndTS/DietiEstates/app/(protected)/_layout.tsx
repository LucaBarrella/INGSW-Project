import React from 'react';
import { Stack } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function ProtectedLayout() {
  const backgroundColor = useThemeColor({}, 'background');

  return (
    <ThemedView style={{ flex: 1, backgroundColor }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(admin)" options={{ headerShown: false }} />
        <Stack.Screen name="(agent)" options={{ headerShown: false }} />
        <Stack.Screen name="(buyer)" options={{ headerShown: false }} />
      </Stack>
    </ThemedView>
  );
}

