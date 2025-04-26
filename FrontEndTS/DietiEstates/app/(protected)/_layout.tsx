import React from 'react';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function ProtectedLayout() {
  const backgroundColor = useThemeColor({}, 'background');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }} edges={['top']}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(admin)" options={{ headerShown: false }} />
        <Stack.Screen name="(agent)" options={{ headerShown: false }} />
        <Stack.Screen name="(buyer)" options={{ headerShown: false }} />
      </Stack>
    </SafeAreaView>
  );
}
