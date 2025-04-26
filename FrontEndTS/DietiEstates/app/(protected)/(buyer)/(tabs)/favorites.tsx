import React from 'react';
import { ScrollView, Alert } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { BuyerPropertyCard } from '@/components/Buyer/BuyerPropertyCard';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useFavorites } from '@/hooks/useFavorites';

export default function FavoritesTab() {
  const backgroundColor = useThemeColor({}, 'background');
  const { getFavorites, toggleFavorite, isLoading } = useFavorites();

  const favoriteProperties = getFavorites();

  const handlePropertyPress = (propertyId: string) => {
    console.log('Property pressed:', propertyId);
    // TODO: Navigate to property details
  };

  return (
    <ThemedView style={{ flex: 1, backgroundColor }}>
      <ThemedView className="p-4 bg-white">
        <ThemedText className="text-xl font-semibold">
          I tuoi Preferiti
        </ThemedText>
      </ThemedView>
      
      {isLoading ? (
        <ThemedView className="flex-1 items-center justify-center">
          <ThemedText>Caricamento preferiti...</ThemedText>
        </ThemedView>
      ) : (
        <ScrollView 
        className="flex-1 px-4"
        contentContainerStyle={{ paddingVertical: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {favoriteProperties.length === 0 ? (
          <ThemedText className="text-center text-gray-500">
            Non hai ancora aggiunto preferiti
          </ThemedText>
        ) : (
          favoriteProperties.map(property => (
            <BuyerPropertyCard
              key={property.id}
              property={property}
              onPress={() => handlePropertyPress(property.id)}
              isFavorite={true}
              onToggleFavorite={() => toggleFavorite(property)}
            />
          ))
        )}
      </ScrollView>
      )}
    </ThemedView>
  );
}
