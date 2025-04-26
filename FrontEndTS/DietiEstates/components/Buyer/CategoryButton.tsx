import React from 'react';
import { TouchableOpacity } from 'react-native';
import { ThemedIcon } from '@/components/ThemedIcon';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';

interface CategoryButtonProps {
  icon: string;
  label: string;
  onPress: () => void;
}

export const CategoryButton: React.FC<CategoryButtonProps> = ({
  icon,
  label,
  onPress
}) => {
  const backgroundColor = useThemeColor({}, 'buttonBackground');
  const buttonTextColor = useThemeColor({}, 'buttonTextColor');
  
  return (
    <TouchableOpacity 
      onPress={onPress}
      className="items-center justify-center p-4 rounded-lg shadow-sm active:opacity-80 active:scale-95"
      style={{ backgroundColor }}
      accessibilityLabel={`Cerca proprietà di tipo ${label}`}
      accessibilityRole="button"
    >
      <ThemedIcon 
        icon={icon}
        size={32} 
        accessibilityLabel={label}
      />
      <ThemedText 
        className="mt-2 text-sm text-center"
        style={{ color: buttonTextColor }}
      >
        {label}
      </ThemedText>
    </TouchableOpacity>
  );
};
