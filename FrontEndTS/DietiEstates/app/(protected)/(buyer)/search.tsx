import React, { useState, useEffect } from 'react';
import { FlatList, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { BuyerPropertyCard } from '@/components/Buyer/BuyerPropertyCard';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Property } from '@/components/Agent/PropertyListing/types';

export default function SearchResultsScreen() {
  const params = useLocalSearchParams<{ category?: string; query?: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [properties, setProperties] = useState<Property[]>([]);
  const backgroundColor = useThemeColor({}, 'background');
  
  const searchTitle = params?.category ? 
    `${params.category[0].toUpperCase()}${params.category.slice(1)}` : 
    params?.query || 'Ricerca';

  // TODO: Replace with real API call
  const fetchProperties = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      const mockData: Property[] = [
        {
          id: '1',
          title: 'Villa Moderna',
          address: 'Via Roma 123, Milano',
          price: 450000,
          imageUrl: 'https://picsum.photos/800/600',
          type: params?.category || 'Villa',
          status: 'Available'
        },
        {
          id: '2',
          title: 'Attico di Lusso',
          address: 'Via Montenapoleone 1, Milano',
          price: 850000,
          imageUrl: 'https://picsum.photos/800/600',
          type: params?.category || 'Attico',
          status: 'Available'
        }
      ];
      setProperties(mockData);
    } catch (error) {
      console.error('Error fetching properties:', error);
      setProperties([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [params?.category, params?.query]);

  const handlePropertyPress = (propertyId: string) => {
    // TODO: Navigate to property details
    console.log('Property pressed:', propertyId);
  };

  return (
    <ThemedView style={{ flex: 1, backgroundColor }}>
      <Stack.Screen 
        options={{
          title: `${searchTitle} (${properties.length})`,
          headerTitleStyle: { fontSize: 18 }
        }}
      />
      
      {isLoading ? (
        <ThemedView className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
        </ThemedView>
      ) : (
        <FlatList
          data={properties}
          keyExtractor={item => item.id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <BuyerPropertyCard
              property={item}
              onPress={() => handlePropertyPress(item.id)}
              isFavorite={false}
              onToggleFavorite={() => {}}
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
      )}
    </ThemedView>
  );
}
