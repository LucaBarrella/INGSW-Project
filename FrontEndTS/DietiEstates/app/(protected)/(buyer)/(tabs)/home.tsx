import React from 'react';
import { View, ActivityIndicator, FlatList, SafeAreaView } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { BuyerPropertyCard } from '@/components/Buyer/BuyerPropertyCard';
import { CategoryButton } from '@/components/Buyer/CategoryButton';
import { useThemeColor } from '@/hooks/useThemeColor';
import { SearchAndFilter, Categories } from '@/components/Buyer/SearchIntegration';
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
  const errorColor = useThemeColor({}, 'tint');

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

  const handleSearchSubmitNavigate = () => {
    console.log('[HomeTab] Navigating to search results page with triggerSearch=true.');
    router.push({
      pathname: '/(protected)/(buyer)/search',
      params: { triggerSearch: 'true' }
    });
  };

  const handlePropertyPress = (propertyId: number) => {
    router.push({
      pathname: '/(protected)/(buyer)/property-detail',
      params: { propertyId: propertyId.toString() },
    });
  };


  // carica la cronologia al mount
  useFocusEffect(
    React.useCallback(() => {
      console.log('[HomeTab] Screen focused, reloading history.');
      loadInitialHistory().catch((err) => {
        console.error('[HomeTab] loadInitialHistory failed on focus', err);
      });
    }, [loadInitialHistory])
  );

  const ListHeader = (
    <View style={{ padding: 16, paddingBottom: 0 }}>
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
      <View className="mt-6 mb-4">
        <ThemedText className="text-xl font-semibold">{t('propertiesYouHaveSeen')}</ThemedText>
      </View>
    </View>
  );

  const EmptyListComponent = (
    <View style={{padding: 16, alignItems: 'center'}}>
      {historyIsLoading ? (
        <ActivityIndicator size="large" className="my-4" />
      ) : historyError ? (
        <ThemedText style={{ color: errorColor }} className="text-center my-4">
          {historyError}
        </ThemedText>
      ) : (
        <HistoryPlaceholder />
      )}
    </View>
  );

  return (
    <ThemedView style={{ flex: 1, backgroundColor }}>
      <SearchAndFilter
        placeholder={t('searchPlaceholder')}
        categories={CATEGORIES}
        onSearchTrigger={handleSearchSubmitNavigate}
      />
      <SafeAreaView style={{ flex: 1 }}>
        <FlatList
          data={properties}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 80 }}
          ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
          renderItem={({ item }) => (
            <BuyerPropertyCard
              property={item}
              onPress={() => handlePropertyPress(item.id)}
            />
          )}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={EmptyListComponent}
          ListFooterComponent={isFetchingMore ? <ActivityIndicator size="large" className="my-4" /> : null}
          onEndReached={loadMoreHistory}
          onEndReachedThreshold={0.5}
        />
      </SafeAreaView>
    </ThemedView>
  );
}

