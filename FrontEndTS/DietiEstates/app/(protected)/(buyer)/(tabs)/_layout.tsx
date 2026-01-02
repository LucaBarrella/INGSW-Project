import { Tabs } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { CustomTabBar } from '@/components/CustomTabBar';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { HapticTab } from '@/components/HapticTab';

export default function BuyerTabLayout() {
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
          title: t('buyer.tabs.home'),
        }}
      />
      <Tabs.Screen
        name="visits"
        options={{
          title: t('buyer.tabs.visits'),
          href: null,
        }}
      />
      <Tabs.Screen
        name="offers"
        options={{
          title: t('buyer.tabs.offers'),
          href: null,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('buyer.tabs.profile'),
        }}
      />
    </Tabs>
  );
}
