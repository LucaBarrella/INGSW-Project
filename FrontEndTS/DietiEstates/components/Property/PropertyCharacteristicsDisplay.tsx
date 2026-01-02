import React from 'react';
import { View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedIcon } from '@/components/ThemedIcon';
import { PropertyDetail } from '@/components/Agent/PropertyDashboard/types';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useTranslation } from 'react-i18next';

/**
 * Tipi di proprietà supportati dal sistema.
 */
export type PropertyType = "residential" | "commercial" | "garage" | "land" | string;

/**
 * Dati mappati per la visualizzazione delle caratteristiche.
 * Rappresenta i valori reali dell'immobile, non i filtri.
 */
export interface PropertyCharacteristicsData {
  propertyType: PropertyType;
  sqft?: number;
  energyClass?: string;
  condition?: string;
  yearBuilt?: number;
  
  // Residenziale / Comune
  bedrooms?: number;
  bathrooms?: number;
  rooms?: number;
  floor?: string;
  totalFloors?: number;
  hasElevator?: boolean;
  heating?: string;
  parkingSpaces?: number;
  hasGarden?: boolean;
  isFurnished?: boolean;

  // Commerciale
  emergencyExit?: boolean;
  wheelchairAccess?: boolean;
  
  // Garage
  hasSurveillance?: boolean;
  
  // Terreno
  soilComposition?: string;
  isAccessible?: boolean;
  slope?: string | number;
}

/**
 * Proprietà per il componente StatItem.
 */
interface StatItemProps {
  value: string | number;
  icon: string;
  unit?: string;
  label?: string;
}

/**
 * Componente per visualizzare un singolo dato statistico con icona.
 * 
 * @param {StatItemProps} props - Proprietà del componente.
 * @returns {JSX.Element}
 */
const StatItem: React.FC<StatItemProps> = ({ value, icon, unit, label }) => {
  const iconColor = useThemeColor({ light: '#6B7280', dark: '#9CA3AF' }, 'text');
  const textColor = useThemeColor({ light: '#6B7280', dark: '#9CA3AF' }, 'text');

  return (
    <View className="flex-row items-center mr-6 mb-2">
      <ThemedIcon 
        icon={icon} 
        size={18} 
        lightColor={iconColor} 
        darkColor={iconColor} 
        className="mr-4 opacity-70" 
        accessibilityLabel={label || 'stat'} 
      />
      <ThemedText 
        className="text-sm font-medium" 
        style={{ color: textColor }}
      >
        {value}{unit ? ` ${unit}` : ''}
      </ThemedText>
    </View>
  );
};

/**
 * Visualizza le statistiche chiave (Area, Locali, Bagni, Classe En.) in riga.
 * Mostra TUTTO ciò che è disponibile senza limiti.
 * 
 * @param {{ property: PropertyCharacteristicsData }} props - Dati della proprietà.
 * @returns {JSX.Element | null}
 */
export const KeyStatsDisplay: React.FC<{
  property: PropertyCharacteristicsData;
  isCompact?: boolean;
}> = ({ property, isCompact = false }) => {
  const stats: StatItemProps[] = [];

  if (property.sqft) {
    stats.push({
      value: isCompact ? `${property.sqft}m²` : property.sqft,
      unit: isCompact ? undefined : 'm²',
      icon: 'material-symbols:square-foot',
      label: 'superficie'
    });
  }

  const roomsCount = property.rooms || property.bedrooms;
  if (roomsCount) {
    stats.push({
      value: isCompact ? `${roomsCount}` : `${roomsCount} Locali`,
      icon: 'material-symbols:bed',
      label: 'locali'
    });
  }

  if (property.bathrooms) {
    stats.push({
      value: isCompact ? `${property.bathrooms}` : `${property.bathrooms} Bagni`,
      icon: 'material-symbols:bathtub',
      label: 'bagni'
    });
  }

  const isEnergyClassValid = property.energyClass && 
                             property.energyClass !== 'NOT_APPLIABLE' && 
                             property.energyClass !== 'Non Applicabile';

  if (isEnergyClassValid) {
    stats.push({
      value: property.energyClass!,
      icon: 'material-symbols:energy-savings-leaf-outline',
      label: 'classe energetica'
    });
  }

  if (property.propertyType === 'garage' && property.hasSurveillance) {
    stats.push({ value: 'Sorvegliato', icon: 'material-symbols:videocam', label: 'sorveglianza' });
  }

  if (property.propertyType === 'land' && property.isAccessible) {
    stats.push({ value: 'Accesso Stradale', icon: 'material-symbols:add-road', label: 'accesso' });
  }

  if (stats.length === 0) {
    return null;
  }

  return (
    <View className="flex-row items-center flex-wrap mt-1">
      {stats.map((stat, index) => (
        <React.Fragment key={index}>
          <StatItem {...stat} />
          {isCompact && index < stats.length - 1 && (
            <View className="h-4 w-[1px] bg-gray-200 dark:bg-gray-700 mr-6 mb-2" />
          )}
        </React.Fragment>
      ))}
    </View>
  );
};

