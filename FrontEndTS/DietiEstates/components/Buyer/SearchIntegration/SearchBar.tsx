import React, { useEffect, useState } from 'react';
import { TextInput, TouchableOpacity, View, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { SearchBarProps, PhotonFeature } from './types';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useSearch } from '@/context/SearchContext';

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
  const isSelectingRef = React.useRef(false);
  const lastQueryRef = React.useRef<string>(''); // Per tracciare l'ultima query inviata a Photon
  const suggestionsCache = React.useRef<Map<string, PhotonFeature[]>>(new Map()); // Cache in memoria
  const accessFrequency = React.useRef<Map<string, number>>(new Map()); // Contatore accessi per LFU

  // Carica la cache da AsyncStorage all'avvio
  useEffect(() => {
    const loadCacheFromStorage = async () => {
      try {
        const storedCache = await AsyncStorage.getItem('photonSuggestionsCache');
        if (storedCache) {
          const parsedArray = JSON.parse(storedCache);
          // Ricostruisce la Map con i tipi corretti
          const parsedCache = new Map<string, PhotonFeature[]>();
          const parsedFrequency = new Map<string, number>();
          
          for (const [key, value] of parsedArray) {
            parsedCache.set(key, value as PhotonFeature[]);
            parsedFrequency.set(key, 1); // Reset frequency on load
          }
          suggestionsCache.current = parsedCache;
          accessFrequency.current = parsedFrequency;
          console.log('[SearchBar] Loaded suggestions cache from AsyncStorage:', parsedCache.size, 'entries');
        }
      } catch (error) {
        console.error('[SearchBar] Error loading cache from AsyncStorage:', error);
      }
    };

    loadCacheFromStorage();
  }, []);

  useEffect(() => {
    // Skip fetching suggestions if we're currently selecting one
    if (isSelectingRef.current) {
      isSelectingRef.current = false; // Reset after skipping
      return;
    }

    const q = value?.trim() ?? '';
    
    // Se c'è già una geolocalizzazione selezionata e la query corrisponde al label,
    // evita completamente qualsiasi operazione con i suggerimenti
    if (state.geolocation && q === state.geolocation.label) {
      console.log('[SearchBar] Geolocation already selected, skipping suggestions entirely');
      return;
    }
    
    if (!q) {
      setSuggestions([]);
      lastQueryRef.current = '';
      console.log('[SearchBar] Query is empty, clearing suggestions');
      return;
    }
    
    // Usa cache persistente se disponibile
    if (suggestionsCache.current.has(q)) {
      console.log('[SearchBar] Using persistent cache for query:', q);
      setSuggestions(suggestionsCache.current.get(q)!);
      lastQueryRef.current = q;
      
      // Incrementa il contatore di accesso per LFU
      const currentCount = accessFrequency.current.get(q) || 0;
      accessFrequency.current.set(q, currentCount + 1);
      return;
    }
    
    // Evita chiamate duplicate per la stessa query (cache a breve termine)
    if (q === lastQueryRef.current) {
      console.log('[SearchBar] Same query as last time, skipping Photon call');
      return;
    }
    
    // Evita chiamate per query troppo corte (meno di 2 caratteri)
    if (q.length < 2) {
      console.log('[SearchBar] Skipping Photon call - query too short:', q);
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        // TODO: Implementare la nuova logica per i suggerimenti di autocompletamento.
        // Per ora, disabilito i suggerimenti.
        console.log('[SearchBar] Autocomplete suggestions temporarily disabled.');
        setSuggestions([]);
        lastQueryRef.current = q;
      } catch (err) {
        console.error('[SearchBar] error fetching suggestions', err);
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [value, state.geolocation]); // Aggiunto state.geolocation come dipendenza

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

        {/* I suggerimenti di autocompletamento sono temporaneamente disabilitati. */}

      </ThemedView>
    </ThemedView>
  );
};

