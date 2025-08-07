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
      await signIn({ email, password }, userType);
    } catch (err) {
      console.error('Errore nel componente LoginForm durante il login:', err);
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
