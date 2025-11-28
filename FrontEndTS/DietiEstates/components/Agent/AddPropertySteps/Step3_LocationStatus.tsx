import React, { useEffect, useState } from 'react';
import { View, Pressable, TextInput } from 'react-native';
import { Controller, Control, FieldErrors, UseFormSetValue } from 'react-hook-form';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { LabelInput } from '@/components/LabelInput';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useActionSheet } from '@expo/react-native-action-sheet';
import useSearchProperties from '@/src/hooks/useSearchProperties';
import { t } from 'i18next';
import { SuggestionsDisplayer } from '@/components/Buyer/SearchIntegration/SuggestionsDisplayer';
import { PropertyFormData } from '@/app/(protected)/(agent)/schemas/propertySchema';

interface Step3LocationStatusProps {
  control: Control<PropertyFormData>;
  errors: FieldErrors<PropertyFormData>;
  setValue: UseFormSetValue<PropertyFormData>;
}

const energyClasses = ['A4', 'A3', 'A2', 'A1', 'B', 'C', 'D', 'E', 'F', 'G', 'NOT_APPLIABLE'];

export default function Step3_LocationStatus({ control, errors, setValue }: Step3LocationStatusProps) {
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor({}, 'border');
  const themeErrorColor = useThemeColor({}, 'error');

  const { getSuggestions } = useSearchProperties();
  const [query, setQuery] = useState<string>('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const suggestionsFromRepo = await getSuggestions(query);
        setSuggestions(suggestionsFromRepo || []);
        setShowSuggestions(true);
      } catch (err) {
        console.error('[Step3_LocationStatus] error fetching suggestions', err);
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [getSuggestions, query]);

  const handleSelectSuggestion = (item: any) => {
    console.log('Selected suggestion:', JSON.stringify(item));
    
    // Update the search query display
    setQuery(item.label || '');
    setShowSuggestions(false);

    // Parse the suggestion and auto-fill form fields
    // Photon API structure: { properties: {...}, geometry: { coordinates: [lng, lat] } }
    const { properties = {}, geometry = {} } = item;
    const {
      province,
      street,
      housenumber,
      city,
      county,
      state,
      country,
    } = properties;

    const { coordinates } = geometry;
    const [longitude, latitude] = coordinates || [0, 0];

    // Auto-fill all addressRequest fields
    if (country) {
      setValue('addressRequest.country', country, { shouldValidate: true, shouldDirty: true });
    }

    // Province: prefer state over county
    if (province || county) {
      setValue('addressRequest.province', province || county, { shouldValidate: true, shouldDirty: true });
    }

    if (city) {
      setValue('addressRequest.city', city, { shouldValidate: true, shouldDirty: true });
    }

    if (street) {
      setValue('addressRequest.street', street, { shouldValidate: true, shouldDirty: true });
    }

    if (housenumber) {
      setValue('addressRequest.streetNumber', housenumber, { shouldValidate: true, shouldDirty: true });
    } else {
      // If no house number, set empty string
      setValue('addressRequest.streetNumber', '', { shouldValidate: false, shouldDirty: true });
    }

    // Set coordinates
    if (latitude && longitude) {
      setValue('addressRequest.latitude', latitude, { shouldValidate: true, shouldDirty: true });
      setValue('addressRequest.longitude', longitude, { shouldValidate: true, shouldDirty: true });
    }

    console.log('Auto-filled address:', {
      country,
      province,
      city,
      street,
      county,
      streetNumber: housenumber,
      latitude,
      longitude
    });
  };

  return (
    <ThemedView className="p-2.5 gap-1.5">
      <ThemedText type="subtitle" className="mb-4 text-center">
        {t('propertyLocationAndStatus')}
      </ThemedText>

      {/* Location Search Input */}
      <View className="mb-3">
        <ThemedText className="mb-2 text-base">
          {t('searchAddress')}
        </ThemedText>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={t('searchYourPropertyLocation')}
          className="border rounded min-h-[40px] h-[50px] px-3 text-base"
          style={{ 
            color: textColor, 
            borderColor: borderColor,
            backgroundColor: backgroundColor 
          }}
          placeholderTextColor={textColor + '80'}
          returnKeyType="search"
        />
        {showSuggestions && suggestions.length > 0 && (
          <SuggestionsDisplayer 
            onSelectSuggestion={handleSelectSuggestion} 
            suggestions={suggestions}
            filterType={"house"}
          />
        )}
      </View>

      {/* Country */}
      <Controller
        control={control}
        name="addressRequest.country"
        render={({ field: { onChange, onBlur, value } }) => (
          <LabelInput
            label="Paese"
            placeholder="Es. Italia"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={!!errors.addressRequest?.country}
            errorMessage={errors.addressRequest?.country?.message as string}
          />
        )}
      />

      {/* Province */}
      <Controller
        control={control}
        name="addressRequest.province"
        render={({ field: { onChange, onBlur, value } }) => (
          <LabelInput
            label="Provincia"
            placeholder="Es. Napoli"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={!!errors.addressRequest?.province}
            errorMessage={errors.addressRequest?.province?.message as string}
          />
        )}
      />

      {/* City */}
      <Controller
        control={control}
        name="addressRequest.city"
        render={({ field: { onChange, onBlur, value } }) => (
          <LabelInput
            label="Città / Comune"
            placeholder="Es. Napoli"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={!!errors.addressRequest?.city}
            errorMessage={errors.addressRequest?.city?.message as string}
          />
        )}
      />

      {/* Street */}
      <Controller
        control={control}
        name="addressRequest.street"
        render={({ field: { onChange, onBlur, value } }) => (
          <LabelInput
            label="Via"
            placeholder="Es. Via Roma"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={!!errors.addressRequest?.street}
            errorMessage={errors.addressRequest?.street?.message as string}
          />
        )}
      />

      {/* Street Number */}
      <Controller
        control={control}
        name="addressRequest.streetNumber"
        render={({ field: { onChange, onBlur, value } }) => (
          <LabelInput
            label="Numero Civico"
            placeholder="Es. 10"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={!!errors.addressRequest?.streetNumber}
            errorMessage={errors.addressRequest?.streetNumber?.message as string}
          />
        )}
      />

      {/* Building */}
      <Controller
        control={control}
        name="addressRequest.building"
        render={({ field: { onChange, onBlur, value } }) => (
          <LabelInput
            label="Edificio"
            placeholder="Es. Scala A o 80100"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={!!errors.addressRequest?.building}
            errorMessage={errors.addressRequest?.building?.message as string}
          />
        )}
      />

      {/* Hidden fields for coordinates - could be shown as read-only if needed */}
      <Controller
        control={control}
        name="addressRequest.latitude"
        render={() => null}
      />
      <Controller
        control={control}
        name="addressRequest.longitude"
        render={() => null}
      />

      {/* Energy Class Selector using ActionSheet */}
      <Controller
        control={control}
        name="energyClass"
        render={({ field: { onChange, value } }) => {
          const { showActionSheetWithOptions } = useActionSheet();

          const showEnergyClassOptions = () => {
            const options = ['Seleziona classe...', ...energyClasses, 'Annulla'];
            const cancelButtonIndex = options.length - 1;

            showActionSheetWithOptions(
              {
                options,
                cancelButtonIndex,
                title: 'Seleziona Classe Energetica',
              },
              (selectedIndex?: number) => {
                if (selectedIndex !== undefined && selectedIndex !== cancelButtonIndex && selectedIndex !== 0) {
                  onChange(energyClasses[selectedIndex - 1]);
                } else if (selectedIndex === 0) {
                  onChange('');
                }
              }
            );
          };

          return (
            <View className="mb-1.5">
              <ThemedText className="mb-2 text-base">Classe Energetica</ThemedText>
              <Pressable
                className="border rounded min-h-[40px] h-[50px] justify-center px-3"
                style={{ 
                  borderColor: errors.energyClass ? themeErrorColor : borderColor, 
                  backgroundColor: backgroundColor 
                }}
                onPress={showEnergyClassOptions}
              >
                <ThemedText style={{ color: value ? textColor : textColor + '80' }}>
                  {value ? t(value) : 'Seleziona classe...'}
                </ThemedText>
              </Pressable>
              {errors.energyClass && (
                <ThemedText className="mt-1 mb-2.5 text-xs" style={{ color: themeErrorColor }}>
                  {errors.energyClass.message as string}
                </ThemedText>
              )}
            </View>
          );
        }}
      />
    </ThemedView>
  );
}