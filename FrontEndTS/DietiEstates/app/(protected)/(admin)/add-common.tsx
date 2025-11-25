import React, { useState } from 'react';
import { Alert, SafeAreaView, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useManagerHook } from '@/src/hooks/useManagerHook';
import UserCreationForm from '@/components/UserCreationForm';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { TabHeader } from '@/components/TabHeader';
import { ManagerService } from '@/src/services/ManagerService';
import { managerRepository } from '@/src/repositories/ManagerRepository';
import { SignupRequestAgent } from '@/src/dto/request/SignupRequestAgent.dto';
import { router } from 'expo-router';

interface AddUserProps {
    addingType: 'agent' | 'admin';
}

export const AddUser: React.FC<AddUserProps> = ({ addingType }) => {
  const { t } = useTranslation();
  const [error, setError] = useState<string>('');
  const { handleCreateAdmin, handleCreateAgent } = useManagerHook(new ManagerService(new managerRepository()));
  const loading = false;
  const viewModelError = null;

  const handleAgent = async (data: SignupRequestAgent) => {
      try {
        const response = await handleCreateAgent(data, setError);
        if (response) {
          Alert.alert(t('admin.screens.addAgent.successTitle'), t('admin.screens.addAgent.successMessageAgentCreation'));
          router.back();
        }
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred.');
      }
    };
    
    
    const handleAdmin = async (data: SignupRequestAgent) => {
    try {
        const response = await handleCreateAdmin(data, setError);
        if (response) {
        Alert.alert(t('admin.screens.addAdmin.successTitle'), t('admin.screens.addAdmin.successMessageAdminCreation'));
        router.back();
        }
    } catch (err: any) {
        setError(err.message || 'An unexpected error occurred.');
    }
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
            userType={addingType}
            onSubmit={addingType === 'admin' ? handleAdmin : handleAgent}
            isLoading={loading}
          />
        </ThemedView>
      </ScrollView>
      <SafeAreaView />
    </ThemedView>
  );
}
