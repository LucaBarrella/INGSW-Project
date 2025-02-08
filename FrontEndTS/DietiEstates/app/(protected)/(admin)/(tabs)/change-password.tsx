import { SafeAreaView, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ThemedView } from '@/components/ThemedView';
import { ApiService } from '@/app/_services/api.service';
import ChangePasswordForm from '@/components/ChangePasswordForm';
import { TabHeader } from '@/components/TabHeader';

export default function ChangePasswordScreen() {
  const { t } = useTranslation();

  const handleChangePassword = async ({ oldPassword, newPassword }: { oldPassword: string; newPassword: string }) => {
    const response = await fetch(ApiService.getEndpoint('adminChangePassword'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        oldPassword,
        newPassword,
      }),
    });

    if (!response.ok) {
      throw new Error(t('admin.screens.changePassword.error'));
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
