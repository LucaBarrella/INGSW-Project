import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { ThemedIcon } from './ThemedIcon';
import { ThemedText } from './ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import * as Haptics from 'expo-haptics';

interface IconButtonCardProps {
  title: string;
  iconUrl: string;
  onSelect: () => void;
  accessibilityLabel: string;
  iconSize?: number;
  lightColor?: string;
  darkColor?: string;
  className?: string;
  textDimensions?: number;
}

export const IconButtonCard: React.FC<IconButtonCardProps> = ({
  title,
  iconUrl,
  onSelect,
  accessibilityLabel,
  iconSize = 24,
  lightColor,
  darkColor,
  className,
  textDimensions = 14
}) => {

  const textColor = useThemeColor({ light: lightColor, dark: darkColor }, 'roleCardText');
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'roleCardBackground');

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
      className={`flex flex-col items-center p-4 rounded-3xl shadow-md ${className}`}
      style={{ backgroundColor }}
    >
      <View className="flex-row items-center gap-2">
        <ThemedIcon
          icon={iconUrl}
          size={iconSize}
          accessibilityLabel={`Icon for ${title}`}
          lightColor={textColor}
          darkColor={textColor}
        />
        <ThemedText style={{ fontSize: textDimensions, color: textColor }}>
          {title}
        </ThemedText>
      </View>
    </TouchableOpacity>
  );
};