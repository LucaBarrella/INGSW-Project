import React, { useState } from 'react';
import { type ViewProps } from 'react-native';
import { useTranslation } from 'react-i18next';
import { LabelInput } from './LabelInput';
import ThemedButton from './ThemedButton';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { ConfirmationDialog } from './ConfirmationDialog';
import { useThemeColor } from '@/hooks/useThemeColor';

type UserType = 'admin' | 'agent';

interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  phone?: string;
  REANumber?: string;
}

interface UserCreationFormProps extends ViewProps {
  userType: UserType;
  onSubmit: (data: UserFormData) => Promise<void>;
  isLoading?: boolean;
  lightColor?: string;
  darkColor?: string;
}

export default function UserCreationForm({ 
  userType, 
  onSubmit, 
  isLoading = false, 
  lightColor,
  darkColor,
  ...props 
}: Readonly<UserCreationFormProps>) {
  const { t } = useTranslation();
  const background = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const text = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const cardBackground = useThemeColor({ light: lightColor, dark: darkColor }, 'loginCardBackground');
  
  const [formData, setFormData] = useState<UserFormData>({
    firstName: '',
    lastName: '',
    email: '',
    birthDate: '',
    phone: '',
    REANumber: '',
  });
  const [error, setError] = useState<string>('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleInputChange = (field: keyof UserFormData, value: string): void => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.birthDate) {
      setError(t('forms.errors.fillRequired'));
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError(t('forms.errors.invalidEmail'));
      return false;
    }

    if (userType === 'agent') {
      if (!formData.phone || !formData.REANumber) {
        setError(t('forms.errors.agentRequiredFields'));
        return false;
      }
    }

    return true;
  };

  const handleConfirm = async () => {
    try {
      await onSubmit(formData);
      // Reset form on success
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        birthDate: '',
        phone: '',
        REANumber: '',
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : t('forms.errors.unknownError'));
    } finally {
      setShowConfirmation(false);
    }
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setShowConfirmation(true);
    }
  };

  const createLabel = userType === 'admin' ? t('forms.buttons.createAdmin') : t('forms.buttons.createAgent');
  const buttonTitleFinal = isLoading ? t('forms.messages.creating') : createLabel;

  return (
    <ThemedView 
      className="transform scale-90 md:scale-100 max-w-md p-8 rounded-2xl w-10/12 shadow-lg"
      style={{ backgroundColor: cardBackground }}
      {...props}
    >
      {error ? (
        <ThemedText className="text-red-500 mb-4">{error}</ThemedText>
      ) : null}

      <LabelInput
        label={t('forms.labels.firstName')}
        value={formData.firstName}
        onChangeText={(value: string) => handleInputChange('firstName', value)}
        required
        textColor={text}
        lightColor={cardBackground}
        darkColor={cardBackground}
        inputBackgroundColor={background}
        className="mb-6"
      />
      <LabelInput
        label={t('forms.labels.lastName')}
        value={formData.lastName}
        onChangeText={(value: string) => handleInputChange('lastName', value)}
        required
        textColor={text}
        lightColor={cardBackground}
        darkColor={cardBackground}
        inputBackgroundColor={background}
        className="mb-6"
      />
      <LabelInput
        label={t('forms.labels.email')}
        value={formData.email}
        onChangeText={(value: string) => handleInputChange('email', value)}
        keyboardType="email-address"
        autoCapitalize="none"
        required
        textColor={text}
        lightColor={cardBackground}
        darkColor={cardBackground}
        inputBackgroundColor={background}
        className="mb-6"
      />
      <LabelInput
        label={t('forms.labels.birthDate')}
        value={formData.birthDate}
        onChangeText={(value: string) => handleInputChange('birthDate', value)}
        placeholder="YYYY-MM-DD"
        required
        textColor={text}
        lightColor={cardBackground}
        darkColor={cardBackground}
        inputBackgroundColor={background}
        className="mb-6"
      />

      {userType === 'agent' && (
        <>
          <LabelInput
            label={t('forms.labels.phone')}
            value={formData.phone}
            onChangeText={(value: string) => handleInputChange('phone', value)}
            keyboardType="phone-pad"
            required
            textColor={text}
            lightColor={cardBackground}
            darkColor={cardBackground}
            inputBackgroundColor={background}
            className="mb-6"
          />
          <LabelInput
            label={t('forms.labels.REANumber')}
            value={formData.REANumber}
            onChangeText={(value: string) => handleInputChange('REANumber', value)}
            required
            textColor={text}
            lightColor={cardBackground}
            darkColor={cardBackground}
            inputBackgroundColor={background}
            className="mb-6"
          />
        </>
      )}
      <ThemedButton
        onPress={handleSubmit}
        disabled={isLoading}
        borderRadius={8}
        className={`min-h-[40px] ${isLoading ? 'opacity-50' : ''}`}
        title={buttonTitleFinal}
      />

      <ConfirmationDialog
        visible={showConfirmation}
        onConfirm={handleConfirm}
        onCancel={() => setShowConfirmation(false)}
        messageKey={userType === 'admin' ? 'createAdmin' : 'createAgent'}
      />
    </ThemedView>
  );
}
