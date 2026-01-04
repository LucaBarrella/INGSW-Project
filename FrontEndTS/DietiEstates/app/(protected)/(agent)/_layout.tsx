import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function AgentLayout() {
  const { t } = useTranslation();
  const router = useRouter();

  const backgroundColor = useThemeColor({}, 'background');
  const tintColor = useThemeColor({}, 'text');
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        headerTitleStyle: {
          fontFamily: 'Poppins', // Suggerimento: 'Poppins' è un font moderno e minimale
          fontSize: 17,
          fontWeight: '600',
          color: tintColor, // Usa il colore del tema per il titolo
        },
        headerStyle: {
          backgroundColor: backgroundColor, // Usa il colore di sfondo del tema
        },
        headerTintColor: tintColor, // Usa il colore del tema per icone e back button
      }}
    >
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="add-property"
        options={{
          headerShown: true,
          title: t('addProperty.title'),
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10 }}>
              <Ionicons name="arrow-back" size={24} color={tintColor} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="properties"
        options={{
          headerShown: true,
          title: t('myProperties'),
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10 }}>
              <Ionicons name="arrow-back" size={24} color={tintColor} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.push('/add-property')}
              style={{ marginRight: 15 }}
            >
              <Ionicons name="add" size={28} color={tintColor} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="archive"
        options={{
          headerShown: true,
          title: t('offersArchived.agent.archiveTitle'),
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
