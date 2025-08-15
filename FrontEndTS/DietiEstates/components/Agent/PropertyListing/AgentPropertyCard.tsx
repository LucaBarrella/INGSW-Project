import * as React from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { PropertyDetail } from '@/components/Agent/PropertyDashboard/types';
import { PropertyCharacteristicsDisplay, mapPropertyDetailToCharacteristics } from '@/components/Property/PropertyCharacteristicsDisplay';
import { useThemeColor } from '@/hooks/useThemeColor';
import * as Haptics from 'expo-haptics';
import ThemedButton from '@/components/ThemedButton';
import { ConfirmationDialog } from '@/components/ConfirmationDialog';
import { useTranslation } from 'react-i18next';

interface AgentPropertyCardProps {
  property: PropertyDetail;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
  lightColor?: string;
  darkColor?: string;
}

export const AgentPropertyCard: React.FC<AgentPropertyCardProps> = ({
  property,
  onPress,
  onEdit,
  onDelete,
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

  const deleteColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    'error'
  );

  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = React.useState(false);

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

  const handleDeletePress = () => {
    setIsDeleteDialogVisible(true);
  };

  const handleConfirmDelete = () => {
    onDelete(); // Call the actual delete function passed from parent
    setIsDeleteDialogVisible(false);
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogVisible(false);
  };

  const placeholderImageUrl = 'https://placehold.co/600x400/000000/FFFFFF.webp?text=Image+Not+Found&font=Poppins';
  const { t } = useTranslation();
  
  return (
    <>
      <TouchableOpacity
        onPress={handlePress}
        className="rounded-xl shadow-md overflow-hidden"
        accessibilityRole="button"
        accessibilityLabel={`Visualizza dettagli per ${t('property_category.'+property.propertyCategory)} in ${property.address.city}, ${t('property_status.'+property.status)}`}
      >
        <Image
          source={{ uri: property.imageUrl || placeholderImageUrl }}
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
            {t('property_category.'+property.propertyCategory)} in {property.address.city}, {t('property_status.'+property.status)}
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
            <ThemedView className="flex-row gap-4 items-center" style={{ backgroundColor }}>
              <ThemedButton
                title="Modifica"
                onPress={onEdit}
                borderRadius={10}
                className="px-3 py-2 rounded-md"
              />
              <ThemedButton
                title="Elimina"
                onPress={handleDeletePress}
                borderRadius={10}
                className="px-3 py-2 rounded-md"
                lightColor={deleteColor}
                darkColor={deleteColor}
              />
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </TouchableOpacity>
      <ConfirmationDialog
        visible={isDeleteDialogVisible}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        customTitle="Conferma Eliminazione"
        customMessage={`Sei sicuro di voler eliminare l'immobile?`}
        confirmText="Elimina"
      />
    </>
  );
};
