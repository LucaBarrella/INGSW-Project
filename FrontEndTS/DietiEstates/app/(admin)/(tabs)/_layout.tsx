import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { HapticTab } from '../../../components/HapticTab';
import { IconSymbol } from '../../../components/ui/IconSymbol';
import TabBarBackground from '../../../components/ui/TabBarBackground';
import { Colors } from '../../../constants/Colors';
import { useColorScheme } from '../../../hooks/useColorScheme';

const PasswordIcon = ({ color }: { color: string }) => (
  <IconSymbol size={28} name="key.fill" color={color} />
);

const AdminIcon = ({ color }: { color: string }) => (
  <IconSymbol size={28} name="person.badge.plus.fill" color={color} />
);

const AgentIcon = ({ color }: { color: string }) => (
  <IconSymbol size={28} name="person.2.fill" color={color} />
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
