import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { PropertyCard } from '@/components/Agent/PropertyListing/PropertyCard';
import { ThemedIcon } from '@/components/ThemedIcon';
import { useThemeColor } from '@/hooks/useThemeColor';
import { PropertyDetail } from '@/components/Agent/PropertyDashboard/types'; // Importa il tipo unificato

interface BuyerPropertyCardProps {
  property: PropertyDetail; // Usa il tipo unificato
  onPress: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  lightColor?: string;
  darkColor?: string;
}

export const BuyerPropertyCard: React.FC<BuyerPropertyCardProps> = ({
  property,
  onPress,
  isFavorite = false,
  onToggleFavorite,
  lightColor,
  darkColor
}) => {
  const router = useRouter();
  const favoriteColor = useThemeColor({}, 'tint');

  const handleDetailsPress = () => {
    router.push({
      pathname: '/(protected)/(buyer)/property-detail',
      params: { propertyId: property.id },
    });
    onPress();
  };

  return (
    <View className="relative">
      <PropertyCard
        property={property}
        onPress={handleDetailsPress}
        lightColor={lightColor}
        darkColor={darkColor}
      />
      {onToggleFavorite && (
        <TouchableOpacity
          onPress={onToggleFavorite}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm"
          accessibilityLabel={isFavorite ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
        >
          <ThemedIcon
            icon={isFavorite ? 'material-symbols:favorite-rounded' : 'material-symbols:favorite-outline-rounded'}
            size={24}
            accessibilityLabel="Preferiti"
            lightColor={favoriteColor}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};
