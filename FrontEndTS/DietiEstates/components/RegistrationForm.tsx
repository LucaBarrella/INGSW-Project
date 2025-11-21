import React, { useState } from 'react';
import { View, ViewProps, TouchableOpacity} from 'react-native';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { LabelInput } from './LabelInput';
import ThemedButton from './ThemedButton';
import { SocialButton } from './SocialButton';
import { Provider } from '@/src/dto/Provider';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { User } from '@/src/entity/User'; // Importa l'interfaccia User
 
type RegistrationFormData = {
  username: string;
  name: string;
  surname: string;
  email: string;
  password: string;
};

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

  const router = useRouter();

  const background = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const text = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const cardBackground = useThemeColor({ light: lightColor, dark: darkColor }, 'loginCardBackground');
  const labelColor = useThemeColor({ light: lightColor, dark: darkColor }, 'loginCardLabel');

  const { register, error, validationErrors, resetValidationErrors, handlePostAuthNavigation } = useAuth();

  React.useEffect(() => {
    // La gestione degli errori ora è centralizzata nel context, non è più necessario clearError() qui
  }, [formData.email, formData.password, formData.name, formData.surname, formData.username]);

  const handleSubmit = async () => {
    console.log("Validation Errors before submit:", validationErrors); // Aggiunto log
    // Ora la validazione è gestita dentro useAuthHook.register.
    try {
      const success = await register({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        surname: formData.surname,
        username: formData.username,
      });

      if (success) {
        // La navigazione è gestita da handlePostAuthNavigation
        // Dopo un successo, lo stato isAuthenticated in useAuthHook dovrebbe essere true
        // e user dovrebbe contenere i dati dell'utente registrato.
        // Chiamiamo handlePostAuthNavigation con l'utente appena registrato.
        // Per ora, useremo un placeholder per l'utente, poiché register non lo restituisce direttamente.
        // Questo dovrà essere raffinato quando il backend restituirà l'oggetto User completo.
        handlePostAuthNavigation({} as User); // Placeholder
      }
    } catch (err) {
      console.error('Errore nel componente RegistrationForm durante la registrazione:', err);
    }
  };

  return (
    <ThemedView className="mt-[10%] mb-[10%] max-w-md p-8 rounded-2xl w-10/12 shadow-lg" style={{ backgroundColor: cardBackground }} {...props}>
      <ThemedText className="py-5 text-center" style={{ fontSize: 36, color: labelColor }}>Benvenuto</ThemedText>
      <ThemedText className="text-lg mb-6 text-center" style={{ color: labelColor }}>Registrati</ThemedText>

      {error && (
        <ThemedText style={{ color: 'red', textAlign: 'center', marginBottom: 10 }}>
          {error}
        </ThemedText>
      )}
      
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
          setFormData((prev: RegistrationFormData) => ({ ...prev, name: text }));
          resetValidationErrors('name');
        }}
        error={!!validationErrors.name}
        errorMessage={validationErrors.name}
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
          setFormData((prev: RegistrationFormData) => ({ ...prev, surname: text }));
          resetValidationErrors('surname');
        }}
        error={!!validationErrors.surname}
        errorMessage={validationErrors.surname}
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
          setFormData((prev: RegistrationFormData) => ({ ...prev, email: text }));
          resetValidationErrors('email');
        }}
        error={!!validationErrors.email}
        errorMessage={validationErrors.email}
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
          setFormData((prev: RegistrationFormData) => ({ ...prev, username: text }));
          resetValidationErrors('username');
        }}
        error={!!validationErrors.username}
        errorMessage={validationErrors.username}
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
          setFormData((prev: RegistrationFormData) => ({ ...prev, password: text }));
          resetValidationErrors('password');
        }}
        error={!!validationErrors.password}
        errorMessage={validationErrors.password}
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

      <View className="flex-row justify-center mt-3">
        <ThemedText style={{ color: labelColor }}>Have an account already? </ThemedText>
        <TouchableOpacity onPress={() => router.push('./login')}> 
          <ThemedText className="text-blue-500 underline font-bold" style={{ color: labelColor }}>
            Sign in
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
};

export default RegistrationForm;