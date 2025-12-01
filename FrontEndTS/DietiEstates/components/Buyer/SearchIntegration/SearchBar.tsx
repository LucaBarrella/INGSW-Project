import React, { useEffect, useState } from 'react';
import { TextInput, TouchableOpacity, View, FlatList } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { SearchBarProps, PhotonFeature } from './types';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useSearch } from '@/context/SearchContext';
import useSearchProperties from '@/src/hooks/useSearchProperties';
import { useTranslation } from 'react-i18next';
import { SuggestionsDisplayer } from './SuggestionsDisplayer';

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
  const { t } = useTranslation();

  const { state, setGeolocation } = useSearch();
  
  const [suggestions, setSuggestions] = useState<PhotonFeature[]>([]);
  const isSelectingRef = React.useRef(false);
  const lastQueryRef = React.useRef<string>(''); // Per tracciare l'ultima query inviata a Photon
  // Usa il repository/hook per suggerimenti persistenti e il conteggio filtri attivi
  const { getSuggestions, saveSuggestions, activeFiltersCount: activeCountFromHook, updateFilter, search } = useSearchProperties();

  // Suggestion persistence and caching delegated to SearchRepository via useSearchProperties.
  // No local AsyncStorage management here to keep the UI component simple.

  useEffect(() => {
    // Skip fetching suggestions if we're currently selecting one
    if (isSelectingRef.current) {
      isSelectingRef.current = false; // Reset after skipping
      return;
    }

    const q = value?.trim() ?? '';
    console.log(`[SearchBar useEffect] q: "${q}", geolocation: ${JSON.stringify(state.geolocation)}, lastQuery: "${lastQueryRef.current}"`);

    if (state.geolocation && q === state.geolocation.label) {
      setSuggestions([]);
      return;
    }

    if (!q) {
      setSuggestions([]);
      lastQueryRef.current = '';
      console.log('[SearchBar] Query is empty, clearing suggestions');
      return;
    }

    // Evita chiamate duplicate per la stessa query (cache a breve termine)
    // Rimuovo questo blocco per permettere la modifica della località

    // Evita chiamate per query troppo corte (meno di 2 caratteri)
    if (q.length < 2) {
      console.log('[SearchBar] Skipping suggestions - query too short:', q);
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        // Il hook/useSearchProperties delega a SearchRepository che ora risolve
        // sia la cache in-memory/AsyncStorage sia la chiamata remota a Photon su cache miss.
        const suggestionsFromRepo = await getSuggestions(q);
        setSuggestions(suggestionsFromRepo || []);
        lastQueryRef.current = q;
      } catch (err) {
        console.error('[SearchBar] error fetching suggestions', err);
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [value, getSuggestions]); // Rimuovo state.geolocation dalle dipendenze

  const handleSubmit = async () => {
    if (onSearchPress) {
      onSearchPress();
    }
    try {
      await search();
    } catch (e) {
      // Non bloccare la UI se la ricerca fallisce; loggalo per debug
      // eslint-disable-next-line no-console
      console.error('[SearchBar] search failed', e);
    }
  };

  const handleSelectSuggestion = (s: PhotonFeature) => {
    isSelectingRef.current = true;
    const label = s.label ?? s.properties?.name ?? '';
    onChangeText(label);
    const coords = s.geometry?.coordinates;
    const radiusKm = 5;
    if (Array.isArray(coords) && coords.length >= 2) {
      const [lon, lat] = coords;
      // Aggiorna la geolocalizzazione visibile nel context (badge UI)
      setGeolocation({ lat, lon, label, radiusKm });
      // Aggiorna i filter state usati per costruire il payload (radius in metri)
      try {
        updateFilter('general', {
          centerLatitude: lat,
          centerLongitude: lon,
          // Non aggiorniamo più il raggio qui, lasciamo che il builder usi il default o il valore modificato dall'utente.
        });
      } catch (e) {
        // fallback: set dispatch direttamente se updateFilter non funziona
        console.error('[SearchBar] updateFilter failed', e);
      }
    } else {
      // Il suggerimento non ha coordinate: NON impostare lat/lon a 0 (causa payload con latitude=0).
      // Rimuoviamo la geolocalizzazione corrente e non scriviamo valori numerici di fallback nei filtri.
      setGeolocation(null);
      // Non aggiornare i filtri con centerLatitude/centerLongitude a 0:
      // lasciamo che il FilterPayloadBuilder gestisca l'assenza di geolocalizzazione.
      try {
        // opzionalmente possiamo pulire i campi nel filtro se necessario, ma evitiamo di scrivere 0
        // updateFilter('general', { centerLatitude: undefined, centerLongitude: undefined });
      } catch (e) {
        console.error('[SearchBar] updateFilter skipped/failed', e);
      }
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
                {t('Filters')}
              </ThemedText>

              {activeCountFromHook > 0 && (
                <ThemedView className="absolute -top-2 -right-2 min-w-[18px] h-5 bg-white rounded-full border border-gray-200 items-center justify-center px-1">
                  <ThemedText className="text-xs font-bold leading-tight">
                    {activeCountFromHook}
                  </ThemedText>
                </ThemedView>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <SuggestionsDisplayer onSelectSuggestion={handleSelectSuggestion} suggestions={suggestions} />

      </ThemedView>
    </ThemedView>
  );
};

