import React, { useState } from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import UserCreationForm from '@/components/UserCreationForm';
import ApiService from '@/app/services/api.service';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function AddAgentScreen() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const router = useRouter();

  const handleCreateAgent = async (data: any) => {
    try {
      setIsLoading(true);
      setError('');

      const response = await fetch(ApiService.endpoints.agentCreate, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || t('admin.screens.addAgent.error'));
      }

      // Success
      router.back(); // Return to previous screen after successful creation
    } catch (error) {
      setError(error instanceof Error ? error.message : t('unknownError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView className="flex-1">
      <SafeAreaView/>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
          <ThemedView className="flex-1 justify-center items-center p-4">
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
      <SafeAreaView/>
    </ThemedView>
  );
}
