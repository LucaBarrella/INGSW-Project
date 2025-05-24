import React from 'react';
import { ScrollView, Alert } from 'react-native'; // Rimosso TouchableOpacity se non più usato direttamente
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store'; // Import SecureStore
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
// ThemedIcon potrebbe non essere più usata direttamente se ProfileOptionRow la gestisce
import { useThemeColor } from '@/hooks/useThemeColor';
import { UserInfoCard } from '@/components/Profile/UserInfoCard';
import { ProfileOptionsGroup } from '@/components/Profile/ProfileOptionsGroup';
import { ProfileOptionRowProps } from '@/components/Profile/ProfileOptionRow'; // Per il tipo delle opzioni

export default function ProfileTab() {
  const router = useRouter();
  const backgroundColor = useThemeColor({}, 'background');
  // borderColor non è più usato direttamente qui se ProfileOptionsGroup e UserInfoCard lo gestiscono internamente

  // Chiave per recuperare/rimuovere il token JWT da SecureStore
  const TOKEN_KEY = 'user_auth_token';

  // TODO: Replace with real user data
  const mockUser = {
    name: 'Mario Rossi',
    email: 'mario.rossi@example.com',
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
          // Rimuovi il token da SecureStore
          await SecureStore.deleteItemAsync(TOKEN_KEY);
          console.log('Token rimosso con successo!'); // Log per debug
          // Reindirizza alla schermata di autenticazione principale
          router.replace('/(auth)');
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
          name={mockUser.name}
          email={mockUser.email}
          // iconName e iconLabel usano i default di UserInfoCard
        />

        <ProfileOptionsGroup options={profileOptions} />
      </ScrollView>
    </ThemedView>
  );
}
