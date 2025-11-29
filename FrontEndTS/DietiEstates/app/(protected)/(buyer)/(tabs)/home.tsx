import React, { useEffect } from 'react';
import { View, ActivityIndicator, SafeAreaView, FlatList, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { BuyerPropertyCard } from '@/components/Buyer/BuyerPropertyCard';
import { CategoryButton } from '@/components/Buyer/CategoryButton';
import { useThemeColor } from '@/hooks/useThemeColor';
import { SearchAndFilter, Categories } from '@/components/Buyer/SearchIntegration';
// import ApiService from '@/src/services/api.service'; // Importa ApiService
import useInfiniteHistory from '@/hooks/useInfiniteHistory';
import HistoryPlaceholder from '@/components/Buyer/HistoryPlaceholder';
import { useTranslation } from 'react-i18next';

const CATEGORIES: Categories = {
  residential: {
    name: 'residential_property'
  },
  commercial: {
    name: 'commercial_property'
  },
  garage: {
    name: 'garage'
  },
  land: {
    name: 'land'
  }
};

const CATEGORY_ICONS = {
  residential: 'mdi:home',
  commercial: 'mdi:office-building',
  garage: 'mdi:garage',
  land: 'mdi:land-fields'
};

export default function HomeTab() {
  const router = useRouter();
  const { t } = useTranslation();
  const backgroundColor = useThemeColor({}, 'background');
  const errorColor = useThemeColor({}, 'tint'); // Placeholder per colore errore

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
        placeholder={t('searchPlaceholder')}
        categories={CATEGORIES}
        onSearchTrigger={handleSearchSubmitNavigate}
      />

      <ScrollView contentContainerStyle={{ padding: 16 }} className="flex-grow">
        <View className="flex-row flex-wrap justify-between gap-y-4">
          {Object.entries(CATEGORIES).map(([key, category]) => (
            <View key={key} className="w-[48%]">
              <CategoryButton
                icon={CATEGORY_ICONS[key as keyof typeof CATEGORY_ICONS]}
                label={t("property_category." + category.name)}
                onPress={() => handleCategoryPress(key)}
              />
            </View>
          ))}
        </View>

        <View className="mt-6">
          <ThemedText className="text-xl font-semibold mb-4">{t('propertiesYouHaveSeen')}</ThemedText>

          {historyIsLoading ? (
            <ActivityIndicator size="large" className="my-4" />
          ) : historyError ? (
            <ThemedText style={{ color: errorColor }} className="text-center my-4">
              {historyError}
            </ThemedText>
          ) : properties && properties.length === 0 ? (
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


        <SafeAreaView style={{ height: 40 }} />
      </ScrollView>
    </ThemedView>
  );
}

