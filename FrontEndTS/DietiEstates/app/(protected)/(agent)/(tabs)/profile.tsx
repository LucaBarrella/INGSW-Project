import React, { useState, useEffect } from 'react';
import { ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { TabHeader } from '@/components/TabHeader';
import ApiService from '@/app/_services/api.service';
import { useThemeColor } from '@/hooks/useThemeColor';

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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<AgentProfile | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch(ApiService.endpoints.agentProfile);
      
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      // Using mock data for development
      setProfile({
        fullName: 'Mario Rossi',
        email: 'mario.rossi@dietiestates.com',
        licenseNumber: 'AG12345',
        specialization: 'Luxury Properties',
        experienceYears: 8,
        officeAddress: 'Via Roma 123, Milano'
      });
    } finally {
      setIsLoading(false);
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
        </ScrollView>
      )}
    </ThemedView>
  );
}
