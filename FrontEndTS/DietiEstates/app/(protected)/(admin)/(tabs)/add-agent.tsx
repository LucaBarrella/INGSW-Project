import React, { useState } from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import UserCreationForm from '@/components/UserCreationForm';
import ApiService from '@/app/_services/api.service';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { TabHeader } from '@/components/TabHeader';

export default function AddAgentScreen() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const router = useRouter();

  const handleCreateAgent = async (data: any) => {
    // TODO: Definire un tipo specifico per i dati dell'agente (es. AgentCreationData)
    setIsLoading(true);
    setError('');
    try {
      console.log('Creating agent with data:', data); // Log per debug
      // Utilizza la funzione del servizio API
      await ApiService.createAgent(data);

      // Successo: torna indietro
      console.log('Agent created successfully');
      router.back();
    } catch (err) {
      console.error('Error creating agent:', err);
      // Mostra l'errore restituito da httpClient/ApiService o un messaggio generico
      setError(err instanceof Error ? err.message : t('admin.screens.addAgent.error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView className="flex-1">
      <SafeAreaView />
      <TabHeader 
        title={t('admin.screens.addAgent.title')}
        subtitle={t('admin.screens.addAgent.subtitle')}
      />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-4">
        <ThemedView className="flex-1 justify-center items-center py-6">
          {error ? (
            <ThemedText className="text-red-500 mb-4">{error}</ThemedText>
          ) : null}
          <UserCreationForm
            userType="agent"
            onSubmit={handleCreateAgent}
            isLoading={isLoading}
          />
        </ThemedView>
      </ScrollView>
      <SafeAreaView />
    </ThemedView>
  );
}
