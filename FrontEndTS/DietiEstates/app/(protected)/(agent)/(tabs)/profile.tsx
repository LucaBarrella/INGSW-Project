import React, { useState, useEffect } from 'react';
import { ScrollView, Alert } from 'react-native'; // Rimosso TouchableOpacity, ThemedButton
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { TabHeader } from '@/components/TabHeader';
import ApiService from '@/app/_services/api.service';
// useThemeColor è importato ma potrebbe non essere più usato direttamente qui se i componenti figli lo gestiscono
// import { useThemeColor } from '@/hooks/useThemeColor';
import { UserInfoCard } from '@/components/Profile/UserInfoCard';
import { ProfileOptionsGroup } from '@/components/Profile/ProfileOptionsGroup';
import { ProfileOptionRowProps } from '@/components/Profile/ProfileOptionRow';

// Chiave per recuperare/rimuovere il token JWT da SecureStore
const TOKEN_KEY = 'user_auth_token';

type AgentProfile = {
  fullName: string;
  email: string;
  licenseNumber: string;
  specialization: string;
  experienceYears: number;
  officeAddress: string;
};

// InfoRow non è più necessaria

export default function ProfileScreen() {
  const { t } = useTranslation();
  const router = useRouter(); // Inizializza router
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<AgentProfile | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setIsLoading(true); // Assicura che isLoading sia true all'inizio
    setError(null); // Resetta errori precedenti
    try {
      // Usa la nuova funzione da ApiService
      const data = await ApiService.getAgentProfile();
      setProfile(data);
    } catch (err: any) {
      console.error('Errore fetch profilo agente:', err);
      const errorMessage = err.response?.data?.message || err.message || t('agent.profile.fetchError'); // Usa traduzione per errore generico
      setError(errorMessage);
      // Considera se mostrare dati mock in caso di errore o solo il messaggio
      // setProfile({ ... }); // Rimuovi o commenta se non vuoi mock in caso di errore reale
    } finally {
      setIsLoading(false);
    }
  };

  // Funzione per il logout
  const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      console.log('Token agente rimosso con successo!');
      router.replace('/(auth)'); // Torna alla schermata di selezione ruolo/login
    } catch (error) {
      console.error('Errore durante il logout agente:', error);
      Alert.alert(t('common.error'), t('logout.error')); // Assumendo traduzioni esistenti
    }
  };

  if (isLoading) {
    return (
      <ThemedView className="flex-1 justify-center items-center">
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  }

  if (error && !profile) {
    return (
      <ThemedView className="flex-1 justify-center items-center">
        <ThemedText className="text-red-500">{error}</ThemedText>
      </ThemedView>
    );
  }

  const agentProfileOptions: Array<Omit<ProfileOptionRowProps, 'isFirst'>> = profile ? [
    {
      id: 'licenseNumber',
      title: `${t('agent.profile.license')}: ${profile.licenseNumber}`,
      icon: 'mdi:card-account-details-outline',
      onPress: () => {}, // Riga informativa
    },
    {
      id: 'specialization',
      title: `${t('agent.profile.specialization')}: ${profile.specialization}`,
      icon: 'mdi:star-box-outline',
      onPress: () => {}, // Riga informativa
    },
    {
      id: 'experienceYears',
      title: `${t('agent.profile.experience')}: ${profile.experienceYears} ${t('agent.profile.years')}`,
      icon: 'mdi:calendar-clock-outline',
      onPress: () => {}, // Riga informativa
    },
    {
      id: 'officeAddress',
      title: `${t('agent.profile.office')}: ${profile.officeAddress}`,
      icon: 'mdi:office-building-outline',
      onPress: () => {}, // Riga informativa
    },
    {
      id: 'logout',
      title: t('logout.buttonTitle'),
      icon: 'mdi:logout',
      onPress: handleLogout,
    },
  ] : [];

  return (
    <ThemedView className="flex-1">
      <TabHeader
        title={t('agent.profile.title')}
        subtitle={t('agent.profile.subtitle')}
      />
      {profile && (
        <ScrollView
          className="flex-1 px-4"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 20 }}
        >
          <UserInfoCard
            name={profile.fullName}
            email={profile.email}
            role={t('roles.agent')} // Aggiungiamo il ruolo se appropriato
          />
          <ProfileOptionsGroup options={agentProfileOptions} />
        </ScrollView>
      )}
    </ThemedView>
  );
}
