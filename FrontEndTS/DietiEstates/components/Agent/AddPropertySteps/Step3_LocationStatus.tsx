import React, { useEffect, useState, useRef } from 'react';
import { View, Pressable, TextInput, Platform, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Controller, Control, FieldErrors, UseFormSetValue } from 'react-hook-form';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { LabelInput } from '@/components/LabelInput';
import { ThemedIcon } from '@/components/ThemedIcon';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useActionSheet } from '@expo/react-native-action-sheet';
import useSearchProperties from '@/src/hooks/useSearchProperties';
import { t } from 'i18next';
import { SuggestionsDisplayer } from '@/components/Buyer/SearchIntegration/SuggestionsDisplayer';
import { PropertyFormData } from '@/app/(protected)/(agent)/schemas/propertySchema';
import Animated, { FadeInRight } from 'react-native-reanimated';

interface Step3LocationStatusProps {
  control: Control<PropertyFormData>;
  errors: FieldErrors<PropertyFormData>;
  setValue: UseFormSetValue<PropertyFormData>;
}

const energyClasses = ['A4', 'A3', 'A2', 'A1', 'B', 'C', 'D', 'E', 'F', 'G', 'NOT_APPLIABLE'];

export default function Step3_LocationStatus({ control, errors, setValue }: Step3LocationStatusProps) {
  const textColor = useThemeColor({}, 'text');
  const cardBackground = useThemeColor({}, 'propertyCardBackground');
  const cardText = useThemeColor({}, 'propertyCardText');
  const borderColor = useThemeColor({}, 'border');
  const themeErrorColor = useThemeColor({}, 'error');
  const tint = useThemeColor({}, 'tint');
  const accentColor = useThemeColor({}, 'buttonBackground');

  const { getSuggestions } = useSearchProperties();
  const [query, setQuery] = useState<string>('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [isSelectionFromSuggestion, setIsSelectionFromSuggestion] = useState<boolean>(false);
  const [showManualDetails, setShowManualDetails] = useState<boolean>(false);
  const isSelectingRef = useRef(false);

  useEffect(() => {
    if (isSelectingRef.current) {
      isSelectingRef.current = false;
      return;
    }

    if (query.length < 2 || isSelectionFromSuggestion) {
      if (!isSelectionFromSuggestion) {
        setSuggestions([]);
        setShowSuggestions(false);
      }
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
  }, [getSuggestions, query, isSelectionFromSuggestion]);

  /**
   * Gestisce la selezione di un indirizzo dai suggerimenti.
   * Se l'indirizzo è incompleto (es. manca il civico), mostra automaticamente i dettagli manuali.
   * @param item Il suggerimento selezionato
   */
  const handleSelectSuggestion = (item: any) => {
    isSelectingRef.current = true;
    const { properties = {}, geometry = {} } = item;
    const {
      province,
      street,
      housenumber,
      city,
      county,
      country,
    } = properties;

    const isAddressComplete = !!(city && (province || county) && street && housenumber && country);

    setIsSelectionFromSuggestion(isAddressComplete);
    setQuery(item.label || '');
    setSuggestions([]);
    setShowSuggestions(false);
    setShowManualDetails(!isAddressComplete);

    const { coordinates } = geometry;
    const [longitude, latitude] = coordinates || [];

    if (country) {
      setValue('addressRequest.country', country, { shouldValidate: true, shouldDirty: true });
    }

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
      setValue('addressRequest.streetNumber', '', { shouldValidate: false, shouldDirty: true });
    }

    if (typeof latitude === 'number' && typeof longitude === 'number') {
      setValue('addressRequest.latitude', latitude, { shouldValidate: true, shouldDirty: true });
      setValue('addressRequest.longitude', longitude, { shouldValidate: true, shouldDirty: true });
    }
  };

  return (
    <Animated.View entering={FadeInRight.duration(400)} className="flex-1">
      <ThemedView className="p-4 gap-6">
        <View className="flex-row items-center gap-3 mb-2">
          <View className="p-2.5 rounded-full shadow-sm" style={{ backgroundColor: cardBackground, shadowColor: "#000", shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 }}>
            <ThemedIcon icon="material-symbols:location-on" size={26} lightColor={tint} darkColor={tint} accessibilityLabel={t('addProperty.accessibility.location')} />
          </View>
          <View>
            <ThemedText type="subtitle" className="text-xl font-bold">{t('addProperty.headers.locationAndStatus')}</ThemedText>
            <ThemedText className="text-sm opacity-60">{t('addProperty.stepCounter', { current: 3, total: 5 })}</ThemedText>
          </View>
        </View>

        <View className="mb-2" style={{ zIndex: 1000 }}>
          <ThemedText className="mb-2 text-sm font-semibold ml-1" style={{ color: textColor }}>
            {t('addProperty.labels.searchAddress')}
          </ThemedText>
          <View
            className={`rounded-[30px] overflow-hidden border shadow-sm ${isSelectionFromSuggestion ? 'bg-green-50/50 dark:bg-green-900/10' : ''}`}
            style={{
              borderColor: isSelectionFromSuggestion ? '#34C759' : borderColor + '40',
              backgroundColor: isSelectionFromSuggestion ? undefined : cardBackground,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 3
            }}
          >
            <View className="flex-row items-center px-5 h-[60px]">
              {isSelectionFromSuggestion ? (
                <View className="mr-3 justify-center h-full">
                  <ThemedIcon
                    icon="material-symbols:check-rounded"
                    size={22}
                    lightColor="#34C759"
                    darkColor="#34C759"
                    accessibilityLabel={''}
                  />
                </View>
              ) : (
                <View className="mr-3 justify-center h-full">
                  <TouchableOpacity
                    onPress={() => {
                      // TODO: Implement current position logic if needed
                    }}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name="location-outline"
                      size={22}
                      color={tint}
                    />
                  </TouchableOpacity>
                </View>
              )}
              <TextInput
                value={query}
                onChangeText={(text) => {
                  setQuery(text);
                  setIsSelectionFromSuggestion(false);
                }}
                placeholder={t('addProperty.placeholders.searchLocation')}
                className="flex-1 text-base font-medium"
                style={{
                  color: textColor,
                  paddingVertical: 0,
                  paddingHorizontal: 0,
                  margin: 0,
                  flex: 1,
                  height: '100%',
                  fontSize: 16,
                  ...Platform.select({
                    android: {
                      textAlignVertical: 'center',
                      includeFontPadding: false,
                    },
                  })
                }}
                placeholderTextColor={textColor + '60'}
                returnKeyType="search"
                multiline={false}
                underlineColorAndroid="transparent"
                textAlignVertical="center"
              />
              {query.length > 0 && (
                <TouchableOpacity
                  onPress={() => {
                    setQuery('');
                    setIsSelectionFromSuggestion(false);
                  }}
                  style={{
                    paddingHorizontal: 8,
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  activeOpacity={0.6}
                >
                  <Ionicons
                    name="close-circle-outline"
                    size={20}
                    color={accentColor}
                  />
                </TouchableOpacity>
              )}
            </View>

            {showSuggestions && suggestions.length > 0 && !isSelectionFromSuggestion && (
              <View style={{ borderTopWidth: 1, borderTopColor: borderColor + '20' }}>
                <SuggestionsDisplayer
                  onSelectSuggestion={handleSelectSuggestion}
                  suggestions={suggestions}
                  containerStyle={{
                    backgroundColor: 'transparent',
                    borderWidth: 0,
                    elevation: 0,
                    shadowOpacity: 0,
                  }}
                />
              </View>
            )}
          </View>
          {isSelectionFromSuggestion && (
            <View className="mt-2 flex-row justify-end gap-2">
              <Pressable
                onPress={() => setShowManualDetails(!showManualDetails)}
                className="flex-row items-center gap-1.5 py-1.5 px-3 rounded-full active:bg-gray-100 dark:active:bg-gray-800"
              >
                <ThemedIcon icon={showManualDetails ? "material-symbols:keyboard-arrow-up-rounded" : "material-symbols:edit-outline"} size={14} lightColor={tint} darkColor={tint} accessibilityLabel={t('addProperty.accessibility.details')} />
                <ThemedText className="text-xs font-bold" style={{ color: tint }}>
                  {showManualDetails ? t('addProperty.actions.hideDetails') : t('addProperty.actions.editDetails')}
                </ThemedText>
              </Pressable>
              <Pressable
                onPress={() => {
                  setIsSelectionFromSuggestion(false);
                  setQuery('');
                  setShowManualDetails(false);
                }}
                className="flex-row items-center gap-1.5 py-1.5 px-3 rounded-full active:bg-gray-100 dark:active:bg-gray-800"
              >
                <ThemedIcon icon="material-symbols:close-rounded" size={14} lightColor={tint} darkColor={tint} accessibilityLabel={t('addProperty.accessibility.cancel')} />
                <ThemedText className="text-xs font-bold" style={{ color: tint }}>{t('addProperty.actions.cancel')}</ThemedText>
              </Pressable>
            </View>
          )}
        </View>

        {(showManualDetails || !isSelectionFromSuggestion) && (
          <Animated.View
            entering={FadeInRight.duration(300)}
            className="p-5 rounded-3xl border-2"
            style={{
              backgroundColor: cardBackground,
              borderColor: borderColor,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.03,
              shadowRadius: 8,
              elevation: 3
            }}
          >
            <ThemedText className="mb-4 text-sm font-semibold opacity-50 uppercase tracking-wider ml-1" style={{ color: cardText }}>{t('addProperty.headers.addressDetails')}</ThemedText>
            
            <View className="flex-row gap-4">
              <View className="flex-1">
                <Controller
                  control={control}
                  name="addressRequest.city"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <LabelInput
                      label={t('addProperty.labels.city')}
                      placeholder={t('addProperty.placeholders.city')}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      error={!!errors.addressRequest?.city}
                      errorMessage={errors.addressRequest?.city?.message as string}
                      className="mb-4"
                      inputBackgroundColor={cardBackground}
                    />
                  )}
                />
              </View>
              <View className="flex-1">
                <Controller
                  control={control}
                  name="addressRequest.province"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <LabelInput
                      label={t('addProperty.labels.province')}
                      placeholder={t('addProperty.placeholders.province')}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      error={!!errors.addressRequest?.province}
                      errorMessage={errors.addressRequest?.province?.message as string}
                      className="mb-4"
                      inputBackgroundColor={cardBackground}
                    />
                  )}
                />
              </View>
            </View>

            <Controller
              control={control}
              name="addressRequest.street"
              render={({ field: { onChange, onBlur, value } }) => (
                <LabelInput
                  label={t('addProperty.labels.street')}
                  placeholder={t('addProperty.placeholders.street')}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={!!errors.addressRequest?.street}
                  errorMessage={errors.addressRequest?.street?.message as string}
                  className="mb-4"
                  inputBackgroundColor={cardBackground}
                />
              )}
            />

            <View className="flex-row gap-4">
              <View className="flex-[0.8]">
                <Controller
                  control={control}
                  name="addressRequest.streetNumber"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <LabelInput
                      label={t('addProperty.labels.streetNumber')}
                      placeholder={t('addProperty.placeholders.streetNumber')}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      error={!!errors.addressRequest?.streetNumber}
                      errorMessage={errors.addressRequest?.streetNumber?.message as string}
                      className="mb-4"
                      inputBackgroundColor={cardBackground}
                    />
                  )}
                />
              </View>
              <View className="flex-[1.2]">
                <Controller
                  control={control}
                  name="addressRequest.building"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <LabelInput
                      label={t('addProperty.labels.building')}
                      placeholder={t('addProperty.placeholders.building')}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value ?? undefined}
                      error={!!errors.addressRequest?.building}
                      errorMessage={errors.addressRequest?.building?.message as string}
                      className="mb-4"
                      inputBackgroundColor={cardBackground}
                    />
                  )}
                />
              </View>
            </View>
            
            <Controller
              control={control}
              name="addressRequest.country"
              render={({ field: { onChange, onBlur, value } }) => (
                <LabelInput
                  label={t('addProperty.labels.country')}
                  placeholder={t('addProperty.placeholders.country')}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={!!errors.addressRequest?.country}
                  errorMessage={errors.addressRequest?.country?.message as string}
                  className="mb-0"
                  inputBackgroundColor={cardBackground}
                />
              )}
            />
          </Animated.View>
        )}

        <Controller
          control={control}
          name="addressRequest.latitude"
          render={() => <></>}
        />
        <Controller
          control={control}
          name="addressRequest.longitude"
          render={() => <></>}
        />

        <View className="h-[1px] bg-gray-200 dark:bg-gray-800 my-2" />

        <View
          className="p-5 rounded-3xl border-2"
          style={{
            backgroundColor: cardBackground,
            borderColor: borderColor,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.03,
            shadowRadius: 8,
            elevation: 3
          }}
        >
          <ThemedText className="mb-4 text-sm font-semibold opacity-50 uppercase tracking-wider ml-1" style={{ color: cardText }}>{t('addProperty.headers.propertyDetails')}</ThemedText>
          
          <Controller
            control={control}
            name="condition"
            render={({ field: { onChange, value } }) => {
              const { showActionSheetWithOptions } = useActionSheet();
              const propertyConditions = ["NEW", "GOOD_CONDITION", "RENOVATED", "TO_BE_RENOVATED", "POOR_CONDITION", "UNDER_CONSTRUCTION"];

              const showConditionOptions = () => {
                const options = [t('addProperty.actions.select'), ...propertyConditions.map(pc => t(`property_status.${pc}`)), t('addProperty.actions.cancelTitle')];
                const cancelButtonIndex = options.length - 1;

                showActionSheetWithOptions(
                  { options, cancelButtonIndex, title: t('addProperty.labels.condition') },
                  (selectedIndex?: number) => {
                    if (selectedIndex !== undefined && selectedIndex !== cancelButtonIndex && selectedIndex !== 0) {
                      onChange(propertyConditions[selectedIndex - 1]);
                    }
                  }
                );
              };

              return (
                <View className="mb-6">
                  <ThemedText className="mb-1.5 text-xs font-medium ml-1" style={{ color: textColor }}>{t('addProperty.labels.condition')}</ThemedText>
                  <Pressable
                    className="border-2 rounded-xl min-h-[50px] justify-center px-3"
                    style={{ borderColor: errors.condition ? themeErrorColor : borderColor, backgroundColor: cardBackground, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 1 }}
                    onPress={showConditionOptions}
                  >
                    <View className="flex-row justify-between items-center">
                      <ThemedText style={{ color: value ? textColor : textColor + '60', fontSize: 15 }}>
                        {value ? t(`property_status.${value}`) : t('addProperty.placeholders.selectCondition')}
                      </ThemedText>
                      <ThemedIcon icon="material-symbols:keyboard-arrow-down-rounded" size={24} lightColor={textColor + '60'} darkColor={textColor + '60'} accessibilityLabel={t('addProperty.accessibility.open')} />
                    </View>
                  </Pressable>
                  {errors.condition && (
                    <ThemedText className="mt-1.5 ml-1 text-xs font-medium" style={{ color: themeErrorColor }}>
                      {`⚠️ ${errors.condition.message as string}`}
                    </ThemedText>
                  )}
                </View>
              );
            }}
          />
          
          <Controller
            control={control}
            name="energyRating"
            render={({ field: { onChange, value } }) => {
              const { showActionSheetWithOptions } = useActionSheet();

              const showEnergyClassOptions = () => {
                const options = [t('addProperty.actions.select'), ...energyClasses.map(ec => t(ec)), t('addProperty.actions.cancelTitle')];
                const cancelButtonIndex = options.length - 1;

                showActionSheetWithOptions(
                  { options, cancelButtonIndex, title: t('addProperty.labels.energyClass') },
                  (selectedIndex?: number) => {
                    if (selectedIndex !== undefined && selectedIndex !== cancelButtonIndex && selectedIndex !== 0) {
                      onChange(energyClasses[selectedIndex - 1]);
                    }
                  }
                );
              };

              return (
                <View className="mb-0">
                  <ThemedText className="mb-1.5 text-xs font-medium ml-1" style={{ color: textColor }}>{t('addProperty.labels.energyClass')}</ThemedText>
                  <Pressable
                    className="border-2 rounded-xl min-h-[50px] justify-center px-3"
                    style={{ borderColor: errors.energyRating ? themeErrorColor : borderColor, backgroundColor: cardBackground, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 1 }}
                    onPress={showEnergyClassOptions}
                  >
                    <View className="flex-row justify-between items-center">
                      <ThemedText style={{ color: value ? textColor : textColor + '60', fontSize: 15 }}>
                        {value ? t(value) : t('addProperty.placeholders.selectEnergyClass')}
                      </ThemedText>
                      <ThemedIcon icon="material-symbols:keyboard-arrow-down-rounded" size={24} lightColor={textColor + '60'} darkColor={textColor + '60'} accessibilityLabel={t('addProperty.accessibility.open')} />
                    </View>
                  </Pressable>
                  {errors.energyRating && (
                    <ThemedText className="mt-1.5 ml-1 text-xs font-medium" style={{ color: themeErrorColor }}>
                      {`⚠️ ${errors.energyRating.message as string}`}
                    </ThemedText>
                  )}
                </View>
              );
            }}
          />
        </View>
      </ThemedView>
    </Animated.View>
  );
}