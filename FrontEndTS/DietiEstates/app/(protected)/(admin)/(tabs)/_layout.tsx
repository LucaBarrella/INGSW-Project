import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import {HapticTab} from '@/components/HapticTab';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

const PasswordIcon = ({ color }: { color: string }) => (
  <MaterialIcons name="key" size={28} color={color} />
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
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="change-password"
        options={{
          title: t('admin.tabs.changePassword'),
          tabBarIcon: PasswordIcon,
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
