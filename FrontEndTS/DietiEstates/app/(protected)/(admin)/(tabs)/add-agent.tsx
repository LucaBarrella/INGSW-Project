import React, { useState } from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useManagerHook } from '@/src/hooks/useManagerHook';
import UserCreationForm from '@/components/UserCreationForm';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { TabHeader } from '@/components/TabHeader';
import { ManagerService } from '@/src/services/ManagerService';
import { managerRepository } from '@/src/repositories/ManagerRepository';

export default function AddAgentScreen() {
  const { t } = useTranslation();
  const [error, setError] = useState<string>('');
  const { handleCreateAgent } = useManagerHook(new ManagerService(new managerRepository()));
  const loading = false;
  const viewModelError = null;

  return (
    <ThemedView className="flex-1">
      <SafeAreaView />
      <TabHeader 
        title={t('admin.screens.addAgent.title')}
        subtitle={t('admin.screens.addAgent.subtitle')}
      />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-4">
        <ThemedView className="flex-1 justify-center items-center py-6">
          {error || viewModelError ? (
            <ThemedText className="text-red-500 mb-4">{error || viewModelError}</ThemedText>
          ) : null}
          <UserCreationForm
            userType="agent"
            onSubmit={(data) => handleCreateAgent(data, setError)}
            isLoading={loading}
          />
        </ThemedView>
      </ScrollView>
      <SafeAreaView />
    </ThemedView>
  );
}
