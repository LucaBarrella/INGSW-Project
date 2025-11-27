import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { useSearch } from '@/context/SearchContext';
import useSearchProperties from '@/src/hooks/useSearchProperties';
import useSearchUrlState from '@/src/hooks/useSearchUrlState';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { SearchResultsView } from '@/components/Buyer/SearchResults/SearchResultsView';

export default function SearchResultsScreen() {
  // Legge params URL per titoli/categoria (solo lettura; il triggerSearch è stato rimosso)
  const params = useLocalSearchParams<{ category?: string; query?: string; contract?: 'rent' | 'sale' }>();
  const { state } = useSearch();
  const { properties, isLoading, error, search } = useSearchProperties();
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  // URL <-> Context synchronization is handled by useSearchUrlState to centralize logic and avoid scattered effects
  useSearchUrlState();


  const searchTitle = params?.category
    ? `${params.category[0].toUpperCase()}${params.category.slice(1)}`
    : params?.query || state.searchQuery || 'Ricerca';

  // Trigger search once after URL params are synced and storage is loaded
  useEffect(() => {
    if (!state.isLoadingFromStorage) {
      search().catch(err => {
        console.error('[SearchScreen] Initial search failed:', err);
      });
    }
  }, [state.isLoadingFromStorage, search]);

  useEffect(() => {
    console.log('[SearchScreen] Properties state updated:', properties);
  }, [properties]);

  useEffect(() => {
    if (error) {
      console.log('[SearchScreen] Error state updated:', error);
    }
  }, [error]);

  const handlePropertyPress = (propertyId: number) => {
    router.push({
      pathname: '/(protected)/(buyer)/property-detail',
      params: { propertyId: propertyId },
    });
  };

  return (
    <ThemedView className="flex-1">
      <Stack.Screen
        options={{
          title: searchTitle,
          headerTitleStyle: { fontSize: 18 }
        }}
      />
      
      {isLoading ? (
        <ThemedView className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
        </ThemedView>
      ) : error ? (
        <ThemedView className="flex-1 items-center justify-center p-4">
          <ThemedText className="text-red-500 text-center">{error}</ThemedText>
        </ThemedView>
      ) : (
        <SearchResultsView
          properties={properties}
          onPropertyPress={handlePropertyPress}
          onSearchTrigger={search}
          onChangeCenter={(newLat, newLng) => {
            if (state.geolocation) {
              state.geolocation.lat = newLat;
              state.geolocation.lon = newLng;
              //trigger a new search with updated center
              search().catch(err => {
                Alert.alert('Errore', 'Si è verificato un errore durante la ricerca con la nuova posizione.');
                console.error('[SearchScreen] search failed', err);
              });
            }
          }}
          viewMode={viewMode}
          setViewMode={setViewMode}
          center={state.geolocation ? { latitude: state.geolocation.lat, longitude: state.geolocation.lon } : undefined}
        />
      )}
    </ThemedView>
  );
}
