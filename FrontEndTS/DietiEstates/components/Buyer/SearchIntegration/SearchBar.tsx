import React, { useEffect, useState } from 'react';
import { TextInput, TouchableOpacity, View, FlatList } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { SearchBarProps, PhotonFeature } from './types';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useSearch } from '@/context/SearchContext';
import { getAutocompleteSuggestions } from '@/app/_services/photon.service';

/**
 * SearchBar con autocomplete Photon:
 * - debounced calls a Photon
 * - mostra suggerimenti sotto la barra
 * - alla selezione popola la query e aggiorna il SearchContext con geolocalizzazione (5 km)
 * - mostra le coordinate normalizzate in un'area dedicata
 */

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  onFilterPress,
  onSearchPress,
  placeholder = 'Search properties...',
  activeFiltersCount = 0,
}) => {
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'propertyCardBackground');
  const accentColor = useThemeColor({}, 'buttonBackground');

  const { state, setGeolocation } = useSearch();

  const [suggestions, setSuggestions] = useState<PhotonFeature[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const isSelectingRef = React.useRef(false);

  useEffect(() => {
    // Skip fetching suggestions if we're currently selecting one
    if (isSelectingRef.current) {
      isSelectingRef.current = false; // Reset after skipping
      return;
    }

    const q = value?.trim() ?? '';
    if (!q) {
      setSuggestions([]);
      setIsLoadingSuggestions(false);
      return;
    }

    setIsLoadingSuggestions(true);
    const timer = setTimeout(async () => {
      try {
        const s = await getAutocompleteSuggestions(q, 6);
        setSuggestions(s);
      } catch (err) {
        console.error('[SearchBar] error fetching suggestions', err);
        setSuggestions([]);
      } finally {
        setIsLoadingSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [value]);

  const handleSubmit = () => {
    if (onSearchPress) onSearchPress();
  };

  const handleSelectSuggestion = (s: PhotonFeature) => {
    isSelectingRef.current = true;
    const label = s.label ?? s.properties?.name ?? '';
    onChangeText(label);
    const coords = s.geometry?.coordinates;
    if (Array.isArray(coords) && coords.length >= 2) {
      const [lon, lat] = coords;
      setGeolocation({ lat, lon, label, radiusKm: 5 });
    } else {
      setGeolocation({ lat: 0, lon: 0, label, radiusKm: 5 });
    }
    setSuggestions([]);
  };

  return (
    <ThemedView className="w-full px-6 py-4">
      <ThemedView className="bg-white rounded-2xl shadow-sm py-6 px-4" style={{ backgroundColor }}>
        <View className="flex-row items-center justify-between">
          <ThemedView className="flex-row items-center flex-1 rounded-2xl bg-gray-100">
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={!value.trim()}
              className="pl-5 pr-3 py-3"
            >
              <Ionicons
                name="search"
                size={20}
                color={value.trim() ? accentColor : textColor}
              />
            </TouchableOpacity>

            <TextInput
              value={value}
              onChangeText={onChangeText}
              placeholder={state.geolocation ? `Cerca immobili a ${state.geolocation.label}...` : placeholder}
              className="flex-1 text-base leading-5 h-5 p-0"
              style={{ color: textColor }}
              placeholderTextColor={textColor}
              returnKeyType="search"
              onSubmitEditing={handleSubmit}
            />

            {/* Badge per indicare che c'è una località selezionata */}
            {state.geolocation && (
              <TouchableOpacity
                className="pr-3 pl-2"
                onPress={() => {
                  // Permette di rimuovere la località selezionata
                  setGeolocation(null);
                  onChangeText('');
                }}
              >
                <Ionicons
                  name="close-circle-outline"
                  size={16}
                  color={accentColor}
                />
              </TouchableOpacity>
            )}
          </ThemedView>

          <View className="ml-4">
            <TouchableOpacity
              onPress={onFilterPress}
              className="relative flex-row items-center px-4 h-10 rounded-2xl"
              style={{ backgroundColor: useThemeColor({}, 'buttonBackground') }}
            >
              <Ionicons
                name="funnel"
                size={16}
                color={useThemeColor({}, 'buttonTextColor')}
                className="mr-1"
              />
              <ThemedText
                className="font-medium text-sm"
                style={{ color: useThemeColor({}, 'buttonTextColor') }}
              >
                Filters
              </ThemedText>

              {activeFiltersCount > 0 && (
                <ThemedView className="absolute -top-2 -right-2 min-w-[18px] h-5 bg-white rounded-full border border-gray-200 items-center justify-center px-1">
                  <ThemedText className="text-xs font-bold leading-tight">
                    {activeFiltersCount}
                  </ThemedText>
                </ThemedView>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {suggestions.length > 0 && (
          <ThemedView className="mt-3 bg-white rounded-lg border border-gray-200">
            <FlatList
              data={suggestions}
              keyExtractor={(item, index) => {
                // Generate unique key combining available identifiers
                const id = item.id || '';
                const osmId = item.properties?.osm_id ? String(item.properties.osm_id) : '';
                const label = item.label || '';
                return `${id}-${osmId}-${label}-${index}`;
              }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleSelectSuggestion(item)}
                  className="px-4 py-3 border-b border-gray-100"
                  activeOpacity={0.7}
                >
                  <ThemedText className="text-sm">{item.label}</ThemedText>
                  {item.properties?.city && (
                    <ThemedText className="text-xs text-gray-500">{item.properties.city}</ThemedText>
                  )}
                </TouchableOpacity>
              )}
            />
          </ThemedView>
        )}

      </ThemedView>
    </ThemedView>
  );
};

