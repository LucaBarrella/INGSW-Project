import React from 'react';
import { TouchableOpacity, View, Alert, type ViewProps } from 'react-native';
import * as SecureStore from 'expo-secure-store'; // Import SecureStore
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { SocialButton } from './SocialButton';
import { Provider } from '@/types/Provider';
import ThemedButton from './ThemedButton';
import { LabelInput } from './LabelInput';
import { useRouter } from 'expo-router';
import ApiService from '@/app/_services/api.service'; // Import default export

// Chiave per salvare/recuperare il token JWT da SecureStore (deve corrispondere a quella in httpClient.ts)
const TOKEN_KEY = 'user_auth_token';

export type LoginFormProps = ViewProps & {
  userType: 'admin' | 'agent' | 'buyer';
  lightColor?: string;
  darkColor?: string;
};

const getHeaderText = (userType: 'admin' | 'agent' | 'buyer'): string => {
  if (userType === 'admin') return 'Admin Access';
  if (userType === 'agent') return 'Agent Access';
  return 'Welcome Back';
};

const getSubHeaderText = (userType: 'admin' | 'agent' | 'buyer'): string => {
  if (userType === 'admin') return 'Authenticate to access the admin panel';
  if (userType === 'agent') return 'Authenticate to access the agent panel';
  return 'Sign in to continue';
};

const LoginForm: React.FC<LoginFormProps> = ({ userType, lightColor, darkColor, ...props }) => {
  const router = useRouter();
  const background = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const text = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const cardBackground = useThemeColor({ light: lightColor, dark: darkColor }, 'loginCardBackground');
  const labelColor = useThemeColor({ light: lightColor, dark: darkColor }, 'loginCardLabel');

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [authCode, setAuthCode] = React.useState('');

  const handleLogin = async () => {
    // Validazione input base
    if (!email || !password || (userType !== 'buyer' && !authCode)) {
      Alert.alert('Errore', 'Per favore, compila tutti i campi richiesti.');
      return;
    }

    try {
      let responseData: any; // Tipo da definire in base alla risposta API
      const credentials = { email, password };

      switch (userType) {
        case 'admin':
          // TODO: Verificare se l'API adminLogin richiede anche authCode
          responseData = await ApiService.loginAdmin(credentials);
          break;
        case 'agent':
          // TODO: Verificare se l'API agentLogin richiede anche authCode (REA Number?)
          // Se sì, passare { ...credentials, reaNumber: authCode } o simile
          responseData = await ApiService.loginAgent(credentials);
          break;
        default: // buyer
          responseData = await ApiService.loginUser(credentials);
      }

      // Assumendo che la risposta contenga un token JWT nella proprietà 'token'
      const token = responseData?.token;

      if (token) {
        // Salva il token JWT in SecureStore
        await SecureStore.setItemAsync(TOKEN_KEY, token);
        console.log('Token salvato con successo!'); // Log per debug

        // Naviga alla sezione protetta appropriata
        if (userType === 'admin') {
          router.push('/(protected)/(admin)/home');
        } else {
          // Assicurati che i nomi delle cartelle corrispondano (es. 'buyer', 'agent')
          // Naviga alla home della tab bar specifica per il ruolo
          router.push(`/(protected)/(${userType})/(tabs)/home`);
        }
      } else {
        // Token non trovato nella risposta
        console.error('Token non trovato nella risposta API:', responseData);
        Alert.alert('Errore Login', 'Token di autenticazione non ricevuto dal server.');
      }

    } catch (error: any) {
      console.error('Errore durante il login:', error);
      // Gestione più specifica degli errori Axios
      if (error.response) {
        // Errore restituito dal backend (es. 401, 400)
        const status = error.response.status;
        const message = error.response.data?.message || 'Credenziali non valide o errore del server.';
        Alert.alert(`Errore ${status}`, message);
      } else if (error.request) {
        // Errore di rete o nessuna risposta
        Alert.alert('Errore di Rete', 'Impossibile connettersi al server. Controlla la tua connessione e riprova.');
      } else {
        // Altro errore (es. configurazione Axios)
        Alert.alert('Errore', 'Si è verificato un errore imprevisto durante il login.');
      }
    }
  };

  return (
    <ThemedView className="transform scale-90 md:scale-100 max-w-md p-8 rounded-2xl w-10/12 shadow-lg mt-[12%] mb-[10%]" style={{ backgroundColor: cardBackground }} {...props}>
      <ThemedText className="py-5 text-center" style={{ fontSize: 36, color: labelColor }}>
        {getHeaderText(userType)}
      </ThemedText>
      <ThemedText className="text-lg mb-6 text-center" style={{ color: labelColor }}>
        {getSubHeaderText(userType)}
      </ThemedText>

      <LabelInput
        type="email"
        textColor={text}
        lightColor={cardBackground}
        darkColor={cardBackground}
        inputBackgroundColor={background}
        className="mb-6"
        value={email}
        onChangeText={setEmail}
      />

      <LabelInput
        type="password"
        textColor={text}
        lightColor={cardBackground}
        darkColor={cardBackground}
        inputBackgroundColor={background}
        className="mb-6"
        value={password}
        onChangeText={setPassword}
      />

      {userType !== 'buyer' && (
        <LabelInput
          type="default"
          label={userType === 'admin' ? 'Authentication Code' : 'REA Number'}
          textColor={text}
          lightColor={cardBackground}
          darkColor={cardBackground}
          inputBackgroundColor={background}
          className="mb-6"
          value={authCode}
          onChangeText={setAuthCode}
          placeholder={userType === 'admin' ? 'Enter your authentication code' : 'Enter your REA number'}
        />
      )}

      <ThemedButton
        title="Enter"
        onPress={handleLogin} 
        borderRadius={8}
        className="min-h-[40px]"
      />

      {userType === 'buyer' && (
        <>
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
            <ThemedText style={{ color: labelColor }}>Don't have an account yet? </ThemedText>
            <TouchableOpacity onPress={() => router.push('/(auth)/(buyer)/register')}>
              <ThemedText className="text-blue-500 underline font-bold" style={{ color: labelColor }}>
                Sign up
              </ThemedText>
            </TouchableOpacity>
          </View>
        </>
      )}
    </ThemedView>
  );
};

export default LoginForm;
