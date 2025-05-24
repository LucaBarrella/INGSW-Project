import React from 'react';
import { TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedIcon } from '@/components/ThemedIcon';
import { useThemeColor } from '@/hooks/useThemeColor';

export interface ProfileOptionRowProps {
  id: string;
  title: string;
  icon: string;
  onPress: () => void;
  isFirst?: boolean;
}

export const ProfileOptionRow: React.FC<ProfileOptionRowProps> = ({
  id,
  title,
  icon,
  onPress,
  isFirst = false,
}) => {
  const borderColor = useThemeColor({}, 'border');
  const textColor = useThemeColor({}, 'text'); // Colore per l'icona

  return (
    <TouchableOpacity
      key={id}
      onPress={onPress}
      className="flex-row items-center p-4" // Rimosso bg-white
      style={{
        borderTopWidth: isFirst ? 0 : 1,
        borderTopColor: borderColor,
      }}
    >
      <ThemedIcon
        icon={icon}
        size={24}
        accessibilityLabel={title}
        lightColor={textColor} // Applica il colore del testo all'icona per tema chiaro
        darkColor={textColor} // Applica il colore del testo all'icona per tema scuro
      />
      <ThemedText className="flex-1 text-base ml-4">
        {title}
      </ThemedText>
      <ThemedIcon
        icon="material-symbols:chevron-right"
        size={24}
        accessibilityLabel="Vai" // Potrebbe essere reso più specifico se necessario
      />
    </TouchableOpacity>
  );
};