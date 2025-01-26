import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, Text } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedIcon } from './ThemedIcon';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Provider } from '@/types/Provider'; // Importa l'enum Provider

interface SocialButtonProps extends TouchableOpacityProps {
  provider: Provider;
  onPress: () => void;
  lightColor?: string;
  darkColor?: string;
}

const ICON_SIZE = 24;

const iconMapping: Record<Provider, string> = {
  [Provider.Google]: 'devicon:google',
  [Provider.Meta]: 'lineicons:meta-alt',
  [Provider.GitHub]: 'lineicons:github',
  [Provider.Apple]: 'lineicons:apple-brand',
  // Aggiungi altri mapping se necessario
};

const renderGoogleText = () => (
  <Text style={{ marginLeft: 20 }}>
    <Text style={{ color: '#4285F4' }}>G</Text>
    <Text style={{ color: '#EA4335' }}>o</Text>
    <Text style={{ color: '#FBBC05' }}>o</Text>
    <Text style={{ color: '#4285F4' }}>g</Text>
    <Text style={{ color: '#34A853' }}>l</Text>
    <Text style={{ color: '#EA4335' }}>e</Text>
  </Text>
);

export const SocialButton: React.FC<SocialButtonProps> = ({
  provider,
  onPress,
  lightColor,
  darkColor,
  ...props
}) => {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'roleCardBackground');
  const textColor = useThemeColor({ light: darkColor, dark: lightColor }, 'roleCardText');
  const iconName = iconMapping[provider] || 'lineicons:emoji-sad'; // Default icon

  return (
    <TouchableOpacity
      onPress={onPress}
      accessibilityLabel={`Accedi con ${provider}`}
      accessibilityRole="button"
      className="flex-row items-center justify-start px-6 py-3 rounded-lg shadow-md w-48 h-12 mb-4"
      style={{ backgroundColor }}
      {...props}
    >
      <ThemedIcon
        icon={iconName}
        size={ICON_SIZE}
        darkColor={textColor}
        lightColor={textColor}
        accessibilityLabel={`Icona per ${provider}`}
        className="mr-2"
      />
      {provider === Provider.Google ? (
        renderGoogleText()
      ) : (
        <ThemedText
          style={{ color: textColor }}
          className="flex-1 text-left pl-6"
        >
          {provider}
        </ThemedText>
      )}
    </TouchableOpacity>
  );
};