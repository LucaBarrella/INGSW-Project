import { useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Property } from '@/components/Agent/PropertyListing/types';

const FAVORITES_STORAGE_KEY = '@dieti-estates:favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Record<string, Property>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Load favorites from storage on mount
  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveFavorites = async (newFavorites: Record<string, Property>) => {
    try {
      await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  const isFavorite = useCallback((propertyId: string) => {
    return propertyId in favorites;
  }, [favorites]);

  const toggleFavorite = useCallback((property: Property) => {
    setFavorites(prev => {
      const newFavorites = { ...prev };
      if (property.id in newFavorites) {
        delete newFavorites[property.id];
      } else {
        newFavorites[property.id] = property;
      }
      saveFavorites(newFavorites);
      return newFavorites;
    });
  }, []);

  const getFavorites = useCallback(() => {
    return Object.values(favorites);
  }, [favorites]);

  const clearFavorites = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(FAVORITES_STORAGE_KEY);
      setFavorites({});
    } catch (error) {
      console.error('Error clearing favorites:', error);
    }
  }, []);

  return {
    isLoading,
    isFavorite,
    toggleFavorite,
    getFavorites,
    clearFavorites
  };
}
