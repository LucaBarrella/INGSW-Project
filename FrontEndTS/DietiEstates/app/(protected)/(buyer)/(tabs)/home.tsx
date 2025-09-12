import React, { useState, useEffect, useCallback } from 'react';
import { View, ActivityIndicator, SafeAreaView, FlatList, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { BuyerPropertyCard } from '@/components/Buyer/BuyerPropertyCard';
import { CategoryButton } from '@/components/Buyer/CategoryButton';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useFavorites } from '@/hooks/useFavorites';
import { SearchAndFilter, Categories } from '@/components/Buyer/SearchIntegration';
import ApiService from '@/app/_services/api.service'; // Importa ApiService
import { PropertyDetail } from '@/components/Agent/PropertyDashboard/types'; // Usa il tipo unificato
import useInfiniteHistory from '@/hooks/useInfiniteHistory';
import HistoryPlaceholder from '@/components/Buyer/HistoryPlaceholder';

const CATEGORIES: Categories = {
  residential: {
    name: 'Residenziale'
  },
  commercial: {
    name: 'Commerciale'
  },
  industrial: {
    name: 'Industriale'
  },
  land: {
    name: 'Terreno'
  }
};

const CATEGORY_ICONS = {
  residential: 'mdi:home',
  commercial: 'mdi:office-building',
  industrial: 'mdi:factory',
  land: 'mdi:land-fields'
};

export default function HomeTab() {
  const router = useRouter();
  const backgroundColor = useThemeColor({}, 'background');
  const errorColor = useThemeColor({}, 'tint'); // Placeholder per colore errore
  const { isFavorite, toggleFavorite } = useFavorites();
  const [featuredProperties, setFeaturedProperties] = useState<PropertyDetail[]>([]); // Usa il tipo unificato
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Hook per la cronologia infinite (PLAN.md)
  const {
    properties,
    isLoading: historyIsLoading,
    isFetchingMore,
    error: historyError,
    loadInitialHistory,
    loadMoreHistory
  } = useInfiniteHistory();

  const handleCategoryPress = (category: string) => {
    router.push({
      pathname: '/(protected)/(buyer)/search',
      params: { category, triggerSearch: 'true' }
    });
  };

  // handleSearch is no longer needed here as SearchAndFilter updates the context directly.
  // Navigation will be triggered by onSearchSubmitNavigate.

  // handleFiltersChange is no longer needed here as FilterPanel updates the context directly.
  // The search results page will react to context changes.

  const handleSearchSubmitNavigate = () => {
    console.log('[HomeTab] Navigating to search results page with triggerSearch=true.');
    router.push({
      pathname: '/(protected)/(buyer)/search',
      params: { triggerSearch: 'true' }
    });
  };

  const handlePropertyPress = (propertyId: number) => { // Accetta ID numerico
    // TODO: Navigare alla schermata dettagli immobile
    console.log('Property pressed:', propertyId);
  };

  // Funzione per recuperare le proprietà in evidenza
  const fetchFeaturedProperties = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('Fetching featured properties...');
      const data = await ApiService.getFeaturedProperties();
      // TODO: Adattare 'data' alla struttura attesa PropertyDetail[]
      // Esempio: const adaptedData = data.map(item => ({ ...item, price: String(item.price), id: Number(item.id) }));
      console.log(data);
      setFeaturedProperties(data || []);
    } catch (err) {
      console.error("Error fetching featured properties:", err);
      setError("Impossibile caricare gli immobili in evidenza."); // Messaggio di errore generico
      setFeaturedProperties([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // useEffect per caricare i dati al mount
  useEffect(() => {
    fetchFeaturedProperties();
  }, [fetchFeaturedProperties]);

  // carica la cronologia al mount
  useEffect(() => {
    loadInitialHistory().catch((err) => {
      console.error('[HomeTab] loadInitialHistory failed', err);
    });
  }, [loadInitialHistory]);

  return (
    <ThemedView style={{ flex: 1, backgroundColor }}>
      {/* SearchAndFilter fissata in alto, contenuto scrollabile dentro ScrollView (pattern agente) */}
      <SearchAndFilter
        placeholder="Cerca immobili..."
        categories={CATEGORIES}
        onSearchSubmitNavigate={handleSearchSubmitNavigate}
      />

      <ScrollView contentContainerStyle={{ padding: 16 }} className="flex-grow">
        <View className="flex-row flex-wrap justify-between gap-y-4">
          {Object.entries(CATEGORIES).map(([key, category]) => (
            <View key={key} className="w-[48%]">
              <CategoryButton
                icon={CATEGORY_ICONS[key as keyof typeof CATEGORY_ICONS]}
                label={category.name}
                onPress={() => handleCategoryPress(key)}
              />
            </View>
          ))}
        </View>

        <View className="mt-6">
          <ThemedText className="text-xl font-semibold mb-4">Immobili che hai visto</ThemedText>

          {historyIsLoading ? (
            <ActivityIndicator size="large" className="my-4" />
          ) : historyError ? (
            <ThemedText style={{ color: errorColor }} className="text-center my-4">
              {historyError}
            </ThemedText>
          ) : properties && properties.length === 0 ? (
            // Quando la cronologia è vuota, renderizziamo il placeholder fuori dal FlatList orizzontale
            <View style={{ alignItems: 'center' }}>
              <HistoryPlaceholder />
            </View>
          ) : (
            // Lista orizzontale dei recenti
            <View className="w-full overflow-hidden">
              <FlatList
                data={properties}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => String(item.id)}
                contentContainerStyle={{ paddingHorizontal: 4 }}
                style={{ width: '100%' }}
                renderItem={({ item }) => (
                  <ThemedView style={{ marginRight: 12, width: 280 }}>
                    <BuyerPropertyCard
                      property={item}
                      onPress={() => handlePropertyPress(item.id)}
                      isFavorite={isFavorite(String(item.id))}
                      onToggleFavorite={() => toggleFavorite(item)}
                    />
                  </ThemedView>
                )}
                ListFooterComponent={isFetchingMore ? <ActivityIndicator size="small" className="my-4" /> : null}
                onEndReached={loadMoreHistory}
                onEndReachedThreshold={0.5}
                nestedScrollEnabled={false}
              />
            </View>
          )}
        </View>

        <View style={{ marginTop: 20 }} className="flex flex-col">
          {isLoading ? (
            <ActivityIndicator size="large" className="my-4" />
          ) : featuredProperties && featuredProperties.length > 0 ? (
            featuredProperties.map((item) => (
              <ThemedView key={String(item.id)} style={{ marginBottom: 16 }}>
                <BuyerPropertyCard
                  property={item}
                  onPress={() => handlePropertyPress(item.id)}
                  isFavorite={isFavorite(String(item.id))}
                  onToggleFavorite={() => toggleFavorite(item)}
                />
              </ThemedView>
            ))
          ) : (
            <ThemedText className="text-center my-4">Nessun immobile in evidenza</ThemedText>
          )}
        </View>

        <SafeAreaView style={{ height: 40 }} />
      </ScrollView>
    </ThemedView>
  );
}

