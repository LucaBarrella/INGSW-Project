import React from 'react';
import { TouchableOpacity, View, type ViewProps, Text } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { SocialButton } from './SocialButton';
import { Provider } from '@/src/dto/Provider';
import ThemedButton from './ThemedButton';
import { LabelInput } from './LabelInput';
import { useGoogleAuth } from '@/src/hooks/useGoogleAuth';
import { t } from 'i18next';

export type LoginFormProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

const LoginForm: React.FC<LoginFormProps> = ({ lightColor, darkColor, ...props }) => {
  const { login, error: authError, loginWithProvider, navigateToRegister, validationErrors, resetValidationErrors } = useAuth();
  const background = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const text = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const cardBackground = useThemeColor({ light: lightColor, dark: darkColor }, 'loginCardBackground');
  const labelColor = useThemeColor({ light: lightColor, dark: darkColor }, 'loginCardLabel');

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const { promptAsync, idToken, error: googleError } = useGoogleAuth();

  React.useEffect(() => {
    if (idToken) {
      loginWithProvider('google', idToken);
    }
  }, [idToken]);

  React.useEffect(() => {
    // L'errore viene ora gestito centralmente
  }, [email, password]);

  const handleLogin = async () => {
    await login({ email, password });
  };

  // authError viene fornito come stringa dall'hook; manteniamo compatibilità con altri error shapes
  const error = authError || googleError || null;

  return (
    <ThemedView className="transform scale-90 md:scale-100 max-w-md p-8 rounded-2xl w-10/12 shadow-lg mt-[12%] mb-[10%]" style={{ backgroundColor: cardBackground }} {...props}>
      <ThemedText className="py-5 text-center" style={{ fontSize: 36, color: labelColor, lineHeight: 36 }}>
        {t('auth.screens.login.title')}
      </ThemedText>
      <ThemedText className="text-lg mb-6 text-center" style={{ color: labelColor }}>
        {t('auth.screens.login.subtitle')}
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
        onChangeText={(text) => {
          setEmail(text);
          resetValidationErrors?.('email');
        }}
        error={!!validationErrors.email}
        errorMessage={validationErrors.email}
      />

      <LabelInput
        type="password"
        textColor={text}
        lightColor={cardBackground}
        darkColor={cardBackground}
        inputBackgroundColor={background}
        className="mb-6"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          resetValidationErrors?.('password');
        }}
        error={!!validationErrors.password}
        errorMessage={validationErrors.password}
      />

      <ThemedButton
        title="Entra"
        onPress={handleLogin}
        borderRadius={8}
        className="min-h-[40px]"
      />

      {/* Pulsanti social sempre visibili (unificazione accesso) */}
      <>
        <ThemedText className="text-base mt-3 mb-3 text-center" style={{ color: labelColor }}>{t('auth.screens.login.orContinueWith')}</ThemedText>
        <View className="items-center mb-3">
          <SocialButton provider={Provider.Google} onPress={() => promptAsync()} lightColor='#FFFFFF' darkColor='#FFFFFF' />
        </View>
        <View className="flex-row justify-center mt-3">
          <ThemedText style={{ color: labelColor }}>{t('auth.screens.login.noAccount')}</ThemedText>
          <TouchableOpacity onPress={navigateToRegister}>
            <ThemedText className="text-blue-500 underline font-bold" style={{ color: labelColor }}>
              {t('auth.screens.login.register')}
            </ThemedText>
          </TouchableOpacity>
        </View>
      </>
    </ThemedView>
  );
};

export default LoginForm;
