import React from 'react';
import { Alert, type ViewProps } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import ThemedButton from './ThemedButton';
import { LabelInput } from './LabelInput';
import { useNavigation } from '@react-navigation/native';

export type LoginAdminProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

const LoginAdmin: React.FC<LoginAdminProps> = ({ lightColor, darkColor, ...props }) => {
  const navigation = useNavigation();
  const background = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const text = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const cardBackground = useThemeColor({ light: lightColor, dark: darkColor }, 'loginCardBackground');
  const labelColor = useThemeColor({ light: lightColor, dark: darkColor }, 'loginCardLabel');

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [authCode, setAuthCode] = React.useState('');

  const handleLogin = async () => {
    try {
      if (!email || !password || !authCode) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }

      const response = await fetch('http://localhost:8080/api/admins/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          authCode,
        }),
      });

      const token = await response.text();

      if (response.ok) {
        if (!token) {
          throw new Error('Token not found in response');
        }

        // Salva il JWT in AsyncStorage
        await AsyncStorage.setItem('jwtToken', token);

        // Naviga alla dashboard dell'amministratore
        navigation.navigate('(admin)/dashboard' as never);
      } else {
        Alert.alert('Access Failed', 'Invalid credentials or server error');
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to connect to the server. Please try again later.');
    }
  };

  return (
    <ThemedView className="transform scale-90 md:scale-100 max-w-md p-8 rounded-2xl w-10/12 shadow-lg mt-[12%] mb-[10%]" style={{ backgroundColor: cardBackground }} {...props}>
      <ThemedText className="py-5 text-center" style={{ fontSize: 36, color: labelColor }}>Admin Access</ThemedText>
      <ThemedText className="text-lg mb-6 text-center" style={{ color: labelColor }}>Authenticate to access the admin panel</ThemedText>

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

      <LabelInput
        type="default"
        label = "Authentication Code" 
        textColor={text}
        lightColor={cardBackground}
        darkColor={cardBackground}
        inputBackgroundColor={background}
        className="mb-6"
        value={authCode}
        onChangeText={setAuthCode}
        placeholder="Enter your authentication code"
      />

      <ThemedButton
        title="Enter"
        onPress={handleLogin}
        borderRadius={8}
        className="min-h-[40px]"
      />
    </ThemedView>
  );
};

export default LoginAdmin;
