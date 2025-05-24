import React from 'react';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedIcon } from '@/components/ThemedIcon';
import { useThemeColor } from '@/hooks/useThemeColor';

interface UserInfoCardProps {
  name: string;
  email: string;
  role?: string; // Ruolo è opzionale, non tutti gli utenti potrebbero averlo visualizzato
  iconName?: string; // Icona utente personalizzabile
  iconLabel?: string;
}

export const UserInfoCard: React.FC<UserInfoCardProps> = ({
  name,
  email,
  role,
  iconName = "mdi:account-circle", // Icona di default
  iconLabel = "User profile",
}) => {
  const borderColor = useThemeColor({}, 'border');
  const textColor = useThemeColor({}, 'text'); // Colore per l'icona

  return (
    <ThemedView
      className="p-4 mb-6 rounded-lg items-center" // Rimosso bg-white
      style={{ borderWidth: 1, borderColor }}
    >
      <ThemedIcon
        icon={iconName}
        size={60}
        accessibilityLabel={iconLabel}
        lightColor={textColor} // Applica il colore del testo all'icona per tema chiaro
        darkColor={textColor} // Applica il colore del testo all'icona per tema scuro
      />
      <ThemedText type="subtitle" className="mt-2">
        {name}
      </ThemedText>
      <ThemedText className="text-gray-600 dark:text-gray-400"> {/* Ripristinato text-gray-600 e aggiunto dark mode variant */}
        {email}
      </ThemedText>
      {role && (
        <ThemedText className="text-gray-600 dark:text-gray-400 mt-1"> {/* Ripristinato text-gray-600 e aggiunto dark mode variant */}
          {role}
        </ThemedText>
      )}
    </ThemedView>
  );
};