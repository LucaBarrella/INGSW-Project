import * as React from 'react';
import { TouchableOpacity, Image, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { PropertyDTO } from '@/components/Agent/PropertyDashboard/types';
import { PropertyCharacteristicsDisplay, mapPropertyDetailToCharacteristics } from '@/components/Property/PropertyCharacteristicsDisplay';
import { useThemeColor } from '@/hooks/useThemeColor';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import ThemedButton from '@/components/ThemedButton';

interface AgentPropertyCardProps {
  property: PropertyDTO;
  onPress: () => void;
  lightColor?: string;
  darkColor?: string;
}

export const AgentPropertyCard: React.FC<AgentPropertyCardProps> = ({
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
  );
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


  const placeholderImageUrl = 'https://placehold.co/600x400/000000/FFFFFF.webp?text=Image+Not+Found&font=Poppins';
  const { t } = useTranslation();
  
  return (
    <>
      <TouchableOpacity
        onPress={handlePress}
        className="rounded-xl shadow-md overflow-hidden"
        accessibilityRole="button"
        accessibilityLabel={`Visualizza dettagli per ${t('property_category.sub.'+property.propertyCategory)} in ${property.address.city}, ${t('property_status.'+property.condition)}`}
      >
        <Image
          source={{ uri: property.firstImageUrl || property.imageUrl || (property.images && property.images.length > 0 ? property.images[0] : null) || placeholderImageUrl }}
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
            {t('property_category.sub.'+property.propertyCategory)} in {property.address.city}, {t('property_status.'+property.condition)}
          </ThemedText>
          
          <ThemedText 
            type="description"
            className="text-sm mb-4"
            lightColor={detailColor}
            darkColor={detailColor}
          >
            {property.description}
          </ThemedText>

          {/* >>> INIZIO INTEGRAZIONE CARATTERISTICHE <<< */}
          <PropertyCharacteristicsDisplay property={mapPropertyDetailToCharacteristics(property)} />
          {/* >>> FINE INTEGRAZIONE CARATTERISTICHE <<< */}

          <ThemedView className="flex-row justify-between items-center" style={{ backgroundColor }}>
            <ThemedText 
              type="defaultSemiBold" 
              className="text-xl"
              style={{ color: textColor }}
            >
              €{property.price}
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </TouchableOpacity>
    </>
  );
};
