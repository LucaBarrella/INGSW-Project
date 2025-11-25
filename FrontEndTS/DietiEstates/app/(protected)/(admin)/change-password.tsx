import React from 'react';
import { SafeAreaView, ScrollView, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ThemedView } from '@/components/ThemedView';
import ChangePasswordForm from '@/components/ChangePasswordForm';
import { TabHeader } from '@/components/TabHeader';
import { useManagerHook } from '@/src/hooks/useManagerHook';
import { ManagerRepository } from '@/src/repositories/ManagerRepository';
import { ManagerService } from '@/src/services/ManagerService';
import { ThemedText } from '@/components/ThemedText';
import { router } from 'expo-router';
import { ChangePasswordDTOWithConfirm } from '@/src/dto/request/ChangePasswordWithConfirm.dto';

export default function ChangePasswordScreen() {
  const { t } = useTranslation();
  const [error, setError] = React.useState<string>('');

  const { handleChangePassword } = useManagerHook(new ManagerService(new ManagerRepository()));

  const handle = async (data: ChangePasswordDTOWithConfirm) : Promise<boolean> => {
    try {
      const response = await handleChangePassword(data, setError);
      if (response) {
        Alert.alert(t('admin.screens.changePassword.successTitle'), t('admin.screens.changePassword.successMessage'));
        router.back();
        return true;
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      return false;
    }
  };

  return (
    <ThemedView className="flex-1">
      <SafeAreaView />
      <TabHeader
        title={t('admin.screens.changePassword.title')}
        subtitle={t('admin.screens.changePassword.subtitle')}
      />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-4">
        <ThemedView className="flex-1 justify-center items-center py-6">
          {error && <ThemedText className="text-red-500 mb-4">{error}</ThemedText>}
          <ChangePasswordForm
            userType="admin"
            onSubmit={handle}
          />
        </ThemedView>
      </ScrollView>
      <SafeAreaView />
    </ThemedView>
  );
}
