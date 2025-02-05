import React, { useState } from 'react';
import { type ViewProps } from 'react-native';
import { useTranslation } from 'react-i18next';
import { LabelInput } from './LabelInput';
import ThemedButton from './ThemedButton';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';

type UserType = 'admin' | 'agent';

interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  phone?: string;
  specialization?: string;
  licenseNumber?: string;
  atecoCode?: string;
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
    specialization: '',
    licenseNumber: '',
    atecoCode: ''
  });
  const [error, setError] = useState<string>('');

  const handleInputChange = (field: keyof UserFormData, value: string): void => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  };

  const handleSubmit = async () => {
    try {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.birthDate) {
        setError(t('forms.errors.fillRequired'));
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError(t('forms.errors.invalidEmail'));
        return;
      }

      if (userType === 'agent') {
        if (!formData.phone || !formData.licenseNumber) {
          setError(t('forms.errors.agentRequiredFields'));
          return;
        }
      }

      await onSubmit(formData);
    } catch (error) {
      setError(error instanceof Error ? error.message : t('forms.errors.unknownError'));
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
            label={t('forms.labels.specialization')}
            value={formData.specialization}
            onChangeText={(value: string) => handleInputChange('specialization', value)}
            textColor={text}
            lightColor={cardBackground}
            darkColor={cardBackground}
            inputBackgroundColor={background}
            className="mb-6"
          />
          <LabelInput
            label={t('forms.labels.licenseNumber')}
            value={formData.licenseNumber}
            onChangeText={(value: string) => handleInputChange('licenseNumber', value)}
            required
            textColor={text}
            lightColor={cardBackground}
            darkColor={cardBackground}
            inputBackgroundColor={background}
            className="mb-6"
          />
          <LabelInput
            label={t('forms.labels.atecoCode')}
            value={formData.atecoCode}
            onChangeText={(value: string) => handleInputChange('atecoCode', value)}
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
    </ThemedView>
  );
}
