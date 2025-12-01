import React from 'react';
import { ScrollView, Alert } from 'react-native'; // Rimosso TouchableOpacity se non più usato direttamente

import { useAuth } from '../../../../context/AuthContext';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
// ThemedIcon potrebbe non essere più usata direttamente se ProfileOptionRow la gestisce
import { useThemeColor } from '@/hooks/useThemeColor';
import { UserInfoCard } from '@/components/Profile/UserInfoCard';
import { ProfileOptionsGroup } from '@/components/Profile/ProfileOptionsGroup';
import { ProfileOptionRowProps } from '@/components/Profile/ProfileOptionRow'; // Per il tipo delle opzioni
import { useTranslation } from 'react-i18next';
import { getToken } from '@/src/core/auth/TokenManager';
import { router } from 'expo-router';
import httpClient from '@/src/core/httpClient';

export default function ProfileTab() {
  const backgroundColor = useThemeColor({}, 'background');
  const { logout } = useAuth();
  const { t } = useTranslation();
  
  const [userData, setUserData] = React.useState({
    username: '',
    role: '',
    email: '',
    fullName: ''
  });

  React.useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        if (token) {
          const payloadBase64 = token.split('.')[1];
          const payload = JSON.parse(atob(payloadBase64));
          setUserData(prev => ({
            ...prev,
            username: payload.sub,
            role: payload.roles.join(', ').replace(/ROLE_/g, '')
          }));
        }
      } catch (error) {
        console.error('Errore nel recupero del token:', error);
      }

      try {
        const response = await httpClient.get("/info/me");
        setUserData(prev => ({
          ...prev,
          fullName: response.data.fullName,
          email: response.data.email
        }));
      } catch (error) {
        console.error('Errore nel recupero delle informazioni utente:', error);
      }
    })();
  }, []);
  

  const adminOptions: Array<Omit<ProfileOptionRowProps, 'isFirst'>> = [
    {
      id: 'add-agent',
      title: t('profile.addAgent'),
      icon: 'mdi:account-group',
      onPress: () => router.push('/(protected)/(admin)/add-agent')
    },
    {
      id: 'add-admin',
      title: t('profile.addManager'),
      icon: 'mdi:shield-account',
      onPress: () => router.push('/(protected)/(admin)/add-admin')
    },
    {
      id: 'change-password',
      title: t('profile.changePassword'),
      icon: 'mdi:lock-reset',
      onPress: () => router.push('/(protected)/(admin)/change-password')
    }
  ];

  const commonOptions: Array<Omit<ProfileOptionRowProps, 'isFirst'>> = [
    {
      id: 'settings',
      title: t('settings'),
      icon: 'mdi:cog',
      onPress: () => router.push('/(protected)/(buyer)/settings')
    },
    {
      id: 'logout',
      title: t('logout'),
      icon: 'mdi:logout',
      onPress: async () => {
        try {
          await logout();
        } catch (error) {
          console.error('Errore durante il logout:', error);
          Alert.alert(t('profile.logoutError'), t('profile.logoutErrorMessage'));
        }
      }
    }
  ];

  const agentOptions: Array<Omit<ProfileOptionRowProps, 'isFirst'>> = [
    {
      id: 'my-properties',
      title: t('myProperties'),
      icon: 'mdi:home-city',
      onPress: () => router.push('/(protected)/(agent)/properties')
    }
  ];

  return (
    <ThemedView style={{ flex: 1, backgroundColor }}>
      <ThemedView className="p-4">
        <ThemedText className="text-xl font-semibold">
          {t('profileTab')}
        </ThemedText>
      </ThemedView>

      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingVertical: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <UserInfoCard name={userData.fullName} username={userData.username} role={userData.role} email={userData.email}  />

        {userData.role.includes('MANAGER') && <ProfileOptionsGroup options={adminOptions} />}
        {userData.role.includes('AGENT') && <ProfileOptionsGroup options={agentOptions} />}
        <ProfileOptionsGroup options={commonOptions} />
      </ScrollView>
    </ThemedView>
  );
}
