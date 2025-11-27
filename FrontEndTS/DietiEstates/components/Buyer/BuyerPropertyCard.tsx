import React from 'react';
import { View } from 'react-native';
import { PropertyCard } from '@/components/Agent/PropertyListing/PropertyCard';
import { PropertyDetail } from '@/components/Agent/PropertyDashboard/types'; // Importa il tipo unificato

interface BuyerPropertyCardProps {
  property: PropertyDetail;
  lightColor?: string;
  darkColor?: string;
  onPress: () => void;
}

export const BuyerPropertyCard: React.FC<BuyerPropertyCardProps> = ({
  property,
  lightColor,
  darkColor,
  onPress
}) => {

  return (
    <View className="relative">
      <PropertyCard
        property={property}
        onPress={onPress}
        lightColor={lightColor}
        darkColor={darkColor}
      />
    </View>
  );
};
