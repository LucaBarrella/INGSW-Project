import React, { useState } from 'react';
import { Alert, StyleSheet, type ViewProps } from 'react-native';
import { ThemedView } from './ThemedView';
import { LabelInput } from './LabelInput';
import ThemedButton from './ThemedButton';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useTranslation } from 'react-i18next';

export type ChangePasswordFormProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  userType: 'admin' | 'agent' | 'buyer';
  onSubmit: (data: { oldPassword: string; newPassword: string }) => Promise<void>;
};

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({
  lightColor,
  darkColor,
  userType,
  onSubmit,
  ...props
}) => {
  const background = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const text = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const cardBackground = useThemeColor({ light: lightColor, dark: darkColor }, 'loginCardBackground');
  const { t } = useTranslation();
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      // Validation
      if (!currentPassword || !newPassword || !confirmPassword) {
        Alert.alert('Error', t('forms.errors.fillRequired'));
        return;
      }

      if (newPassword !== confirmPassword) {
        Alert.alert('Error', t('forms.errors.passwordsDontMatch'));
        return;
      }

      if (newPassword === currentPassword) {
        Alert.alert('Error', t('forms.errors.passwordSame'));
        return;
      }

      // Password strength validation
      if (newPassword.length < 8) {
        Alert.alert('Error', t('forms.errors.passwordTooShort'));
        return;
      }

      setLoading(true);
      await onSubmit({
        oldPassword: currentPassword,
        newPassword: newPassword,
      });

      // Reset form on success
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      Alert.alert('Success', t('forms.messages.passwordChanged'));
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : t('admin.screens.changePassword.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView 
      className="transform scale-90 md:scale-100 max-w-md p-8 rounded-2xl w-10/12 shadow-lg"
      style={{ backgroundColor: cardBackground }}
      {...props}
    >
      <LabelInput
        type="password"
        label={t('forms.labels.currentPassword')}
        textColor={text}
        lightColor={cardBackground}
        darkColor={cardBackground}
        inputBackgroundColor={background}
        className="mb-6"
        value={currentPassword}
        onChangeText={setCurrentPassword}
        placeholder={t('forms.placeholders.currentPassword')}
      />

      <LabelInput
        type="password"
        label={t('forms.labels.newPassword')}
        textColor={text}
        lightColor={cardBackground}
        darkColor={cardBackground}
        inputBackgroundColor={background}
        className="mb-6"
        value={newPassword}
        onChangeText={setNewPassword}
        placeholder={t('forms.placeholders.newPassword')}
      />

      <LabelInput
        type="password"
        label={t('forms.labels.confirmPassword')}
        textColor={text}
        lightColor={cardBackground}
        darkColor={cardBackground}
        inputBackgroundColor={background}
        className="mb-6"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder={t('forms.placeholders.confirmPassword')}
      />

      <ThemedButton
        title={t('forms.buttons.changePassword')}
        onPress={handleSubmit}
        disabled={loading}
        borderRadius={8}
        className={`min-h-[40px] ${loading ? 'opacity-50' : ''}`}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({});

export default ChangePasswordForm;
