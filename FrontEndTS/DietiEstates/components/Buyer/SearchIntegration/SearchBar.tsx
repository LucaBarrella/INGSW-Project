import React, { useEffect, useState, useRef } from 'react';
import { TextInput, TouchableOpacity, View, Text, StyleSheet, Platform } from 'react-native';
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
  const borderColor = useThemeColor({}, 'border');
  const buttonTextColor = useThemeColor({}, 'buttonTextColor');
  const { t } = useTranslation();

  const { state, setGeolocation } = useSearch();
  
  const [suggestions, setSuggestions] = useState<PhotonFeature[]>([]);
  const isSelectingRef = useRef(false);
  const lastQueryRef = useRef<string>('');
  const { getSuggestions, activeFiltersCount: activeCountFromHook, updateFilter, search } = useSearchProperties();

  useEffect(() => {
    if (isSelectingRef.current) {
      isSelectingRef.current = false;
      return;
    }

    const q = value?.trim() ?? '';

    if (state.geolocation && q === state.geolocation.label) {
      setSuggestions([]);
      return;
    }

    if (!q || q.length < 2) {
      setSuggestions([]);
      lastQueryRef.current = '';
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const suggestionsFromRepo = await getSuggestions(q);
        setSuggestions(suggestionsFromRepo || []);
        lastQueryRef.current = q;
      } catch (err) {
        console.error('[SearchBar] error fetching suggestions', err);
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [value, getSuggestions]);

  const handleSubmit = async () => {
    if (onSearchPress) {
      onSearchPress();
    }
    try {
      await search();
    } catch (e) {
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
      setGeolocation({ lat, lon, label, radiusKm });
      try {
        updateFilter('general', {
          centerLatitude: lat,
          centerLongitude: lon,
        });
      } catch (e) {
        console.error('[SearchBar] updateFilter failed', e);
      }
    } else {
      setGeolocation(null);
    }
    setSuggestions([]);
  };

  const hasSuggestions = suggestions.length > 0;

  return (
    <View className="w-full px-6 py-2">
      <View
        className={`rounded-[30px] overflow-hidden`}
        style={[
          styles.container,
          {
            backgroundColor,
            borderColor: borderColor + '20',
          }
        ]}
      >
        <View style={styles.contentRow}>
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={!value.trim()}
            style={styles.searchIconContainer}
            activeOpacity={0.7}
          >
            <Ionicons
              name="search-outline"
              size={22}
              color={value.trim() ? accentColor : textColor + '60'}
            />
          </TouchableOpacity>

          <View style={styles.inputWrapper}>
            <TextInput
              value={value}
              onChangeText={onChangeText}
              placeholder={state.geolocation ? `Cerca a ${state.geolocation.label}...` : placeholder}
              style={[styles.input, { color: textColor }]}
              placeholderTextColor={textColor + '60'}
              returnKeyType="search"
              onSubmitEditing={handleSubmit}
              underlineColorAndroid="transparent"
              textAlignVertical="center"
            />

            {(state.geolocation || value.length > 0) && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => {
                  setGeolocation(null);
                  onChangeText('');
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

          <View
            style={[styles.divider, { backgroundColor: borderColor + '60' }]}
          />

          <View style={styles.filterContainer}>
            <TouchableOpacity
              onPress={onFilterPress}
              style={styles.filterButton}
              activeOpacity={0.7}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons
                  name="options"
                  size={22}
                  color={accentColor}
                />
                <Text style={{ color: accentColor, marginLeft: 6, fontWeight: '600', fontSize: 14 }}>
                  {t('Filters')}
                </Text>
              </View>

              {activeCountFromHook > 0 && (
                <View
                  style={[styles.badge, { backgroundColor: accentColor }]}
                >
                  <Text
                    style={[styles.badgeText, { color: buttonTextColor }]}
                  >
                    {activeCountFromHook}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {hasSuggestions && (
          <View
            style={[styles.suggestionsContainer, { borderTopWidth: 0 }]}
          >
            <SuggestionsDisplayer onSelectSuggestion={handleSelectSuggestion} suggestions={suggestions} />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 0.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 60,
  },
  searchIconContainer: {
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
    paddingHorizontal: 0,
    margin: 0,
    height: '100%',
    ...Platform.select({
      android: {
        includeFontPadding: false,
      },
    }),
  },
  clearButton: {
    paddingHorizontal: 8,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    width: 2,
    height: 28,
    marginHorizontal: 8,
    borderRadius: 1,
  },
  filterContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  filterButton: {
    height: 40,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 1,
    right: 1,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    lineHeight: 14,
    textAlign: 'center',
  },
  suggestionsContainer: {
    borderTopWidth: 1,
  },
});
