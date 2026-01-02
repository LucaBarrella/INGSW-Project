import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function AdminLayout() {
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
          fontFamily: 'Poppins',
          fontSize: 17,
          fontWeight: '600',
          color: tintColor,
        },
        headerStyle: {
          backgroundColor: backgroundColor,
        },
        headerTintColor: tintColor,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="change-password"
        options={{
          headerShown: true,
          title: t('admin.screens.changePassword.title'),
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10 }}>
              <Ionicons name="arrow-back" size={24} color={tintColor} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="add-admin"
        options={{
          headerShown: true,
          title: t('admin.screens.addAdmin.title'),
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10 }}>
              <Ionicons name="arrow-back" size={24} color={tintColor} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="add-agent"
        options={{
          headerShown: true,
          title: t('admin.screens.addAgent.title'),
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