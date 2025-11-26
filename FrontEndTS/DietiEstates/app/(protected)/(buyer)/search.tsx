import React, { useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { useSearch } from '@/context/SearchContext';
import useSearchProperties from '@/src/hooks/useSearchProperties';
import useSearchUrlState from '@/src/hooks/useSearchUrlState';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { SearchResultsView } from '@/components/Buyer/SearchResults/SearchResultsView';

export default function SearchResultsScreen() {
  // Aggiunto triggerSearch al tipo dei parametri URL
  const params = useLocalSearchParams<{ category?: string; query?: string; contract?: 'rent' | 'sale', triggerSearch?: string }>();
  const { state } = useSearch();
  const { properties, isLoading, error, search } = useSearchProperties();

  // URL <-> Context synchronization is handled by useSearchUrlState to centralize logic and avoid scattered effects
  useSearchUrlState();


  const searchTitle = params?.category
    ? `${params.category[0].toUpperCase()}${params.category.slice(1)}`
    : params?.query || state.searchQuery || 'Ricerca';


  // La logica di recupero proprietà è ora delegata a useSearchProperties.search.
  // Il hook gestisce isLoading, error e properties.

  // Rimosso l'useEffect che triggerava fetchProperties su ogni cambio di query/filtri.
  // La ricerca ora viene triggerata solo esplicitamente tramite il parametro URL triggerSearch,
  // dopo che il context è stato sincronizzato.
  

  useEffect(() => {
    // La ricerca viene attivata solo quando triggerSearch è presente nell'URL.
    if (!state.isLoadingFromStorage && params.triggerSearch === 'true') {
      console.log('[SearchScreen] Triggering search from URL params...');
      search().catch(err => {
        console.error('[SearchScreen] search failed', err);
      });
      // Rimuovi il parametro per evitare ricerche multiple
      router.setParams({ triggerSearch: undefined });
    }
  }, [state.isLoadingFromStorage, params.triggerSearch, search]);

  useEffect(() => {
    console.log('[SearchScreen] Properties state updated:', properties);
  }, [properties]);

  useEffect(() => {
    if (error) {
      console.log('[SearchScreen] Error state updated:', error);
    }
  }, [error]);

  const handlePropertyPress = (propertyId: number) => {
    // TODO: Navigate to property details
    console.log('Property pressed:', propertyId);
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
          // onSearch non è più necessaria, SearchAndFilter aggiorna il context
          onPropertyPress={handlePropertyPress}
        />
      )}
    </ThemedView>
  );
}
