import { useState, useCallback } from 'react';
import ApiService from '@/app/_services/api.service';
import HistoryStorageService from '@/app/_services/history.service';
import type { PropertyDetail } from '@/components/Agent/PropertyDashboard/types';

const PAGE_LIMIT = 10;
const MAX_IN_MEMORY = 50;

export type UseInfiniteHistoryState = {
  properties: PropertyDetail[];
  isLoading: boolean;
  isFetchingMore: boolean;
  error: string | null;
  currentPage: number;
  hasMore: boolean;
  loadInitialHistory: () => Promise<void>;
  loadMoreHistory: () => Promise<void>;
};

export default function useInfiniteHistory(): UseInfiniteHistoryState {
  const [properties, setProperties] = useState<PropertyDetail[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetchingMore, setIsFetchingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchPropertiesByIds = useCallback(async (ids: number[]) => {
    // Recupera i dettagli di ciascun immobile (seriale in parallelo)
    const requests = ids.map((id) => ApiService.getPropertyDetails(id));
    const results = await Promise.allSettled(requests);
    const successful = results
      .filter((r): r is PromiseFulfilledResult<PropertyDetail> => r.status === 'fulfilled')
      .map((r) => r.value);
    return successful;
  }, []);

  const loadInitialHistory = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setCurrentPage(1);
    try {
      const ids = await HistoryStorageService.getHistory(1, PAGE_LIMIT);
      if (!ids || ids.length === 0) {
        setProperties([]);
        setHasMore(false);
        return;
      }
      const props = await fetchPropertiesByIds(ids);
      setProperties(props);
      setHasMore(ids.length === PAGE_LIMIT);
    } catch (err: any) {
      console.error('[useInfiniteHistory] loadInitialHistory', err);
      setError(err?.message || 'Errore caricamento cronologia');
    } finally {
      setIsLoading(false);
    }
  }, [fetchPropertiesByIds]);

  const loadMoreHistory = useCallback(async () => {
    if (isFetchingMore || !hasMore) return;
    setIsFetchingMore(true);
    setError(null);
    try {
      const nextPage = currentPage + 1;
      const ids = await HistoryStorageService.getHistory(nextPage, PAGE_LIMIT);
      if (!ids || ids.length === 0) {
        setHasMore(false);
        return;
      }
      const props = await fetchPropertiesByIds(ids);
      // Mantieni LIFO: appenda in coda per mostrare prima i più recenti già caricati
      const merged = [...properties, ...props];
      // Pulizia RAM se supera soglia
      const limited = merged.slice(0, MAX_IN_MEMORY);
      setProperties(limited);
      setCurrentPage(nextPage);
      setHasMore(ids.length === PAGE_LIMIT);
    } catch (err: any) {
      console.error('[useInfiniteHistory] loadMoreHistory', err);
      setError(err?.message || 'Errore caricamento pagina successiva');
    } finally {
      setIsFetchingMore(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, hasMore, isFetchingMore, properties, fetchPropertiesByIds]);

  return {
    properties,
    isLoading,
    isFetchingMore,
    error,
    currentPage,
    hasMore,
    loadInitialHistory,
    loadMoreHistory
  };
}