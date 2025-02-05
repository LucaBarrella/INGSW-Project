import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ThemedView } from '../../../components/ThemedView';
import { ApiService } from '@/app/services/api.service';
import ChangePasswordForm from '../../../components/ChangePasswordForm';

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
    <ThemedView style={styles.container}>
      <ChangePasswordForm 
        userType="admin"
        onSubmit={handleChangePassword}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
