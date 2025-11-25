import React, { useState } from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import UserCreationForm from '@/components/UserCreationForm';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { TabHeader } from '@/components/TabHeader';
// import { useUsersViewModel } from '@/src/hooks/useUsersViewModel';

export default function AddAdminScreen() {
  const { t } = useTranslation();
  const [error, setError] = useState<string>('');
  const router = useRouter();

  // const { createAdmin, loading, error: viewModelError } = useUsersViewModel();
  const loading = false;
  const viewModelError = null;

  const handleCreateAdmin = async (data: any) => {
    // TODO: Definire un tipo specifico per i dati dell'admin (es. AdminCreationData)
    console.log('Admin creation temporarily disabled.');
    setError('Admin creation is temporarily disabled.');
  };

  return (
    <ThemedView className="flex-1">
      <SafeAreaView />
      <TabHeader 
        title={t('admin.screens.addAdmin.title')}
        subtitle={t('admin.screens.addAdmin.subtitle')}
      />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-4">
        <ThemedView className="flex-1 justify-center items-center py-6">
          {error || viewModelError ? (
            <ThemedText className="text-red-500 mb-4">{error || viewModelError}</ThemedText>
          ) : null}
          <UserCreationForm
            userType="admin"
            onSubmit={handleCreateAdmin}
            isLoading={loading}
          />          
        </ThemedView>
      </ScrollView>
      <SafeAreaView />
    </ThemedView>
  );
}
