import React, { useState } from 'react';
import { View, ViewProps, TouchableOpacity, Alert } from 'react-native';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { LabelInput } from './LabelInput';
import ThemedButton from './ThemedButton';
import { SocialButton } from './SocialButton';
import { Provider } from '@/types/Provider';
import { useRouter } from 'expo-router';
import ApiService from '@/app/_services/api.service';

interface RegistrationFormData {
  username: string | undefined;
  name: string;
  surname: string;
  email: string;
  password: string;
}

interface ValidationErrors {
  username?: string;
  name?: string;
  surname?: string;
  email?: string;
  password?: string;
}

export type RegistrationFormProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

const RegistrationForm: React.FC<RegistrationFormProps> = ({ lightColor, darkColor, ...props }) => {
  const [formData, setFormData] = useState<RegistrationFormData>({
    username: '',
    name: '',
    surname: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const router = useRouter();

  const background = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const text = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const cardBackground = useThemeColor({ light: lightColor, dark: darkColor }, 'loginCardBackground');
  const labelColor = useThemeColor({ light: lightColor, dark: darkColor }, 'loginCardLabel');

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'Il nome è obbligatorio';
      isValid = false;
    }

    if (!formData.surname.trim()) {
      newErrors.surname = 'Il cognome è obbligatorio';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email è obbligatoria';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Inserisci un indirizzo email valido';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'La password è obbligatoria';
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = 'La password deve essere di almeno 8 caratteri';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const response = await ApiService.registerUser(formData);
      if (response.status < 300) {
        Alert.alert('Registrazione Completata', 'La registrazione è avvenuta con successo!', [
          { text: 'OK', onPress: () => router.push('/(auth)/(buyer)/login') }
        ]);
      } else {
        Alert.alert('Registrazione Fallita', response.statusText || 'Controlla i dati inseriti e riprova');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      Alert.alert('Errore', error.message || 'Si è verificato un errore');
    }
  };

  return (
    <ThemedView className="mt-[10%] mb-[10%] max-w-md p-8 rounded-2xl w-10/12 shadow-lg" style={{ backgroundColor: cardBackground }} {...props}>
      <ThemedText className="py-5 text-center" style={{ fontSize: 36, color: labelColor }}>Benvenuto</ThemedText>
      <ThemedText className="text-lg mb-6 text-center" style={{ color: labelColor }}>Registrati</ThemedText>
      
      <LabelInput
        type="default"
        label="Nome"
        placeholder="Nome"
        textColor={text}
        lightColor={cardBackground}
        darkColor={cardBackground}
        inputBackgroundColor={background}
        value={formData.name}
        onChangeText={(text) => {
          setFormData(prev => ({ ...prev, name: text }));
          if (errors.name) {
            setErrors(prev => ({ ...prev, name: undefined }));
          }
        }}
        error={!!errors.name}
        className="mb-6"
      />

      <LabelInput
        type="default"
        label="Cognome"
        placeholder="Cognome"
        textColor={text}
        lightColor={cardBackground}
        darkColor={cardBackground}
        inputBackgroundColor={background}
        value={formData.surname}
        onChangeText={(text) => {
          setFormData(prev => ({ ...prev, surname: text }));
          if (errors.surname) {
            setErrors(prev => ({ ...prev, surname: undefined }));
          }
        }}
        error={!!errors.surname}
        className="mb-6"
      />

      <LabelInput
        type="email"
        label="Email"
        placeholder="Email"
        textColor={text}
        lightColor={cardBackground}
        darkColor={cardBackground}
        inputBackgroundColor={background}
        value={formData.email}
        onChangeText={(text) => {
          setFormData(prev => ({ ...prev, email: text }));
          if (errors.email) {
            setErrors(prev => ({ ...prev, email: undefined }));
          }
        }}
        error={!!errors.email}
        className="mb-6"
        autoCapitalize="none"
      />
      
      <LabelInput
        type="default"
        label="Username"
        placeholder="Username"
        textColor={text}
        lightColor={cardBackground}
        darkColor={cardBackground}
        inputBackgroundColor={background}
        value={formData.username}
        onChangeText={(text) => {
          setFormData(prev => ({ ...prev, username: text }));
          if (errors.username) {
            setErrors(prev => ({ ...prev, username: undefined }));
          }
        }}
        error={!!errors.username}
        className="mb-6"
        autoCapitalize="none"
      />

      <LabelInput
        type="password"
        label="Password"
        placeholder="Password"
        textColor={text}
        lightColor={cardBackground}
        darkColor={cardBackground}
        inputBackgroundColor={background}
        value={formData.password}
        onChangeText={(text) => {
          setFormData(prev => ({ ...prev, password: text }));
          if (errors.password) {
            setErrors(prev => ({ ...prev, password: undefined }));
          }
        }}
        error={!!errors.password}
        className="mb-6"
      />

      <ThemedButton
        title="Registrati"
        onPress={handleSubmit}
        borderRadius={8}
        className="min-h-[40px]"
      />

      <ThemedText className="text-base mt-3 mb-3 text-center" style={{ color: labelColor }}>or continue with:</ThemedText>
      
      <View className="items-center mb-3">
        <SocialButton provider={Provider.Google} onPress={() => console.log('Login con Google')} lightColor='#FFFFFF' darkColor='#FFFFFF' />
      </View>
      <View className="items-center mb-3">
        <SocialButton provider={Provider.Meta} onPress={() => console.log('Login con Meta')} lightColor='#FFFFFF' darkColor='#1877F2' />
      </View>
      <View className="items-center mb-3">
        <SocialButton provider={Provider.GitHub} onPress={() => console.log('Login con GitHub')} lightColor='#FFFFFF' darkColor='#333333' />
      </View>

      <View className="flex-row justify-center mt-3">
        <ThemedText style={{ color: labelColor }}>Have an account already? </ThemedText>
        <TouchableOpacity onPress={() => router.push('/(auth)/(buyer)/login')}> 
          <ThemedText className="text-blue-500 underline font-bold" style={{ color: labelColor }}>
            Sign in
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
};

export default RegistrationForm;