/**
 * Visualizza la lista completa delle caratteristiche (per vista dettagli).
 * 
 * @param {{ property: PropertyCharacteristicsData }} props - Dati della proprietà.
 * @returns {JSX.Element | null}
 */
export const PropertyCharacteristicsDisplay: React.FC<{ property: PropertyCharacteristicsData }> = ({ property }) => {
  const { t } = useTranslation();
  
  if (!property) {
    return null;
  }

  return (
    <View className="flex-row flex-wrap">
      <CharacteristicItem 
        iconName="material-symbols:calendar-today" 
        value={property.yearBuilt} 
        label={t('property_details.yearBuilt')} 
      />
      {property.propertyType === "residential" && (
        <>
          <CharacteristicItem 
            iconName="material-symbols:layers" 
            value={property.floor} 
            label={t('property_details.floor')} 
          />
          <CharacteristicItem 
            iconName="material-symbols:elevator" 
            value={property.hasElevator} 
            label={t('property_details.hasElevator')} 
            hideIfFalse 
          />
          <CharacteristicItem 
            iconName="material-symbols:hvac" 
            value={property.heating && property.heating !== 'Absent' ? t(`filters.heating.options.${property.heating}`) : undefined} 
            label={t('property_details.heating')} 
          />
          <CharacteristicItem 
            iconName="material-symbols:chair" 
            value={property.isFurnished} 
            label={t('property_details.furnished')} 
            hideIfFalse 
          />
        </>
      )}
    </View>
  );
};

/**
 * Proprietà per il componente CharacteristicItem.
 */
interface CharacteristicItemProps {
  iconName: string;
  value: string | number | boolean | undefined | null;
  unit?: string;
  label?: string;
  hideIfFalse?: boolean;
}

/**
 * Singola riga di caratteristica per la lista dettagliata.
 * 
 * @param {CharacteristicItemProps} props - Proprietà del componente.
 * @returns {JSX.Element | null}
 */
const CharacteristicItem: React.FC<CharacteristicItemProps> = ({ 
  iconName, 
  value, 
  unit, 
  label,
  hideIfFalse = false 
}) => {
  const { t } = useTranslation();
  const iconColor = useThemeColor({ light: '#6B7280', dark: '#9CA3AF' }, 'text');
  const textColor = useThemeColor({ light: '#6B7280', dark: '#9CA3AF' }, 'text');

  if (value === undefined || value === null || value === '') {
    return null;
  }
  
  if (typeof value === 'string' && (value === 'NOT_APPLIABLE' || value === 'Non Applicabile')) {
    return null;
  }
  
  if (typeof value === 'boolean' && hideIfFalse && !value) {
    return null;
  }

  const displayValue = typeof value === 'boolean' ? (value ? t('yes') : t('no')) : value;

  return (
    <View className="flex-row items-center mr-4 mb-2">
      <ThemedIcon 
        icon={iconName} 
        size={14} 
        className="mr-2 opacity-60" 
        lightColor={iconColor} 
        darkColor={iconColor} 
        accessibilityLabel={label || 'icon'}
      />
      <ThemedText className="text-xs" style={{ color: textColor }}>
        {label ? `${label}: ` : ''}{displayValue}{unit ? ` ${unit}` : ''}
      </ThemedText>
    </View>
  );
};

/**
 * Estrae il valore da un FilterState o restituisce il valore diretto.
 * Prioritizza i valori diretti.
 * 
 * @param {any} field - Il campo da cui estrarre il valore.
 * @returns {any} Il valore estratto.
 */
const getValue = (field: any): any => {
  if (field === undefined || field === null) {
    return undefined;
  }
  
  if (typeof field === 'object' && 'value' in field) {
    return field.value;
  }
  
  return field;
};

/**
 * Inferred property type based on category string.
 * 
 * @param {string} category - The property category string.
 * @returns {PropertyType} The inferred property type.
 */
