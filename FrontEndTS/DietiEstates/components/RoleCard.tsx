import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
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
}

export const RoleCard: React.FC<RoleCardProps> = ({
  title,
  description,
  iconUrl,
  onSelect,
  accessibilityLabel,
  iconSize = 48
}) => {
  const backgroundColor = useThemeColor({ light: undefined, dark: undefined }, 'roleCardBackground');
  const textColor = useThemeColor({ light: undefined, dark: undefined }, 'roleCardText');

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
      style={[styles.container, { backgroundColor }]}
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

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
    transform: [{ translateY: 0 }],
    cursor: 'pointer',
    shadowColor: 'rgba(0,0,0,0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
});