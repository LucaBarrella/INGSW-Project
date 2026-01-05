import * as React from 'react';
import { TouchableOpacity, Image, View, Animated } from 'react-native';
import { useRef } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedIcon } from '@/components/ThemedIcon';
import { PropertyDetail } from '@/components/Agent/PropertyDashboard/types';
import { KeyStatsDisplay, mapPropertyDetailToCharacteristics } from '@/components/Property/PropertyCharacteristicsDisplay';
import { useThemeColor } from '@/hooks/useThemeColor';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import { formatPrice, getPropertyImage, safeGetAddress } from '@/src/utils/uiHelpers';

interface PropertyCardProps {
  property: PropertyDetail;
  onPress: () => void;
  lightColor?: string;
  darkColor?: string;
  showCharacteristics?: boolean;
}

const getStatusBadgeStyle = (condition: string) => {
  switch (condition) {
    case 'NEW':
      return { bg: '#E0F2FE', text: '#0369A1' };
    case 'GOOD_CONDITION':
    case 'RENOVATED':
      return { bg: '#DCFCE7', text: '#15803D' };
    case 'TO_BE_RENOVATED':
    case 'POOR_CONDITION':
      return { bg: '#FEF3C7', text: '#B45309' };
    case 'UNDER_CONSTRUCTION':
      return { bg: '#F3E8FF', text: '#7E22CE' };
    default:
      return { bg: '#F3F4F6', text: '#374151' };
  }
};

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onPress,
  lightColor,
  darkColor,
  showCharacteristics = true
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

  const tintColor = useThemeColor({ light: lightColor, dark: darkColor }, 'tint');

  // Animazione di pressione
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 20,
      bounciness: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 10,
    }).start();
  };

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

  const { t } = useTranslation();

  const statusStyle = getStatusBadgeStyle(property.condition);
  const address = safeGetAddress(property.address);
  
  // Titolo Tecnico (Tipologia • Città): es. "Trilocale • Napoli"
  const category = t('property_category.sub.' + property.propertyCategory) || property.propertyCategory;
  const roomsCount = property.numberOfRooms || (property as any).rooms;
  
  let roomLabel = category;
  if (roomsCount) {
    const key = roomsCount === 1 ? 'one' : roomsCount === 2 ? 'two' : roomsCount === 3 ? 'three' : 'other';
    roomLabel = t(`addProperty.rooms_count.${key}`, { count: roomsCount });
  }
  const smartTitle = `${roomLabel} • ${address.city}`;

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        className="rounded-3xl overflow-hidden mb-6 mx-1 bg-white dark:bg-slate-900"
        style={{
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.15,
          shadowRadius: 20,
        }}
        accessibilityRole="button"
        accessibilityLabel={`Visualizza dettagli per ${smartTitle}`}
      >
      <View className="relative">
        <Image
          source={{ uri: getPropertyImage(property) }}
          className="w-full h-64"
          resizeMode="cover"
        />
        
        {/* Badge Stato Overlay Soft */}
        <View
          className="absolute top-4 left-4 px-3 py-1.5 rounded-full border border-white/10"
          style={{ backgroundColor: statusStyle.bg + 'E6' }} // 90% opacità
        >
          <ThemedText
            className="text-[10px] font-medium capitalize"
            style={{ color: statusStyle.text }}
          >
            {t('property_status.' + property.condition).toLowerCase()}
          </ThemedText>
        </View>
      </View>
      
      <ThemedView className="p-5" style={{ backgroundColor }}>
        
        {/* Titolo e Prezzo (Legge della Vicinanza) - Allineamento alla Baseline & Overflow Patch */}
        <View className="flex-row justify-between items-baseline mb-2">
          <View className="flex-1 mr-4">
            <ThemedText
              className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
                {smartTitle}
            </ThemedText>
          </View>
          
          <View className="flex-row items-baseline flex-shrink-0">
            <ThemedText
                className="text-sm font-bold mr-0.5"
                style={{ color: tintColor }}
            >
                €
            </ThemedText>
            <ThemedText
                className="text-2xl font-black"
                style={{ color: tintColor }}
            >
                {property.price.toLocaleString('it-IT')}
            </ThemedText>
          </View>
        </View>

        <ThemedText
          className="text-sm opacity-50 font-medium mb-4"
          lightColor={detailColor}
          darkColor={detailColor}
          numberOfLines={1}
        >
            {address.display}
        </ThemedText>

        {/* Griglia Icone Compatta con divisori verticali */}
        {showCharacteristics && (
          <View className="flex-row items-center pt-4 border-t border-slate-100 dark:border-slate-800">
             <KeyStatsDisplay property={mapPropertyDetailToCharacteristics(property)} isCompact />
          </View>
        )}

        {/* Footer Action Button - Spostato in basso */}
        <View
          className="mt-5 flex-row items-center justify-center py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50"
        >
          <ThemedText
            className="text-sm font-bold mr-2"
            style={{ color: tintColor }}
          >
            Visualizza Dettagli
          </ThemedText>
          <ThemedIcon
            icon="lucide:chevron-right"
            size={16}
            lightColor={tintColor}
            darkColor={tintColor}
            accessibilityLabel="Vedi dettagli"
          />
        </View>
      </ThemedView>
    </TouchableOpacity>
    </Animated.View>
  );
};