const inferPropertyType = (category: string): PropertyType => {
  if (!category) {
    return 'residential';
  }

  const normalizedCategory = category.toLowerCase();

  const residentialKeywords = [
    'apartment', 'villa', 'studio', 'penthouse', 'townhouse', 
    'casa indipendente', 'loft', 'attico', 'residenziale', 'monolocale', 'bilocale'
  ];
  if (residentialKeywords.some(keyword => normalizedCategory.includes(keyword))) {
    return 'residential';
  }

  const commercialKeywords = [
    'office', 'shop', 'restaurant', 'warehouse', 'negozio', 
    'ufficio', 'ristorazione', 'locale_commerciale', 'commerciale', 'capannone'
  ];
  if (commercialKeywords.some(keyword => normalizedCategory.includes(keyword))) {
    return 'commercial';
  }

  const garageKeywords = ['garage', 'parking', 'posto auto', 'box'];
  if (garageKeywords.some(keyword => normalizedCategory.includes(keyword))) {
    return 'garage';
  }

  const landKeywords = ['land', 'plot', 'pascolo', 'edificabile', 'coltivabile', 'terreno', 'agricolo'];
  if (landKeywords.some(keyword => normalizedCategory.includes(keyword))) {
    return 'land';
  }

  return 'residential';
};

/**
 * Mappa un oggetto PropertyDetail nelle caratteristiche visualizzabili.
 * 
 * @param {PropertyDetail} propertyDetail - Dettagli della proprietà dall'API.
 * @returns {PropertyCharacteristicsData}
 */
export const mapPropertyDetailToCharacteristics = (
  propertyDetail: PropertyDetail
): PropertyCharacteristicsData => {
  const type = propertyDetail.type || inferPropertyType(propertyDetail.propertyCategory);
  const details = propertyDetail.propertyDetails || {};

  // Logica di estrazione resiliente per Locali e Bagni
  // Alcuni DTO usano numberOfRooms, altri rooms, altri lo hanno annidato
  const rooms = propertyDetail.numberOfRooms ??
                (propertyDetail as any).rooms ??
                getValue((details as any)?.residential?.numberOfRooms) ??
                getValue((details as any)?.commercial?.numberOfRooms) ??
                getValue((details as any)?.residential?.minNumberOfRooms) ??
                getValue((details as any)?.commercial?.minNumberOfRooms);

  const bathrooms = propertyDetail.numberOfBathrooms ??
                    (propertyDetail as any).bathrooms ??
                    getValue((details as any)?.residential?.numberOfBathrooms) ??
                    getValue((details as any)?.commercial?.numberOfBathrooms) ??
                    getValue((details as any)?.residential?.minNumberOfBathrooms) ??
                    getValue((details as any)?.commercial?.minNumberOfBathrooms);

  // Logica di estrazione resiliente per Classe Energetica
  const energyClass = propertyDetail.energyRating ??
                      (propertyDetail as any).energyClass ??
                      getValue((details as any)?.residential?.energyRating) ??
                      getValue((details as any)?.commercial?.energyRating);

  const characteristics: PropertyCharacteristicsData = {
    propertyType: type,
    sqft: propertyDetail.area,
    energyClass: energyClass,
    condition: propertyDetail.condition,
    yearBuilt: propertyDetail.yearBuilt,
    rooms: rooms,
    bedrooms: propertyDetail.numberOfBedrooms ?? (propertyDetail as any).bedrooms,
    bathrooms: bathrooms,
  };

  if (type === 'residential' && details.residential) {
    const res = details.residential;
    characteristics.floor = getValue(res.floor);
    characteristics.hasElevator = getValue(res.mustHaveElevator);
    characteristics.heating = getValue(res.heating);
    characteristics.parkingSpaces = getValue(res.minParkingSpaces) ?? getValue((res as any).parkingSpaces);
    characteristics.isFurnished = getValue(res.mustBeFurnished) ?? getValue((res as any).furnished);
    const gardenValue = getValue(res.acceptedGarden) ?? getValue((res as any).garden);
    characteristics.hasGarden = Array.isArray(gardenValue) ? !gardenValue.includes('ABSENT') : (gardenValue !== 'ABSENT' && gardenValue !== undefined);
  }

  if (type === 'commercial' && details.commercial) {
    const comm = details.commercial;
    characteristics.totalFloors = getValue(comm.minNumberOfFloors) ?? getValue((comm as any).numberOfFloors);
    characteristics.wheelchairAccess = getValue(comm.mustHaveWheelchairAccess) ?? getValue((comm as any).hasDisabledAccess);
    characteristics.heating = getValue(comm.heating);
  }

  if (type === 'garage' && details.garage) {
    characteristics.hasSurveillance = getValue(details.garage.mustHaveSurveillance) ?? getValue((details.garage as any).hasSurveillance);
  }

  if (type === 'land' && details.land) {
    characteristics.isAccessible = getValue(details.land.mustBeAccessibleFromStreet) ?? getValue((details.land as any).isAccessible);
    characteristics.slope = getValue(details.land.slope);
  }

  return characteristics;
};
