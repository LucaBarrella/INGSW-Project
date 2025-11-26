import React, { useState } from 'react';
import { View, FlatList, Pressable, StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedIcon } from '@/components/ThemedIcon';
import { SearchAndFilter } from '../SearchIntegration/SearchAndFilter';
import { BuyerPropertyCard } from '../BuyerPropertyCard';
import { PropertyDetail } from '@/components/Agent/PropertyDashboard/types';
import { useThemeColor } from '@/hooks/useThemeColor';
import MapView, { Marker, MarkerAnimated } from 'react-native-maps';

interface SearchResultsViewProps {
  properties: PropertyDetail[];
  onPropertyPress: (propertyId: number) => void;
  onSearchTrigger: () => void;
  onChangeCenter: (lat: number, lon: number) => void;
  center?: { latitude: number; longitude: number };
}

export const SearchResultsView: React.FC<SearchResultsViewProps> = ({
  properties,
  onPropertyPress,
  onSearchTrigger,
  onChangeCenter,
  center
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
            placeholder="Cerca immobili..."
            onSearchTrigger={onSearchTrigger}
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
        <View style={styles.container}>
          <MapView style={styles.map} initialRegion={center? { latitudeDelta: 0.2, longitudeDelta:0.2, ...center } : undefined} onLongPress={event => {console.log( "Map long pressed at", event.nativeEvent.coordinate); onChangeCenter(event.nativeEvent.coordinate.latitude, event.nativeEvent.coordinate.longitude)}} >
            {properties.map((property, index) => (
              property.address.latitude && property.address.longitude && <Marker
                key={index}
                coordinate={{ latitude: property.address.latitude, longitude: property.address.longitude }}
                title={`€${property.price.toLocaleString()}`}
                description={property.description}
                onPress={() => onPropertyPress(property.id)}
              />
            ))}
            
            {center && <Marker coordinate={{latitude: center.latitude, longitude: center.longitude}} pinColor={ "#00ccffff" }/>}
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