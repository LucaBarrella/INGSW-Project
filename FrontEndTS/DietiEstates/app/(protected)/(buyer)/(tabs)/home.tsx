import React from 'react';
import { ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { BuyerPropertyCard } from '@/components/Buyer/BuyerPropertyCard';
import { CategoryButton } from '@/components/Buyer/CategoryButton';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useFavorites } from '@/hooks/useFavorites';
import { SearchAndFilter, Categories, PropertyFilters } from '@/components/Buyer/SearchIntegration';

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
  const { isFavorite, toggleFavorite } = useFavorites();

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

  const mockProperty = {
    id: '1',
    title: 'Villa Moderna',
    address: 'Via Roma 123, Milano',
    price: 450000,
    imageUrl: 'https://picsum.photos/800/600',
    type: 'Villa',
    status: 'Available'
  };

  const handlePropertyPress = (propertyId: string) => {
    console.log('Property pressed:', propertyId);
  };

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
          <BuyerPropertyCard
            property={mockProperty}
            onPress={() => handlePropertyPress(mockProperty.id)}
            isFavorite={isFavorite(mockProperty.id)}
            onToggleFavorite={() => toggleFavorite(mockProperty)}
          />
        </View>
      </ScrollView>
    </ThemedView>
  );
}
