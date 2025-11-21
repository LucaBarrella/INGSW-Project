import React from 'react';
import { SafeAreaView, ScrollView, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ThemedView } from '@/components/ThemedView';
import ChangePasswordForm from '@/components/ChangePasswordForm';
import { TabHeader } from '@/components/TabHeader';

export default function ChangePasswordScreen() {
  const { t } = useTranslation();

  const handleChangePassword = async (data: any) => {
    console.log('Change password functionality is temporarily disabled.');
    Alert.alert('Info', 'Change password functionality is temporarily disabled.');
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
          <ChangePasswordForm 
            userType="admin"
            onSubmit={handleChangePassword}
          />
        </ThemedView>
      </ScrollView>
      <SafeAreaView />
    </ThemedView>
  );
}
