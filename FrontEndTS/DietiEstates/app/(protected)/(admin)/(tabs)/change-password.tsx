import React from 'react'; // Aggiunto import React
import { SafeAreaView, ScrollView, TouchableOpacity, Alert } from 'react-native'; // Aggiunto TouchableOpacity, Alert
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router'; // Aggiunto useRouter
import * as SecureStore from 'expo-secure-store'; // Aggiunto SecureStore
import { ThemedView } from '@/components/ThemedView';
import ApiService from '@/app/_services/api.service'; // Import default export
import ChangePasswordForm from '@/components/ChangePasswordForm';
import ThemedButton from '@/components/ThemedButton'; // Aggiunto ThemedButton
import { TabHeader } from '@/components/TabHeader';

// Chiave per recuperare/rimuovere il token JWT da SecureStore
const TOKEN_KEY = 'user_auth_token';

export default function ChangePasswordScreen() {
  const { t } = useTranslation();
  const router = useRouter(); // Inizializza router

  const handleChangePassword = async ({ oldPassword, newPassword }: { oldPassword: string; newPassword: string }) => {
    try {
      // Usa la nuova funzione da ApiService
      await ApiService.changeAdminPassword({ oldPassword, newPassword });
      Alert.alert(t('common.success'), t('admin.screens.changePassword.successMessage'));
      // TODO: Potrebbe essere utile svuotare i campi del form dopo il successo
    } catch (error: any) {
      console.error('Errore cambio password admin:', error);
      const errorMessage = error.response?.data?.message || t('admin.screens.changePassword.error');
      Alert.alert(t('common.error'), errorMessage);
    }
  };

  // Funzione per il logout
  const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      console.log('Token admin rimosso con successo!');
      router.replace('/(auth)'); // Torna alla schermata di selezione ruolo/login
    } catch (error) {
      console.error('Errore durante il logout admin:', error);
      Alert.alert(t('common.error'), t('logout.error')); // Assumendo che esista una traduzione per l'errore di logout
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
          {/* Pulsante Logout */}
          <ThemedButton
            title={t('logout.buttonTitle')} // Assumendo esista una traduzione per "Esci"
            onPress={handleLogout}
            // Usa colori rossi per indicare azione "danger"
            lightColor="#DC2626" // Esempio: red-600
            darkColor="#F87171"  // Esempio: red-400
            className="mt-8 w-full max-w-xs" // Aggiungi margine e larghezza
          />
        </ThemedView>
      </ScrollView>
      <SafeAreaView />
    </ThemedView>
  );
}
