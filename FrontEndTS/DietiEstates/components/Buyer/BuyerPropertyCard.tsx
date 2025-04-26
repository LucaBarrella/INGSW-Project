import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { PropertyCard } from '@/components/Agent/PropertyListing/PropertyCard';
import { ThemedIcon } from '@/components/ThemedIcon';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Property } from '@/components/Agent/PropertyListing/types';

interface BuyerPropertyCardProps {
  property: Property;
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
  const favoriteColor = useThemeColor({}, 'tint');

  return (
    <View className="relative">
      <PropertyCard
        property={property}
        onPress={onPress}
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
