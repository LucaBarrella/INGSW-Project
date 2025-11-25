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

export default function ProfileTab() {
  const backgroundColor = useThemeColor({}, 'background');
  const { logout } = useAuth();
  const { t } = useTranslation();
  
  const [userData, setUserData] = React.useState({
    username: '',
    role: ''
  });

  getToken().then(token => {
    if (token && userData.username === '') {
      const payloadBase64 = token.split('.')[1];
      const payload = JSON.parse(atob(payloadBase64));
      const newUserData = { ...userData };
      newUserData.username = payload.sub;
      newUserData.role = payload.roles.join(', ').replace(/ROLE_/g, '');
      setUserData(newUserData);
    }
  }).catch(error => {
    console.error('Errore nel recupero del token:', error);
  });
  

  const adminOptions: Array<Omit<ProfileOptionRowProps, 'isFirst'>> = [
    {
      id: 'add-agent',
      title: 'Aggiungi Agente',
      icon: 'mdi:account-group',
      onPress: () => router.push('/(protected)/(admin)/add-agent')
    },
    {
      id: 'add-admin',
      title: 'Aggiungi Amministratore',
      icon: 'mdi:shield-account',
      onPress: () => router.push('/(protected)/(admin)/add-admin')
    },
    {
      id: 'change-password',
      title: 'Cambia Password',
      icon: 'mdi:lock-reset',
      onPress: () => router.push('/(protected)/(admin)/change-password')
    }
  ];

  const commonOptions: Array<Omit<ProfileOptionRowProps, 'isFirst'>> = [
    {
      id: 'settings',
      title: 'Impostazioni',
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
          Alert.alert('Errore Logout', 'Impossibile completare il logout. Riprova.');
        }
      }
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
        <UserInfoCard name={userData.username} role={userData.role} email='' />

        {userData.role.includes('MANAGER') && <ProfileOptionsGroup options={adminOptions} />}
        
        <ProfileOptionsGroup options={commonOptions} />
      </ScrollView>
    </ThemedView>
  );
}
