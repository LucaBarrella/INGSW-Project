import React, { useState, useEffect } from 'react';
import { ScrollView, TouchableOpacity, Alert } from 'react-native'; // Aggiunto TouchableOpacity, Alert
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router'; // Aggiunto useRouter
import * as SecureStore from 'expo-secure-store'; // Aggiunto SecureStore
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { TabHeader } from '@/components/TabHeader';
import ApiService from '@/app/_services/api.service'; // Già presente
import ThemedButton from '@/components/ThemedButton'; // Aggiunto ThemedButton
import { useThemeColor } from '@/hooks/useThemeColor';

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

type InfoRowProps = {
  readonly label: string;
  readonly value: string | number;
};

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <ThemedView 
      className="flex flex-col gap-2 p-6 rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.05)] mb-4"
      style={{ 
        backgroundColor: useThemeColor({}, 'propertyCardBackground')
      }}
    >
      <ThemedText 
        className="text-sm"
        style={{ 
          color: useThemeColor({}, 'propertyCardDetail'),
          opacity: 0.8
        }}
      >
        {label}
      </ThemedText>
      <ThemedText 
        className="text-lg font-bold"
        style={{ 
          color: useThemeColor({}, 'text')
        }}
      >
        {value}
      </ThemedText>
    </ThemedView>
  );
}

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
          <InfoRow label={t('agent.profile.fullName')} value={profile.fullName} />
          <InfoRow label={t('agent.profile.email')} value={profile.email} />
          <InfoRow label={t('agent.profile.license')} value={profile.licenseNumber} />
          <InfoRow label={t('agent.profile.specialization')} value={profile.specialization} />
          <InfoRow 
            label={t('agent.profile.experience')} 
            value={`${profile.experienceYears} ${t('agent.profile.years')}`} 
          />
          <InfoRow label={t('agent.profile.office')} value={profile.officeAddress} />

          {/* Pulsante Logout */}
          <ThemedButton
            title={t('logout.buttonTitle')}
            onPress={handleLogout}
            lightColor="#DC2626" // Rosso per "danger"
            darkColor="#F87171"
            className="mt-8 mb-4 mx-4" // Aggiungi margini
          />
        </ScrollView>
      )}
    </ThemedView>
  );
}
