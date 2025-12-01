import { useState, useCallback } from 'react';
import type { PropertyDetail } from '@/components/Agent/PropertyDashboard/types';
import HistoryStorageService from '@/src/api/history.service';
import { getPropertiesByIds as searchGetPropertiesByIds } from '@/src/services/SearchService';

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
    if (!ids || ids.length === 0) return [];
    // SearchService expects string ids
    const idStrings = ids.map(String);
    const dtos = await searchGetPropertiesByIds(idStrings);
    
    // Mappa i DTO restituiti al tipo UI PropertyDetail
    const mapped = (dtos || []).map((d: any) => {
      console.log('[useInfiniteHistory] Raw DTO for history item:', JSON.stringify(d, null, 2));
      return {
        id: d.id,
        title: d.title || d.name || '',
        address: d.address?.street ? `${d.address.street}, ${d.address.city}` : d.address,
        price: d.price ?? 0,
        imageUrl: d.firstImageUrl || '',
        firstImageUrl: d.firstImageUrl || '', // Aggiunto per PropertyCard
        type: d.propertyCategory || d.type || '',
        condition: d.condition || d.status || '', // Modificato da status a condition
        createdAt: d.createdAt ? new Date(d.createdAt) : new Date(),
        updatedAt: d.updatedAt ? new Date(d.updatedAt) : new Date(),
        agentId: d.agent?.id || d.id_agent || '',
        propertyCategory: d.propertyCategory,
        contractType: d.contract,
        area: d.area,
        numberOfBathrooms: d.numberOfBathrooms,
        numberOfRooms: d.numberOfRooms,
      } as unknown as PropertyDetail;
    });
    return mapped;
  }, []);

  const loadInitialHistory = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setCurrentPage(1);
    try {
      const ids: number[] = await HistoryStorageService.getHistory();
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
      // TODO: Implementare la nuova logica per il recupero della cronologia.
      // Per ora, simulo un array vuoto o ID di esempio.
      const ids: number[] = await HistoryStorageService.getHistory(nextPage, PAGE_LIMIT);
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