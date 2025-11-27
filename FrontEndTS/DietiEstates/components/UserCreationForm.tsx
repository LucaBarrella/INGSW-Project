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

  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleInputChange = (field: keyof CreateUserRequest, value: string): void => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleConfirm = async () => {
    try {
      await onSubmit(formData);
      setShowConfirmation(true);
      // Reset form on success
      setFormData({
        name: '',
        surname: '',
        username: '',
        email: '',
        phone: '',
        licenseNumber: '',
      });
    } catch (error) {
      // setError(error instanceof Error ? error.message : t('forms.errors.unknownError')); // Set error if error state is used
      // Optionally, display the error using Alert or another mechanism
      Alert.alert(t('forms.errors.title'), error instanceof Error ? error.message : t('forms.errors.unknownError'));
    } finally {
      setShowConfirmation(false);
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

      <LabelInput
        label={t('forms.labels.firstName')}
        value={formData.name}
        onChangeText={(value: string) => handleInputChange('name', value)}
        required
        textColor={text}
        lightColor={cardBackground}
        darkColor={cardBackground}
        inputBackgroundColor={background}
        className="mb-6"
      />
      <LabelInput
        label={t('forms.labels.lastName')}
        value={formData.surname}
        onChangeText={(value: string) => handleInputChange('surname', value)}
        required
        textColor={text}
        lightColor={cardBackground}
        darkColor={cardBackground}
        inputBackgroundColor={background}
        className="mb-6"
      />
      <LabelInput
        label={t('forms.labels.username')}
        value={formData.username}
        onChangeText={(value: string) => handleInputChange('username', value)}
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
        </>
      )}
      <ThemedButton
        onPress={() => onSubmit(formData)}
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
