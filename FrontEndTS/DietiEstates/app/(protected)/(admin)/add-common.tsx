import React, { useState } from 'react';
import { Alert, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useManagerHook } from '@/src/hooks/useManagerHook';
import UserCreationForm from '@/components/UserCreationForm';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ManagerService } from '@/src/services/ManagerService';
import { ManagerRepository } from '@/src/repositories/ManagerRepository';
import { CreateUserRequest } from '@/src/dto/request/CreateUserRequest.dto';
import { router } from 'expo-router';

interface AddUserProps {
    addingType: 'agent' | 'admin';
}

const AddUser: React.FC<AddUserProps> = ({ addingType }) => {
  const { t } = useTranslation();
  const [error, setError] = useState<string>('');
  const { handleCreateAdmin, handleCreateAgent } = useManagerHook(new ManagerService(new ManagerRepository()));
  const loading = false;
  const viewModelError = null;

  const handleAgent = async (data: CreateUserRequest) => {
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
    
    
    const handleAdmin = async (data: CreateUserRequest) => {
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
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-4">
        <ThemedView className="px-2 pt-4">
          <ThemedText className="text-gray-500 text-sm">
            {addingType === 'admin'
              ? t('admin.screens.addAdmin.subtitle')
              : t('admin.screens.addAgent.subtitle')}
          </ThemedText>
        </ThemedView>
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
    </ThemedView>
  );
}

export default AddUser;