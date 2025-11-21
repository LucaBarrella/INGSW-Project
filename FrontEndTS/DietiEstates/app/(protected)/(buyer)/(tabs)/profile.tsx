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

export default function ProfileTab() {
  const backgroundColor = useThemeColor({}, 'background');
  const { signOut } = useAuth();
  // borderColor non è più usato direttamente qui se ProfileOptionsGroup e UserInfoCard lo gestiscono internamente

  // TODO DA SISTEMARE: Implementare recupero dati utente reali dal server
  const userData = {
    name: 'DA SISTEMARE', // Implementare recupero nome utente dal server
    email: 'DA SISTEMARE', // Implementare recupero email utente dal server
  };

  // Adattato il tipo per ProfileOptionsGroup
  const profileOptions: Array<Omit<ProfileOptionRowProps, 'isFirst'>> = [
    {
      id: 'edit-profile',
      title: 'Modifica Profilo',
      icon: 'mdi:account-edit',
      onPress: () => console.log('Edit profile')
    },
    {
      id: 'settings',
      title: 'Impostazioni',
      icon: 'mdi:cog',
      onPress: () => console.log('Settings')
    },
    {
      id: 'help',
      title: 'Aiuto',
      icon: 'mdi:help-circle',
      onPress: () => console.log('Help')
    },
    {
      id: 'logout',
      title: 'Esci',
      icon: 'mdi:logout',
      onPress: async () => { // Trasformato in async
        try {
          await signOut();
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
        {/* Se si vuole mantenere lo sfondo bianco per l'header, ripristinare bg-white qui o gestire tramite tema */}
        <ThemedText className="text-xl font-semibold">
          Profilo
        </ThemedText>
      </ThemedView>

      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingVertical: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <UserInfoCard
          name={userData.name}
          email={userData.email}
          // iconName e iconLabel usano i default di UserInfoCard
        />

        <ProfileOptionsGroup options={profileOptions} />
      </ScrollView>
    </ThemedView>
  );
}
