import React from 'react';
import { ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useTranslation } from 'react-i18next';
import { UserInfoCard } from '@/components/Profile/UserInfoCard';
import { ProfileOptionsGroup } from '@/components/Profile/ProfileOptionsGroup';
import { ProfileOptionRowProps } from '@/components/Profile/ProfileOptionRow';


export default function AdminProfileTab() {
  const router = useRouter();
  const { t } = useTranslation();
  const backgroundColor = useThemeColor({}, 'background');

  // TODO DA SISTEMARE: Implementare recupero dati admin reali dal server
  const adminData = {
    name: 'DA SISTEMARE', // Implementare recupero nome admin dal server
    email: 'DA SISTEMARE', // Implementare recupero email admin dal server
    role: 'DA SISTEMARE' // Implementare recupero ruolo admin dal server
  };

  // Definizione delle opzioni del profilo
  // Omit 'isFirst' as it's handled by ProfileOptionsGroup
  const profileOptions: Array<Omit<ProfileOptionRowProps, 'isFirst'>> = [
    {
      id: 'change-password',
      title: t('admin.profile.changePassword'),
      icon: 'material-symbols:key-outline', // Icona specificata nel punto 3
      onPress: () => router.push('/(protected)/(admin)/change-password')
    },
    {
      id: 'settings',
      title: t('admin.profile.settings'),
      icon: 'material-symbols:settings-outline', // Icona specificata nel punto 3
      onPress: () => router.push('/(protected)/(admin)/settings')
    },
    {
      id: 'logout',
      title: t('admin.profile.logout'),
      icon: 'material-symbols:logout', // Icona specificata nel punto 3
      onPress: async () => {
        try {
        } catch (error) {
          console.error('Errore durante il logout:', error);
          Alert.alert(
            t('admin.profile.logoutError'),
            t('admin.profile.logoutErrorMessage')
          );
        }
      }
    }
  ];

  return (
    <ThemedView style={{ flex: 1, backgroundColor }}>
      {/* Il titolo della tab è gestito da _layout.tsx in (tabs) */}
      {/* <ThemedView className="p-4 bg-white">
        <ThemedText className="text-xl font-semibold">
          {t('admin.profile.title')}
        </ThemedText>
      </ThemedView> */}

      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingVertical: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <UserInfoCard
          name={adminData.name}
          email={adminData.email}
          role={adminData.role}
          // iconName non specificato, userà il default "mdi:account-circle"
          iconLabel="User Profile Icon" // Etichetta generica
        />

        <ProfileOptionsGroup options={profileOptions} />
      </ScrollView>
    </ThemedView>
  );
}