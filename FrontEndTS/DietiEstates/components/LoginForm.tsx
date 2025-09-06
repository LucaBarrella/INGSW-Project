import React from 'react';
import { TouchableOpacity, View, Alert, type ViewProps, Text } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { SocialButton } from './SocialButton';
import { Provider } from '@/types/Provider';
import ThemedButton from './ThemedButton';
import { LabelInput } from './LabelInput';
import { useRouter } from 'expo-router';

export type LoginFormProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

const LoginForm: React.FC<LoginFormProps> = ({ lightColor, darkColor, ...props }) => {
  const router = useRouter();
  const { signIn, error, clearError } = useAuth();
  const background = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const text = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const cardBackground = useThemeColor({ light: lightColor, dark: darkColor }, 'loginCardBackground');
  const labelColor = useThemeColor({ light: lightColor, dark: darkColor }, 'loginCardLabel');

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  React.useEffect(() => {
    if (error) {
      // Clear the error when the component mounts or if the user starts typing
      clearError();
    }
  }, [email, password]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Errore', 'Per favore, compila tutti i campi richiesti.');
      return;
    }
    try {
      // Nuovo signIn unificato: non richiede più userType
      await signIn({ email, password });
    } catch (err) {
      console.error('Errore nel componente LoginForm durante il login:', err);
    }
  };

  return (
    <ThemedView className="transform scale-90 md:scale-100 max-w-md p-8 rounded-2xl w-10/12 shadow-lg mt-[12%] mb-[10%]" style={{ backgroundColor: cardBackground }} {...props}>
      <ThemedText className="py-5 text-center" style={{ fontSize: 36, color: labelColor }}>
        Accedi
      </ThemedText>
      <ThemedText className="text-lg mb-6 text-center" style={{ color: labelColor }}>
        Benvenuto — accedi per continuare
      </ThemedText>

      {error && (
        <Text style={{ color: 'red', textAlign: 'center', marginBottom: 10 }}>
          {error}
        </Text>
      )}

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

      <ThemedButton
        title="Entra"
        onPress={handleLogin}
        borderRadius={8}
        className="min-h-[40px]"
      />

      {/* Pulsanti social sempre visibili (unificazione accesso) */}
      <>
        <ThemedText className="text-base mt-3 mb-3 text-center" style={{ color: labelColor }}>o continua con:</ThemedText>
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
          <ThemedText style={{ color: labelColor }}>Non hai un account? </ThemedText>
          <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
            <ThemedText className="text-blue-500 underline font-bold" style={{ color: labelColor }}>
              Registrati
            </ThemedText>
          </TouchableOpacity>
        </View>
      </>
    </ThemedView>
  );
};

export default LoginForm;
