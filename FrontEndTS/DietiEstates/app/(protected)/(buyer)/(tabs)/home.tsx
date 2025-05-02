import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { BuyerPropertyCard } from '@/components/Buyer/BuyerPropertyCard';
import { CategoryButton } from '@/components/Buyer/CategoryButton';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useFavorites } from '@/hooks/useFavorites';
import { SearchAndFilter, Categories, PropertyFilters } from '@/components/Buyer/SearchIntegration';
import ApiService from '@/app/_services/api.service'; // Importa ApiService
import { PropertyDetail } from '@/components/Agent/PropertyDashboard/types'; // Usa il tipo unificato

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

  const handleCategoryPress = (category: string) => {
    router.push({
      pathname: '/(protected)/(buyer)/search',
      params: { category }
    });
  };

  const handleSearch = (query: string) => {
    router.push({
      pathname: '/(protected)/(buyer)/search',
      params: { query }
    });
  };

  const handleFiltersChange = (filters: PropertyFilters) => {
    console.log('Filters updated:', filters);
    router.push({
      pathname: '/(protected)/(buyer)/search',
      params: { 
        filters: JSON.stringify(filters)
      }
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

  return (
    <ThemedView style={{ flex: 1, backgroundColor }}>
      <SearchAndFilter
        onSearch={handleSearch}
        onFiltersChange={handleFiltersChange}
        placeholder="Cerca immobili..."
        categories={CATEGORIES}
      />
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      >
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
          <ThemedText className="text-xl font-semibold mb-4">
            In Evidenza
          </ThemedText>
          {isLoading ? (
            <ActivityIndicator size="large" className="my-4" />
          ) : error ? (
            <ThemedText style={{ color: errorColor }} className="text-center my-4">
              {error}
            </ThemedText>
          ) : featuredProperties.length > 0 ? (
            featuredProperties.map((property) => (
              <ThemedView key={property.id} style={{ marginBottom: 16 }}>
                <BuyerPropertyCard
                  property={property}
                  onPress={() => handlePropertyPress(property.id)} // Passa ID numerico
                  isFavorite={isFavorite(String(property.id))} // Passa ID come stringa a isFavorite
                  onToggleFavorite={() => toggleFavorite(property)} // Passa l'oggetto PropertyDetail
                />
              </ThemedView>
            ))
          ) : (
            <ThemedText className="text-center text-gray-500 my-4">
              Nessun immobile in evidenza al momento.
            </ThemedText>
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
}
