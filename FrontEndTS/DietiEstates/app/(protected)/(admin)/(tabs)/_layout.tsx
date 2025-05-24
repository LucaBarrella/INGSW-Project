import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import {HapticTab} from '@/components/HapticTab';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

const ProfileIcon = ({ color }: { color: string }) => (
  <MaterialIcons name="account-circle" size={28} color={color} />
);

const AdminIcon = ({ color }: { color: string }) => (
  <MaterialIcons name="person-add" size={28} color={color} />
);

const AgentIcon = ({ color }: { color: string }) => (
  <MaterialIcons name="real-estate-agent" size={28} color={color} />
);

export default function AdminTabLayout() {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tabIconSelected, // Icone selezionate
        tabBarInactiveTintColor: `${Colors[colorScheme ?? 'light'].tabIconDefault}80`, // Icone non selezionate con opacità 60%
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: Colors[colorScheme ?? 'light'].tabBarBackground, // Sfondo TabBar
          borderTopWidth: 0,
          ...(Platform.OS === 'ios' ? { position: 'absolute' } : {}),
        },
      }}>
      <Tabs.Screen
        name="profile"
        options={{
          title: t('admin.profile.title'),
          tabBarIcon: ProfileIcon,
        }}
      />
      <Tabs.Screen
        name="add-admin"
        options={{
          title: t('admin.tabs.newAdmin'),
          tabBarIcon: AdminIcon,
        }}
      />
      <Tabs.Screen
        name="add-agent"
        options={{
          title: t('admin.tabs.newAgent'),
          tabBarIcon: AgentIcon,
        }}
      />
    </Tabs>
  );
}
