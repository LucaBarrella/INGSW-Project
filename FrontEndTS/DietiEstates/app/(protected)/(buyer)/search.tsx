import React, { useState, useEffect, useCallback } from 'react';
import { ActivityIndicator } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { useSearch } from '@/context/SearchContext';
import { PropertyFilters, RESIDENTIAL_CATEGORIES, COMMERCIAL_CATEGORIES, INDUSTRIAL_CATEGORIES, LAND_CATEGORIES } from '@/components/Buyer/SearchIntegration/types';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { PropertyDetail } from '@/components/Agent/PropertyDashboard/types';
import ApiService from '@/app/_services/api.service';
import { useFavorites } from '@/hooks/useFavorites';
import { SearchResultsView } from '@/components/Buyer/SearchResults/SearchResultsView';

export default function SearchResultsScreen() {
  // Aggiunto triggerSearch al tipo dei parametri URL
  const params = useLocalSearchParams<{ category?: string; query?: string; transactionType?: 'rent' | 'sale', triggerSearch?: string }>();
  const { state, dispatch } = useSearch();
  const [isLoading, setIsLoading] = useState(true); // Mantenuto per il caricamento dei dati API
  const [properties, setProperties] = useState<PropertyDetail[]>([]);
  const { isFavorite, toggleFavorite } = useFavorites();
  const [error, setError] = useState<string | null>(null);

  // Effetto per sincronizzare i parametri URL con il SearchContext
  useEffect(() => {
    console.log('[SearchScreen] Syncing URL params to context. Current params:', JSON.stringify(params));
    console.log('[SearchScreen] Context state BEFORE sync:', {
      query: state.searchQuery,
      filters: JSON.stringify(state.filters.general), // Log solo general per brevità
      selectedCat: state.selectedMainCategoryInPanel
    });

    let dispatchNeeded = false;

    if (params.query && params.query !== state.searchQuery) {
      console.log(`[SearchScreen] URL query ("${params.query}") differs from context ("${state.searchQuery}"). Dispatching SET_QUERY.`);
      dispatch({ type: 'SET_QUERY', payload: params.query });
      dispatchNeeded = true;
    }

    if (params.category) {
      const categoryKey = params.category.toLowerCase() as keyof Omit<PropertyFilters, 'general'>;
      if (['residential', 'commercial', 'industrial', 'land'].includes(categoryKey)) {
        if (categoryKey !== state.selectedMainCategoryInPanel) {
          console.log(`[SearchScreen] URL category ("${categoryKey}") differs from context selectedMainCategoryInPanel ("${state.selectedMainCategoryInPanel}"). Dispatching SET_SELECTED_MAIN_CATEGORY_IN_PANEL.`);
          dispatch({ type: 'SET_SELECTED_MAIN_CATEGORY_IN_PANEL', payload: categoryKey });
          dispatchNeeded = true;
        }
        
        let defaultSubCategory;
        switch (categoryKey) {
            case 'residential': defaultSubCategory = RESIDENTIAL_CATEGORIES[0]; break;
            case 'commercial': defaultSubCategory = COMMERCIAL_CATEGORIES[0]; break;
            case 'industrial': defaultSubCategory = INDUSTRIAL_CATEGORIES[0]; break;
            case 'land': defaultSubCategory = LAND_CATEGORIES[0]; break;
        }

        const currentCategoryFilter = state.filters[categoryKey];
        if (defaultSubCategory && currentCategoryFilter?.category !== defaultSubCategory) {
            console.log(`[SearchScreen] Default subCategory for ${categoryKey} ("${defaultSubCategory}") differs from context filter ("${currentCategoryFilter?.category}"). Dispatching UPDATE_FILTER.`);
            dispatch({
                type: 'UPDATE_FILTER',
                payload: { category: categoryKey, newFilters: { category: defaultSubCategory } },
            });
            dispatchNeeded = true;
        }
      }
    }
    
    if (params.transactionType && params.transactionType !== state.filters.general.transactionType) {
        console.log(`[SearchScreen] URL transactionType ("${params.transactionType}") differs from context ("${state.filters.general.transactionType}"). Dispatching UPDATE_FILTER for general.`);
        dispatch({
            type: 'UPDATE_FILTER',
            payload: { subCategory: 'general', newFilters: { transactionType: params.transactionType } },
        });
        dispatchNeeded = true;
    }

    if (dispatchNeeded) {
      console.log('[SearchScreen] Dispatches were made based on URL params.');
    } else {
      console.log('[SearchScreen] No dispatches needed based on URL params, context is in sync or params are not set.');
    }
    // Non è necessario loggare lo stato DOPO qui perché il dispatch è asincrono e lo stato aggiornato
    // sarà visibile al prossimo render o nel log del reducer.
  }, [params, dispatch, state.searchQuery, state.filters, state.selectedMainCategoryInPanel]);


  const searchTitle = params?.category
    ? `${params.category[0].toUpperCase()}${params.category.slice(1)}`
    : params?.query || state.searchQuery || 'Ricerca';


  // Funzione per recuperare le proprietà tramite API
  const fetchProperties = useCallback(async (queryToUse: string, filtersToUse: PropertyFilters) => {
    // Non procedere se lo stato sta ancora caricando da AsyncStorage
    // Questo controllo è ancora valido perché isLoadingFromStorage è globale per il context.
    console.log('[SearchScreen] fetchProperties useCallback created. isLoadingFromStorage:', state.isLoadingFromStorage);

    if (state.isLoadingFromStorage) {
      console.log("[SearchScreen] fetchProperties: SearchContext is still loading from AsyncStorage. Aborting fetch.");
      return;
    }
    
    console.log('[SearchScreen] fetchProperties: Attempting to fetch. Setting isLoading to true.');
    setIsLoading(true);
    setProperties([]); // Pulisce i risultati precedenti
    setError(null);

    try {
      // Usa queryToUse e filtersToUse invece di state.searchQuery e state.filters
      console.log('[SearchScreen] fetchProperties: Calling ApiService.searchProperties with:', {
        query: queryToUse,
        filters: JSON.stringify(filtersToUse, null, 2)
      });
      
      const results = await ApiService.searchProperties({ query: queryToUse, filters: filtersToUse });
      
      console.log('[SearchScreen] fetchProperties: API call successful. Results received:', {
        count: results?.length || 0,
        firstResult: results?.[0] || null
      });
      setProperties(results || []);
    } catch (err) {
      console.error('[SearchScreen] fetchProperties: Error fetching properties:', err);
      const errorMessage = err instanceof Error ? err.message : "Impossibile caricare i risultati della ricerca. Riprova più tardi.";
      setError(errorMessage);
      setProperties([]); // Assicura che la lista sia vuota in caso di errore
    } finally {
      console.log('[SearchScreen] fetchProperties: API call finished. Setting isLoading to false.');
      setIsLoading(false);
    }
  }, [state.isLoadingFromStorage]); // Rimosso state.searchQuery e state.filters

  // Rimosso l'useEffect che triggerava fetchProperties su ogni cambio di query/filtri.
  // La ricerca ora viene triggerata solo esplicitamente tramite il parametro URL triggerSearch,
  // dopo che il context è stato sincronizzato.

  useEffect(() => {
    console.log(`[SearchScreen] useEffect for triggerSearch triggered. isLoadingFromStorage: ${state.isLoadingFromStorage}, triggerSearch: ${params.triggerSearch}, contextQuery: ${state.searchQuery}, contextFilters: ${JSON.stringify(state.filters.general.transactionType)}`);
    
    // Esegue fetchProperties solo se il context ha finito di caricare E il parametro triggerSearch è presente
    if (!state.isLoadingFromStorage && params.triggerSearch === 'true') {
      console.log('[SearchScreen] useEffect for triggerSearch: isLoadingFromStorage is false and triggerSearch is true.');
      
      // L'effetto di sincronizzazione dei parametri URL (sopra) dovrebbe aver già aggiornato lo stato del context.
      // Quindi, possiamo fare affidamento su state.searchQuery e state.filters qui.
      const queryForFetch = state.searchQuery; 
      const filtersForFetch = state.filters;

      console.log('[SearchScreen] useEffect for triggerSearch: Calling fetchProperties with (from context state):', { 
        query: queryForFetch, 
        filters: JSON.stringify(filtersForFetch) 
      });
      fetchProperties(queryForFetch, filtersForFetch);
      
      // Rimuove il parametro triggerSearch dopo aver eseguito la ricerca.
      router.setParams({ triggerSearch: undefined });
      console.log('[SearchScreen] useEffect for triggerSearch: Removed triggerSearch param.');
    } else if (state.isLoadingFromStorage) {
       console.log('[SearchScreen] useEffect for triggerSearch: isLoadingFromStorage is true. Waiting...');
    } else if (params.triggerSearch !== 'true') {
       console.log('[SearchScreen] useEffect for triggerSearch: triggerSearch is not true. Not fetching.');
    }
  }, [
       state.isLoadingFromStorage, 
       params.triggerSearch, 
       state.searchQuery, // Aggiunto per rieseguire se la query nel context cambia (post-sincronizzazione)
       state.filters,     // Aggiunto per rieseguire se i filtri nel context cambiano (post-sincronizzazione)
       fetchProperties    // fetchProperties ora dipende solo da isLoadingFromStorage
     ]);

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
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
        />
      )}
    </ThemedView>
  );
}
