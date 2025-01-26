import React from 'react';
import { TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedIcon } from './ThemedIcon';
import * as Haptics from 'expo-haptics';

interface RoleCardProps {
  title: string;
  description: string;
  iconUrl: string;
  onSelect: () => void;
  accessibilityLabel: string;
  iconSize?: number;
  lightColor?: string
  darkColor?: string
}

export const RoleCard: React.FC<RoleCardProps> = ({
  title,
  description,
  iconUrl,
  onSelect,
  accessibilityLabel,
  iconSize = 48,
  lightColor,
  darkColor
}) => {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'roleCardBackground');
  const textColor = useThemeColor({ light: lightColor, dark: darkColor }, 'roleCardText');

  const handlePress = async () => {
    if (Haptics.impactAsync) {
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
      } catch (error) {
        console.error('Haptics not supported on this device', error);
      }
    }
    onSelect();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      accessible={true}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      className={'flex flex-col items-center p-4 rounded-3xl shadow-md'}   
      style={{ backgroundColor }}
    >
      <ThemedIcon
        icon={iconUrl}
        size={iconSize}
        accessibilityLabel={`Icon for ${title}`}
      />
      
      <ThemedText type='subtitle' className="text-4xl font-bold" lightColor={textColor} darkColor={textColor}>
        {title}
      </ThemedText>
      <ThemedText type='description' className="text-sm font-light text-opacity-80 pb-2" lightColor={textColor} darkColor={textColor}>
        {description}
      </ThemedText>
    </TouchableOpacity>
  );
};