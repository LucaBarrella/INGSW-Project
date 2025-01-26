import React from 'react';
import { TouchableOpacity, View, type ViewProps } from 'react-native';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { SocialButton } from './SocialButton';
import { Provider } from '@/types/Provider';
import ThemedButton from './ThemedButton';
import { LabelInput } from './LabelInput';
import { useNavigation } from '@react-navigation/native';

export type LoginFormProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

const LoginForm: React.FC<LoginFormProps> = ({ lightColor, darkColor, ...props }) => {
  const navigation = useNavigation();
  const background = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const text = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const cardBackground = useThemeColor({ light: lightColor, dark: darkColor }, 'loginCardBackground');
  const labelColor = useThemeColor({ light: lightColor, dark: darkColor }, 'loginCardLabel');

  return (
    <ThemedView className="transform scale-90 md:scale-100 max-w-md p-8 rounded-2xl w-10/12 shadow-lg mt-[12%] mb-[10%]" style={{ backgroundColor: cardBackground }} {...props}>
      <ThemedText className="py-5 text-center" style={{ fontSize: 36, color: labelColor }}>Welcome Back</ThemedText>
      <ThemedText className="text-lg mb-6 text-center" style={{ color: labelColor }}>Sign in to continue</ThemedText>
      <LabelInput
        type="email"
        textColor={text}
        lightColor={cardBackground}
        darkColor={cardBackground}
        inputBackgroundColor={background}
        className="mb-6"
      />
      <LabelInput
        type="password"
        textColor={text}
        lightColor={cardBackground}
        darkColor={cardBackground}
        inputBackgroundColor={background}
        className="mb-6"
      />
      <ThemedButton
        title="Sign In"
        onPress={() => console.log('Sign In pressed')}
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
        <ThemedText style={{ color: labelColor }}>Don't have an account yet? </ThemedText>
          {/* //TODO FIX THIS! */}
          <TouchableOpacity onPress={() => navigation.navigate('(buyer)/register' as never)}>
            <ThemedText className="text-blue-500 underline font-bold" style={{ color: labelColor }}>
              Sign up
            </ThemedText>
          </TouchableOpacity>
      </View>
    </ThemedView>
  );
};

export default LoginForm;