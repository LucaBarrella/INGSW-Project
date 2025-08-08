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

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
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
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: t('buyer.tabs.favorites'),
        }}
      />
      <Tabs.Screen
        name="offers"
        options={{
          title: t('buyer.tabs.offers'),
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
