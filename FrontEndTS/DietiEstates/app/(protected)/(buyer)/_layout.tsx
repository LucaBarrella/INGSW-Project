import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { useThemeColor } from '@/hooks/useThemeColor';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function BuyerLayout() {

  const headerBg = useThemeColor({}, 'background');
  const tintColor = useThemeColor({}, 'text');
  const router = useRouter();


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
      <Stack.Screen
        name="property-detail"
        options={{
          headerShown: true,
          title: 'Dettaglio Immobile',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10 }}>
              <Ionicons name="arrow-back" size={24} color={tintColor} />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}