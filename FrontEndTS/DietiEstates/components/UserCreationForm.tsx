import React, { useState } from 'react';
import { type ViewProps, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { LabelInput } from './LabelInput';
import ThemedButton from './ThemedButton';
import { ThemedView } from './ThemedView';
import { ConfirmationDialog } from './ConfirmationDialog';
import { useThemeColor } from '@/hooks/useThemeColor';
import { CreateUserRequest } from '@/src/dto/request/CreateUserRequest.dto';


type UserType = 'admin' | 'agent';

interface UserCreationFormProps extends ViewProps {
  userType: UserType;
  onSubmit: (data: CreateUserRequest) => Promise<void>;
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
  
  const [formData, setFormData] = useState<CreateUserRequest>({
    name: '',
    surname: '',
    username: '',
    email: '',
    phone: '',
    licenseNumber: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CreateUserRequest, string>>>({});
  const [showConfirmation, setShowConfirmation] = useState(false);

  const validateField = (field: keyof CreateUserRequest, value: string) => {
    if (!value && ['name', 'surname', 'username', 'email'].includes(field)) {
      return t('forms.errors.fillRequired');
    }
    if (field === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return t('forms.errors.invalidEmail');
    }
    if (userType === 'agent') {
      if (!value && ['phone', 'licenseNumber'].includes(field)) {
        return t('forms.errors.fillRequired');
      }
    }
    return '';
  };

  const handleInputChange = (field: keyof CreateUserRequest, value: string): void => {
    setFormData(prev => ({ ...prev, [field]: value }));
    const error = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleConfirm = async () => {
    try {
      await onSubmit(formData);
      setFormData({
        name: '',
        surname: '',
        username: '',
        email: '',
        phone: '',
        licenseNumber: '',
      });
      setErrors({});
    } catch (error) {
      Alert.alert(t('error'), error instanceof Error ? error.message : t('forms.errors.unknownError'));
    } finally {
      setShowConfirmation(false);
    }
  };

  const handleSubmit = () => {
    const newErrors: Partial<Record<keyof CreateUserRequest, string>> = {};
    let hasErrors = false;

    (Object.keys(formData) as Array<keyof CreateUserRequest>).forEach(key => {
      const error = validateField(key, formData[key] || '');
      if (error) {
        newErrors[key] = error;
        hasErrors = true;
      }
    });

    setErrors(newErrors);
    if (!hasErrors) {
      setShowConfirmation(true);
    }
  };

  const createLabel = userType === 'admin' ? t('forms.buttons.createAdmin') : t('forms.buttons.createAgent');
  const buttonTitleFinal = isLoading ? t('forms.messages.creating') : createLabel;

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
        label={t('forms.labels.firstName')}
        value={formData.name}
        onChangeText={(value: string) => handleInputChange('name', value)}
        error={!!errors.name}
        errorMessage={errors.name}
        required
        textColor={text}
        lightColor={cardBackground}
        darkColor={cardBackground}
        inputBackgroundColor={background}
      />
      <LabelInput
        label={t('forms.labels.lastName')}
        value={formData.surname}
        onChangeText={(value: string) => handleInputChange('surname', value)}
        error={!!errors.surname}
        errorMessage={errors.surname}
        required
        textColor={text}
        lightColor={cardBackground}
        darkColor={cardBackground}
        inputBackgroundColor={background}
      />
      <LabelInput
        label={t('forms.labels.username')}
        value={formData.username}
        onChangeText={(value: string) => handleInputChange('username', value)}
        error={!!errors.username}
        errorMessage={errors.username}
        required
        textColor={text}
        lightColor={cardBackground}
        darkColor={cardBackground}
        inputBackgroundColor={background}
      />
      <LabelInput
        label={t('forms.labels.email')}
        value={formData.email}
        onChangeText={(value: string) => handleInputChange('email', value)}
        keyboardType="email-address"
        autoCapitalize="none"
        error={!!errors.email}
        errorMessage={errors.email}
        required
        textColor={text}
        lightColor={cardBackground}
        darkColor={cardBackground}
        inputBackgroundColor={background}
      />

      {userType === 'agent' && (
        <>
          <LabelInput
            label={t('forms.labels.phone')}
            value={formData.phone}
            onChangeText={(value: string) => handleInputChange('phone', value)}
            keyboardType="phone-pad"
            error={!!errors.phone}
            errorMessage={errors.phone}
            required
            textColor={text}
            lightColor={cardBackground}
            darkColor={cardBackground}
            inputBackgroundColor={background}
          />
          <LabelInput
            label={t('forms.labels.licenseNumber')}
            value={formData.licenseNumber}
            onChangeText={(value: string) => handleInputChange('licenseNumber', value)}
            error={!!errors.licenseNumber}
            errorMessage={errors.licenseNumber}
            required
            textColor={text}
            lightColor={cardBackground}
            darkColor={cardBackground}
            inputBackgroundColor={background}
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
