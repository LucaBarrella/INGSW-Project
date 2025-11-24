import React, { useState, useEffect } from 'react';
import { ScrollView, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../../context/AuthContext';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { TabHeader } from '@/components/TabHeader';
import { UserInfoCard } from '@/components/Profile/UserInfoCard';
import { ProfileOptionsGroup } from '@/components/Profile/ProfileOptionsGroup';
import { ProfileOptionRowProps } from '@/components/Profile/ProfileOptionRow';


type AgentProfile = {
  fullName: string;
  email: string;
  licenseNumber: string;
  specialization: string;
  experienceYears: number;
  officeAddress: string;
};

export default function ProfileScreen() {
  const { t } = useTranslation();
  const router = useRouter(); // Inizializza router
  const { logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<AgentProfile | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Funzionalità temporaneamente disabilitata, in attesa della migrazione del servizio
      console.log("Fetch profile is temporarily disabled. Using mock data.");
      setProfile({
        fullName: "Mario Rossi",
        email: "mario.rossi@agent.com",
        licenseNumber: "12345-ABC",
        specialization: "Residenziale",
        experienceYears: 10,
        officeAddress: "Via Roma 1, Milano",
      });
    } catch (err: any) {
      setError("Could not load profile.");
    } finally {
      setIsLoading(false);
    }
  };

  // Funzione per il logout
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Errore durante il logout agente:', error);
      Alert.alert(t('common.error'), t('logout.error')); // Assumendo traduzioni esistenti
    }
  };

  if (isLoading) {
    return (
      <ThemedView className="flex-1 justify-center items-center">
        <ThemedText>{t('loading')}</ThemedText>
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
