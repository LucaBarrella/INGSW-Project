import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { PropertyCard } from '@/components/Agent/PropertyListing/PropertyCard';
import { PropertyDetail } from '@/components/Agent/PropertyDashboard/types'; // Importa il tipo unificato

interface BuyerPropertyCardProps {
  property: PropertyDetail; // Usa il tipo unificato
  onPress: () => void;
  lightColor?: string;
  darkColor?: string;
}

export const BuyerPropertyCard: React.FC<BuyerPropertyCardProps> = ({
  property,
  onPress,
  lightColor,
  darkColor
}) => {
  const router = useRouter();

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
    </View>
  );
};
