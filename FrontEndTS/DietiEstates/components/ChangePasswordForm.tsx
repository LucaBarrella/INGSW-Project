import React, { useState } from 'react';
import { Alert, StyleSheet, type ViewProps } from 'react-native';
import { ThemedView } from './ThemedView';
import { LabelInput } from './LabelInput';
import ThemedButton from './ThemedButton';
import { ConfirmationDialog } from './ConfirmationDialog';
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
  const [showConfirmation, setShowConfirmation] = useState(false);

  const validateForm = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', t('forms.errors.fillRequired'));
      return false;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', t('forms.errors.passwordsDontMatch'));
      return false;
    }

    if (newPassword === currentPassword) {
      Alert.alert('Error', t('forms.errors.passwordSame'));
      return false;
    }

    if (newPassword.length < 8) {
      Alert.alert('Error', t('forms.errors.passwordTooShort'));
      return false;
    }

    return true;
  };

  const handleConfirm = async () => {
    try {
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
      setShowConfirmation(false);
    }
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setShowConfirmation(true);
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

      <ConfirmationDialog
        visible={showConfirmation}
        onConfirm={handleConfirm}
        onCancel={() => setShowConfirmation(false)}
        messageKey="changePassword"
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({});

export default ChangePasswordForm;
