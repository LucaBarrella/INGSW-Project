import React from 'react';
import { View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedIcon } from '@/components/ThemedIcon';
import { PropertyDetail } from '@/components/Agent/PropertyDashboard/types';
import { useThemeColor } from '@/hooks/useThemeColor';

interface CharacteristicItemProps {
  iconName: string;
  value: string | number | boolean | undefined | null; // Aggiunto boolean
  unit?: string;
  label?: string; // Testo descrittivo per il valore booleano
}

const CharacteristicItem: React.FC<CharacteristicItemProps> = ({ iconName, value, unit, label }) => {
  // Se il valore è undefined o null, non renderizzare
  if (value === undefined || value === null) {
    return null;
  }

  const iconColor = useThemeColor({}, 'tint'); // Ottieni il colore 'tint' dal tema

  if (typeof value === 'boolean') {
    // Per i booleani, mostriamo il label e "Sì" o "No"
    return (
      <View className="flex-row items-center py-0.5">
        <ThemedIcon icon={iconName} size={24} className="mr-1.5" accessibilityLabel={iconName} lightColor={iconColor} darkColor={iconColor} />
        <ThemedText className="text-sm">{label}: {value ? 'Sì' : 'No'}</ThemedText>
      </View>
    );
  } else if (typeof value === 'string' && value === '') {
    // Non renderizzare stringhe vuote
    return null;
  }

  // Per numeri e stringhe non vuote
  return (
    <View className="flex-row items-center py-0.5">
      <ThemedIcon icon={iconName} size={24} className="mr-1.5" accessibilityLabel={iconName} lightColor={iconColor} darkColor={iconColor} />
      <ThemedText className="text-sm">{value}{unit ? ` ${unit}` : ''}</ThemedText>
    </View>
  );
};

export type PropertyType = "Residential" | "Commercial" | "Industrial" | "Land" | string;

export interface PropertyCharacteristicsData {
  propertyType: PropertyType;
  sqft?: number;
  energyClass?: string;
  bedrooms?: number;
  bathrooms?: number;
  emergencyExit?: boolean;
  fireSuppression?: boolean;
  ceilingHeight?: number;
  soilComposition?: string;
}

interface PropertyCharacteristicsDisplayProps {
  property: PropertyCharacteristicsData;
}

export const PropertyCharacteristicsDisplay: React.FC<PropertyCharacteristicsDisplayProps> = ({ property }) => {
  if (!property) return null;

  return (

    <View className="flex-row flex-wrap mt-2 gap-2.5 mb-4">
      <CharacteristicItem iconName="material-symbols:square-foot" value={property.sqft} unit="mq" />
      <CharacteristicItem iconName="material-symbols:flash-on" value={property.energyClass} />

      {property.propertyType === "residential" && (
        <>

          <CharacteristicItem iconName="material-symbols:bed" value={property.bedrooms} />
          <CharacteristicItem iconName="material-symbols:bathtub" value={property.bathrooms} />
        </>
      )}
      {property.propertyType === "commercial" && (
        <>
          <CharacteristicItem iconName="material-symbols:exit-to-app" label="Uscita Emergenza" value={property.emergencyExit} />
          <CharacteristicItem iconName="material-symbols:bathtub" value={property.bathrooms} />
        </>
      )}
      {property.propertyType === "industrial" && (
        <>
          <CharacteristicItem iconName="material-symbols:fire-extinguisher" label="Antincendio" value={property.fireSuppression} />
          <CharacteristicItem iconName="material-symbols:height" value={property.ceilingHeight} unit="m" />
        </>
      )}
      {property.propertyType === "land" && (
        <>
          <CharacteristicItem iconName="material-symbols:forest" value={property.soilComposition} />
        </>
      )}
    </View>
  );
};

export const mapPropertyDetailToCharacteristics = (
  propertyDetail: PropertyDetail
): PropertyCharacteristicsData => {
  const characteristics: PropertyCharacteristicsData = {
    propertyType: propertyDetail.type,
    sqft: propertyDetail.squareMeters,
    energyClass: propertyDetail.energyRating,
  };

  switch (propertyDetail.type) {
    case 'residential':
      // bedrooms e bathrooms sono già a livello radice in PropertyDetail
      characteristics.bedrooms = propertyDetail.bedrooms;
      characteristics.bathrooms = propertyDetail.bathrooms;
      break;
    case 'commercial':
      // bathrooms è già a livello radice in PropertyDetail
      characteristics.bathrooms = propertyDetail.bathrooms;
      // emergencyExit è un booleano
      characteristics.emergencyExit = propertyDetail.propertyDetails?.commercial?.emergencyExit;
      break;
    case 'industrial':
      // fireSystem è un booleano
      characteristics.fireSuppression = propertyDetail.propertyDetails?.industrial?.fireSystem;
      // ceilingHeight è una stringa, va convertita a numero
      const industrialCeilingHeight = propertyDetail.propertyDetails?.industrial?.ceilingHeight;
      characteristics.ceilingHeight = industrialCeilingHeight ? parseFloat(industrialCeilingHeight) : undefined;
      break;
    case 'land':
      // soilType è una stringa
      characteristics.soilComposition = propertyDetail.propertyDetails?.land?.soilType;
      break;
    default:
      break;
  }

  return characteristics;
};