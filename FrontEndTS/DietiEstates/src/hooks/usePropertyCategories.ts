import { useEffect, useState, useCallback } from 'react';
import { categories } from '@/src/compositionRoot';

/**
 * usePropertyCategories (wrapper sul CategoriesService centralizzato)
 * - Usa il CategoriesService esportato dal compositionRoot per ottenere:
 *   - lista delle property types
 *   - mappa delle sottocategorie per ogni type
 * - Espone: categoriesByType, isLoading, error, refresh, getCategoriesForType
 *
 * Nota: questo wrapper mantiene l'interfaccia usata dal Pannello Filtri
 * ma reindirizza tutte le chiamate al service centralizzato con caching.
 */

type CategoriesByType = Record<string, string[]>;

export default function usePropertyCategories() {
  const [categoriesByType, setCategoriesByType] = useState<CategoriesByType>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadAll = useCallback(async (force = false) => {
    setIsLoading(true);
    setError(null);
    try {
      const map = await categories.getAllCategoriesMap(force);
      setCategoriesByType(map);
    } catch (e: any) {
      console.error('[usePropertyCategories] loadAll error', e);
      setError(e?.message ?? 'Errore nel caricamento delle categorie');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getCategoriesForType = useCallback(async (type: string, force = false) => {
    try {
      const list = await categories.getCategoriesForType(type, force);
      setCategoriesByType(prev => ({ ...prev, [type]: list }));
      return list;
    } catch (e) {
      console.error('[usePropertyCategories] getCategoriesForType error for', type, e);
      return [];
    }
  }, []);

  const refresh = useCallback(async () => {
    await loadAll(true);
  }, [loadAll]);

  useEffect(() => {
    // initial load
    loadAll(false);
  }, [loadAll]);

  return {
    categoriesByType,
    isLoading,
    error,
    refresh,
    getCategoriesForType,
  };
}