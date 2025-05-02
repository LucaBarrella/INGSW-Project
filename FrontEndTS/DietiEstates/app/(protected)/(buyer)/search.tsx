import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { BuyerPropertyCard } from '@/components/Buyer/BuyerPropertyCard';
import { useThemeColor } from '@/hooks/useThemeColor';
import { PropertyDetail } from '@/components/Agent/PropertyDashboard/types'; // Usa il tipo unificato
import ApiService from '@/app/_services/api.service'; // Importa ApiService
import { useFavorites } from '@/hooks/useFavorites'; // Importa l'hook useFavorites

export default function SearchResultsScreen() {
  const params = useLocalSearchParams<{ category?: string; query?: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [properties, setProperties] = useState<PropertyDetail[]>([]); // Usa il tipo unificato
  const backgroundColor = useThemeColor({}, 'background');
  const { isFavorite, toggleFavorite } = useFavorites(); // Usa l'hook
  
  const searchTitle = params?.category ? 
    `${params.category[0].toUpperCase()}${params.category.slice(1)}` : 
    params?.query || 'Ricerca';

  // Funzione per recuperare le proprietà tramite API
  const fetchProperties = useCallback(async () => {
    setIsLoading(true);
    setProperties([]); // Pulisce i risultati precedenti
    try {
      const searchParams: { category?: string; query?: string } = {};
      if (params?.category) {
        searchParams.category = params.category;
      }
      if (params?.query) {
        searchParams.query = params.query;
      }
      
      // TODO: Integrare qui eventuali altri filtri quando saranno implementati (Fase 4)

      console.log('Fetching properties with params:', searchParams); // Log per debug
      const results = await ApiService.searchProperties(searchParams);
      // TODO: Adattare 'results' alla struttura dati attesa da BuyerPropertyCard (PropertyDetail[])
      // Esempio: const adaptedResults = results.map(item => ({ ...item, price: String(item.price), id: Number(item.id) }));
      setProperties(results || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
      // Mostrare un messaggio di errore all'utente
      setError("Impossibile caricare i risultati della ricerca. Riprova più tardi."); // Imposta messaggio di errore
      setProperties([]); // Assicura che la lista sia vuota in caso di errore
    } finally {
      setIsLoading(false);
    }
  }, [params?.category, params?.query]); // Dipendenze dell'hook useCallback
  const [error, setError] = useState<string | null>(null); // Aggiunto stato per l'errore

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]); // useEffect dipende ora da fetchProperties (che ha le sue dipendenze)

  const handlePropertyPress = (propertyId: number) => { // Accetta ID numerico
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
      ) : error ? ( // Aggiunto controllo per l'errore
        <ThemedView className="flex-1 items-center justify-center p-4">
          <ThemedText className="text-red-500 text-center">{error}</ThemedText>
          {/* TODO: Aggiungere pulsante Riprova? */}
        </ThemedView>
      ) : (
        <FlatList
          data={properties}
          keyExtractor={item => String(item.id)} // Converte ID numerico in stringa per la key
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <BuyerPropertyCard
              property={item}
              onPress={() => handlePropertyPress(item.id)} // Passa ID numerico
              isFavorite={isFavorite(String(item.id))} // Passa ID come stringa a isFavorite
              onToggleFavorite={() => toggleFavorite(item)} // Passa l'oggetto PropertyDetail
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
