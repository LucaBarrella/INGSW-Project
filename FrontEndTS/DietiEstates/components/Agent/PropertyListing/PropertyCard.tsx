import * as React from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { PropertyDetail } from '@/components/Agent/PropertyDashboard/types'; // Importa il tipo unificato
import { useThemeColor } from '@/hooks/useThemeColor';
import * as Haptics from 'expo-haptics';
import ThemedButton from '@/components/ThemedButton';

interface PropertyCardProps {
  property: PropertyDetail; // Usa il tipo unificato
  onPress: () => void;
  lightColor?: string;
  darkColor?: string;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onPress,
  lightColor,
  darkColor
}) => {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor }, 
    'propertyCardBackground'
  );
  const textColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    'propertyCardText'
  )
  const detailColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    'propertyCardDetail'
  );

  const handlePress = async () => {
    if (Haptics.impactAsync) {
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch (error) {
        console.error('Haptics not supported on this device', error);
      }
    }
    onPress();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="rounded-xl shadow-md overflow-hidden"
      accessibilityRole="button"
      accessibilityLabel={`Visualizza dettagli per ${property.title}`}
    >
      <Image
        // Usa un placeholder se imageUrl non è definito
        source={{ uri: property.imageUrl || 'https://picsum.photos/seed/placeholder/800/600' }}
        className="w-full h-48"
        resizeMode="cover"
      />
      
      <ThemedView className="p-4" style={{ backgroundColor }}>
        <ThemedText 
          type="subtitle" 
          className="text-lg mb-2 leading-8"
          lightColor={textColor}
          darkColor={textColor}
        >
          {property.title}
        </ThemedText>
        
        <ThemedText 
          type="description"
          className="text-sm mb-4"
          lightColor={detailColor}
          darkColor={detailColor}
        >
          {property.address}
        </ThemedText>

        <ThemedView className="flex-row justify-between items-center" style={{ backgroundColor }}>
          <ThemedText 
            type="defaultSemiBold" 
            className="text-xl"
            style={{ color: textColor }}
          >
            €{property.price} {/* Visualizza direttamente la stringa del prezzo */}
          </ThemedText>
          <ThemedButton
            title="Dettagli"
            onPress={handlePress}
            borderRadius={10}
            className="px-4 py-2 rounded-md"
          />
        </ThemedView>
      </ThemedView>
    </TouchableOpacity>
  );
};
