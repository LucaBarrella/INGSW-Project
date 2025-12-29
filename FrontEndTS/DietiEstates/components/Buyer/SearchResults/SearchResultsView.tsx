import React from 'react';
import { View, FlatList, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedIcon } from '@/components/ThemedIcon';
import { SearchAndFilter } from '../SearchIntegration/SearchAndFilter';
import { PropertyCard } from '@/components/Agent/PropertyListing/PropertyCard';
import { PropertyDetail } from '@/components/Agent/PropertyDashboard/types';
import { useThemeColor } from '@/hooks/useThemeColor';
import MapView, { Marker } from 'react-native-maps';
import { t } from 'i18next';
import { useRouter } from 'expo-router';
import useSearchProperties from '@/src/hooks/useSearchProperties';

const router = useRouter();

interface SearchResultsViewProps {
  properties?: PropertyDetail[]; // opzionale: preferiamo usare l'hook interno
  onSearchTrigger?: () => void;
  onChangeCenter: (lat: number, lon: number) => void;
  viewMode: 'list' | 'map';
  setViewMode: React.Dispatch<React.SetStateAction<"list" | "map">>;
  center?: { latitude: number; longitude: number };
}

const handleDetailsPress = (propertyId : number) => {
  router.push({
    pathname: '/(protected)/(buyer)/property-detail',
    params: { propertyId },
  });
};

export const SearchResultsView: React.FC<SearchResultsViewProps> = ({
  properties,
  onSearchTrigger,
  onChangeCenter,
  viewMode,
  setViewMode,
  center
}) => {
  const tint = useThemeColor({}, 'tint');

  const {
    properties: hookProperties,
    isLoading,
    error,
    page,
    pageSize,
    totalPages,
    totalElements,
    goToPage,
    setPageSize,
    search,
    // infinite scroll helpers (exposed by useSearchProperties)
    loadMore,
    isFetchingMore,
    hasMore,
  } = useSearchProperties();

  const propertiesToRender = (properties && properties.length) ? properties : hookProperties;

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'list' ? 'map' : 'list');
  };

  const handlePrev = async () => {
    if (page > 0) await goToPage(page - 1);
  };

  const handleNext = async () => {
    // se totalPages è 0/unknown, proviamo a basarci sui risultati correnti
    if (typeof totalPages === 'number' && totalPages > 0) {
      if (page < totalPages - 1) await goToPage(page + 1);
    } else {
      // fallback: se il numero di risultati è pari al pageSize, potremmo esserci più pagine
      if (propertiesToRender.length === pageSize) await goToPage(page + 1);
    }
  };

  const handleSetPageSize = async (size: number) => {
    if (size !== pageSize) await setPageSize(size);
  };

  return (
    <ThemedView className="flex-1">
      <View className="flex-row items-center py-2 pr-2 border-b" style={{ borderColor: useThemeColor({}, 'border') }}>
        <View className="flex-1 mr-2">
          <SearchAndFilter
            placeholder={t('searchPlaceholder')}
            onSearchTrigger={onSearchTrigger ?? (async () => { try { await search(); } catch(e){ console.error(e); } })}
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

      {/* Stato caricamento / error */}
      {isLoading && (
        <ThemedView className="items-center justify-center p-4">
          <ActivityIndicator size="large" />
          <ThemedText className="mt-2 text-sm">{t('loading')}</ThemedText>
        </ThemedView>
      )}

      {error && (
        <ThemedView className="items-center justify-center p-4">
          <ThemedText className="text-red-500">{error}</ThemedText>
        </ThemedView>
      )}

      {viewMode === 'list' ? (
        <FlatList
          data={propertiesToRender}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={{ padding: 16 }}
          ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
          renderItem={({ item }) => (
            <PropertyCard
              property={item}
              onPress={() => handleDetailsPress(item.id)}
            />
          )}
          ListEmptyComponent={() => (
            !isLoading && (
              <ThemedView className="flex-1 items-center justify-center p-8">
                <ThemedText className="text-center text-gray-500">
                  {t('noSearchResults')}
                </ThemedText>
              </ThemedView>
            )
          )}
          ListFooterComponent={() => (
            // mostra spinner solo se stiamo caricando altri elementi e ci sono ancora elementi da caricare
            isFetchingMore && hasMore ? (
              <ActivityIndicator size="large" className="my-4" />
            ) : (
              <ThemedView className="items-center py-4">
                <ThemedText className="mt-2 text-sm text-gray-500">{`${totalElements ?? propertiesToRender.length} ${t('results')}`}</ThemedText>
              </ThemedView>
            )
          )}
          onEndReached={() => {
            if (!isLoading && !isFetchingMore && hasMore && typeof loadMore === 'function') {
              loadMore().catch((err: any) => console.error('[SearchResultsView] loadMore failed', err));
            }
          }}
          onEndReachedThreshold={0.5}
        />
      ) : (
        <View style={styles.container}>
          <MapView style={styles.map} region={center? { latitudeDelta: 0.1, longitudeDelta:0.1, ...center } : undefined} onLongPress={event => {onChangeCenter(event.nativeEvent.coordinate.latitude, event.nativeEvent.coordinate.longitude)}} >
            {propertiesToRender.map((property, index) => (
              property.address.latitude && property.address.longitude && <Marker
                key={index}
                coordinate={{ latitude: property.address.latitude, longitude: property.address.longitude }}
                title={`€${property.price.toLocaleString()}`}
                description={property.description}
                onPress={() => handleDetailsPress(property.id)}
              />
            ))}
            
            {center && <Marker coordinate={{latitude: center.latitude, longitude: center.longitude}} pinColor={ "#c7f4ffff" }/>}
          </MapView>
        </View>
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});