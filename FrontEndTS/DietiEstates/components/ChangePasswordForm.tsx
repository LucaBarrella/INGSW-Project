import React, { useState } from 'react';
import { Alert, type ViewProps } from 'react-native';
import { ThemedView } from './ThemedView';
import { LabelInput } from './LabelInput';
import ThemedButton from './ThemedButton';
import { ConfirmationDialog } from './ConfirmationDialog';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useTranslation } from 'react-i18next';
import { ChangePasswordDTOWithConfirm } from '@/src/dto/request/ChangePasswordWithConfirm.dto';

export type ChangePasswordFormProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  userType: 'admin' | 'agent' | 'buyer';
  onSubmit: (data: ChangePasswordDTOWithConfirm) => Promise<boolean>;
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
  const [currentEmail, setCurrentEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConfirmation, setShowConfirmation] = useState(false);

  const validateField = (field: string, value: string) => {
    switch (field) {
      case 'email':
        if (!value) return t('forms.errors.fillRequired');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return t('forms.errors.invalidEmail');
        break;
      case 'currentPassword':
        if (!value) return t('forms.errors.fillRequired');
        break;
      case 'newPassword':
        if (!value) return t('forms.errors.fillRequired');
        if (value.length < 8) return t('forms.errors.passwordTooShort');
        if (value === currentPassword) return t('forms.errors.passwordSame');
        break;
      case 'confirmPassword':
        if (!value) return t('forms.errors.fillRequired');
        if (value !== newPassword) return t('forms.errors.passwordsDontMatch');
        break;
    }
    return '';
  };

  const handleFieldChange = (field: string, value: string, setter: (v: string) => void) => {
    setter(value);
    const error = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);
      const success = await onSubmit({
        email: currentEmail,
        oldPassword: currentPassword,
        newPassword: newPassword,
        confirmNewPassword: confirmPassword,
      });
      
      if (!success) {
        return;
      }

      // Reset form on success
      setCurrentEmail('');
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
    const newErrors: Record<string, string> = {
      email: validateField('email', currentEmail),
      currentPassword: validateField('currentPassword', currentPassword),
      newPassword: validateField('newPassword', newPassword),
      confirmPassword: validateField('confirmPassword', confirmPassword),
    };

    setErrors(newErrors);
    const hasErrors = Object.values(newErrors).some(error => error !== '');

    if (!hasErrors) {
      setShowConfirmation(true);
    }
  };

  return (
    <ThemedView
      className="max-w-md p-6 rounded-3xl w-full shadow-xl mb-10"
      style={{
        backgroundColor: cardBackground,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 5
      }}
      {...props}
    >
      <LabelInput
        type="email"
        label={t('forms.labels.email')}
        textColor={text}
        lightColor={cardBackground}
        darkColor={cardBackground}
        inputBackgroundColor={background}
        value={currentEmail}
        onChangeText={(v) => handleFieldChange('email', v, setCurrentEmail)}
        error={!!errors.email}
        errorMessage={errors.email}
        placeholder={t('forms.placeholders.email')}
      />
      <LabelInput
        type="password"
        label={t('forms.labels.currentPassword')}
        textColor={text}
        lightColor={cardBackground}
        darkColor={cardBackground}
        inputBackgroundColor={background}
        value={currentPassword}
        onChangeText={(v) => handleFieldChange('currentPassword', v, setCurrentPassword)}
        error={!!errors.currentPassword}
        errorMessage={errors.currentPassword}
        placeholder={t('forms.placeholders.currentPassword')}
      />

      <LabelInput
        type="password"
        label={t('forms.labels.newPassword')}
        textColor={text}
        lightColor={cardBackground}
        darkColor={cardBackground}
        inputBackgroundColor={background}
        value={newPassword}
        onChangeText={(v) => handleFieldChange('newPassword', v, setNewPassword)}
        error={!!errors.newPassword}
        errorMessage={errors.newPassword}
        placeholder={t('forms.placeholders.newPassword')}
      />

      <LabelInput
        type="password"
        label={t('forms.labels.confirmPassword')}
        textColor={text}
        lightColor={cardBackground}
        darkColor={cardBackground}
        inputBackgroundColor={background}
        value={confirmPassword}
        onChangeText={(v) => handleFieldChange('confirmPassword', v, setConfirmPassword)}
        error={!!errors.confirmPassword}
        errorMessage={errors.confirmPassword}
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

export default ChangePasswordForm;
