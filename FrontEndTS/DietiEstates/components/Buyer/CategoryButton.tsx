import React from 'react';
import { TouchableOpacity } from 'react-native';
import { ThemedIcon } from '@/components/ThemedIcon';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';

interface CategoryButtonProps {
  icon: string;
  label: string;
  onPress: () => void;
  isSelected?: boolean; // Aggiunta prop isSelected
}

export const CategoryButton: React.FC<CategoryButtonProps> = ({
  icon,
  label,
  onPress,
  isSelected = false // Default a false
}) => {
  // Colori per stato non selezionato
  const unselectedBackgroundColor = useThemeColor({}, 'tabBarBackground');
  const unselectedBorderColor = useThemeColor({}, 'tabBarBackground');
  const unselectedIconColor = useThemeColor({}, 'text');
  const unselectedTextColor = useThemeColor({}, 'text');

  // Colori per stato selezionato (ispirati da Step1_PropertyType)
  const selectedBackgroundColor = useThemeColor({ light: '#E8F0FE', dark: '#1A365D' }, 'tint');
  const selectedBorderColor = useThemeColor({ light: '#4A90E2', dark: '#60A5FA' }, 'tint');
  const selectedIconColor = useThemeColor({ light: '#4A90E2', dark: '#60A5FA' }, 'tint');
  const selectedTextColor = useThemeColor({}, 'tint'); // Usa tint come testo primario selezionato

  // Determina colori e stili basati su isSelected
  const currentBackgroundColor = isSelected ? selectedBackgroundColor : unselectedBackgroundColor;
  const currentBorderColor = isSelected ? selectedBorderColor : unselectedBorderColor;
  const currentIconColor = isSelected ? selectedIconColor : unselectedIconColor;
  const currentTextColor = isSelected ? selectedTextColor : unselectedTextColor;
  const currentBorderWidth = isSelected ? 1.5 : 1;

  return (
    <TouchableOpacity
      onPress={onPress}
      // Manteniamo le classi di layout originali, ma aggiungiamo il bordo
      // Nota: Step1 usava w-[48%] aspect-square, qui usiamo p-4. Il layout potrebbe necessitare aggiustamenti nel componente padre.
      className="items-center justify-center p-4 rounded-lg border active:opacity-80 active:scale-95"
      style={{
        backgroundColor: currentBackgroundColor,
        borderColor: currentBorderColor,
        borderWidth: currentBorderWidth,
      }}
      accessibilityLabel={`Seleziona tipo ${label}`} // Aggiornato accessibilityLabel
      accessibilityState={{ selected: isSelected }} // Aggiunto accessibilityState
      accessibilityRole="button"
    >
      <ThemedIcon
        icon={icon}
        size={32}
        accessibilityLabel="" // Label è già sul TouchableOpacity
        // Applica colori condizionali
        lightColor={currentIconColor}
        darkColor={currentIconColor}
      />
      <ThemedText
        className="mt-2 text-sm text-center font-medium" // Aggiunto font-medium come in Step1
        style={{ color: currentTextColor }}
      >
        {label}
      </ThemedText>
    </TouchableOpacity>
  );
};
