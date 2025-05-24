import React, { useState } from 'react';
import { View, FlatList } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedIcon } from '@/components/ThemedIcon';
import { SearchAndFilter } from '../SearchIntegration/SearchAndFilter';
import { BuyerPropertyCard } from '../BuyerPropertyCard';
import { PropertyDetail } from '@/components/Agent/PropertyDashboard/types';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Pressable } from 'react-native';

interface SearchResultsViewProps {
  properties: PropertyDetail[];
  // onSearch: (query: string) => void; // Rimosso
  onPropertyPress: (propertyId: number) => void;
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (property: PropertyDetail) => void;
}

export const SearchResultsView: React.FC<SearchResultsViewProps> = ({
  properties,
  // onSearch, // Rimosso
  onPropertyPress,
  isFavorite,
  onToggleFavorite,
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const tint = useThemeColor({}, 'tint');

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'list' ? 'map' : 'list');
  };

  return (
    <ThemedView className="flex-1">
      <View className="flex-row items-center py-2 pr-2 border-b" style={{ borderColor: useThemeColor({}, 'border') }}>
        <View className="flex-1 mr-2">
          <SearchAndFilter
            // onSearch e onFiltersChange rimosse perché gestite dal SearchContext
            placeholder="Cerca immobili..."
            categories={{
              residential: { name: "Residenziale" },
              commercial: { name: "Commerciale" },
              industrial: { name: "Industriale" },
              land: { name: "Terreno" }
            }}
          />
        </View>
        <Pressable 
          onPress={toggleViewMode}
          className="pr-6"
        >
          <ThemedIcon 
            icon={viewMode === 'list' ? 'material-symbols:map-outline-rounded' : 'material-symbols:list-alt-outline-rounded'}
            size={24}
            lightColor={tint}
            darkColor={tint}
            accessibilityLabel={viewMode === 'list' ? 'Visualizza mappa' : 'Visualizza lista'}
          />
        </Pressable>
      </View>

      {viewMode === 'list' ? (
        <FlatList
          data={properties}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <BuyerPropertyCard
              property={item}
              onPress={() => onPropertyPress(item.id)}
              isFavorite={isFavorite(String(item.id))}
              onToggleFavorite={() => onToggleFavorite(item)}
            />
          )}
          ListEmptyComponent={() => (
            <ThemedView className="flex-1 items-center justify-center p-8">
              <ThemedText className="text-center text-gray-500">
                Nessun risultato trovato per questa ricerca
              </ThemedText>
            </ThemedView>
          )}
        />
      ) : (
        <ThemedView className="flex-1 items-center justify-center">
          <ThemedText>Visualizzazione mappa in arrivo...</ThemedText>
        </ThemedView>
      )}
    </ThemedView>
  );
};