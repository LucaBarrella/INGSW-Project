import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import {HapticTab} from '@/components/HapticTab';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';


const HomeIcon = ({ color }: { color: string }) => <MaterialIcons name="home" size={24} color={color} />;
const VisitsIcon = ({ color }: { color: string }) => <MaterialIcons name="calendar-today" size={24} color={color} />;
const AgendaIcon = ({ color }: { color: string }) => <MaterialIcons name="event-note" size={24} color={color} />;
const OffersIcon = ({ color }: { color: string }) => <MaterialIcons name="real-estate-agent" size={24} color={color} />;
const DashboardIcon = ({ color }: { color: string }) => <MaterialIcons name="dashboard" size={24} color={color} />;
const ProfileIcon = ({ color }: { color: string }) => <MaterialIcons name="person" size={24} color={color} />;


export default function AgentTabLayout() {
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
        name="home"
        options={{
          title: t('agent.tabs.home'),
          tabBarIcon: HomeIcon
        }}
      />
      <Tabs.Screen
        name="visits"
        options={{
          title: t('agent.tabs.visits'),
          tabBarIcon: VisitsIcon
        }}
      />
      <Tabs.Screen
        name="agenda"
        options={{
          title: t('agent.tabs.agenda'),
          tabBarIcon: AgendaIcon
        }}
      />
      <Tabs.Screen
        name="offers"
        options={{
          title: t('agent.tabs.offers'),
          tabBarIcon: OffersIcon
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: t('agent.tabs.dashboard'),
          tabBarIcon: DashboardIcon
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('agent.tabs.profile'),
          tabBarIcon: ProfileIcon
        }}
      />
    </Tabs>
  );
}
