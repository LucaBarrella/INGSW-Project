import { Tabs } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { CustomTabBar } from '@/components/CustomTabBar';
import { HapticTab } from '@/components/HapticTab';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function AgentTabLayout() {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();
  const headerBg = Colors[colorScheme ?? 'light'].background;
  const tintColor = Colors[colorScheme ?? 'light'].text;

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: true,
        tabBarButton: HapticTab,
        headerTitleStyle: { fontFamily: 'Poppins', fontSize: 18 },
        headerStyle: { backgroundColor: headerBg },
        headerTintColor: tintColor,
        headerShadowVisible: false,
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: t('agent.tabs.home'),
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: t('agent.tabs.activity'),
        }}
      />
      <Tabs.Screen
        name="agentOffers"
        options={{
          title: t('offers'),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('agent.tabs.profile'),
        }}
      />
    </Tabs>
  );
}
