import React from 'react';
import { TouchableOpacity, View, Alert, type ViewProps } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { SocialButton } from './SocialButton';
import { Provider } from '@/types/Provider';
import ThemedButton from './ThemedButton';
import { LabelInput } from './LabelInput';
import { useRouter } from 'expo-router';
import { ApiService } from '@/app/_services/api.service';

export type LoginFormProps = ViewProps & {
  userType: 'admin' | 'agent' | 'buyer';
  lightColor?: string;
  darkColor?: string;
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
    try {
      if (!email || !password || (userType !== 'buyer' && !authCode)) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }

      let endpoint: keyof typeof ApiService.endpoints;
      switch (userType) {
        case 'admin':
          endpoint = 'adminLogin';
          break;
        case 'agent':
          endpoint = 'agentLogin';
          break;
        default:
          endpoint = 'buyerLogin';
      }
      
      const body = userType === 'buyer' ? { email, password } : { email, password, authCode };

      const response = await fetch(ApiService.getEndpoint(endpoint), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const token = await response.text();

      if (response.ok) {
        if (!token) {
          throw new Error('Token not found in response');
        }

        // Salva il JWT in AsyncStorage
        await AsyncStorage.setItem('jwtToken', token);

        // Naviga alla sezione appropriata
        router.push(`/(protected)/(${userType})/home` as any);
      } else {
        Alert.alert('Access Failed', 'Invalid credentials or server error');
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to connect to the server. Please try again later.');
    }
  };

  return (
    <ThemedView className="transform scale-90 md:scale-100 max-w-md p-8 rounded-2xl w-10/12 shadow-lg mt-[12%] mb-[10%]" style={{ backgroundColor: cardBackground }} {...props}>
      <ThemedText className="py-5 text-center" style={{ fontSize: 36, color: labelColor }}>
        {userType === 'admin' ? 'Admin Access' : userType === 'agent' ? 'Agent Access' : 'Welcome Back'}
      </ThemedText>
      <ThemedText className="text-lg mb-6 text-center" style={{ color: labelColor }}>
        {userType === 'admin' ? 'Authenticate to access the admin panel' : userType === 'agent' ? 'Authenticate to access the agent panel' : 'Sign in to continue'}
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
