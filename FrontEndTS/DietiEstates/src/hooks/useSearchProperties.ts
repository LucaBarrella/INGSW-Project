import { useCallback, useState, useMemo, useEffect, useRef } from 'react';
import type { SearchCriteria } from '@/src/dto/SearchDTO';
import { defaultSearchCriteria } from '@/src/dto/SearchDTO';
import { searchService } from '@/src/compositionRoot';
import SuggestionsRepository from '@/src/repositories/SuggestionsRepository';
import { useSearch } from '@/context/SearchContext';
  
import { PropertyDetail } from '@/components/Agent/PropertyDashboard/types';
import { PropertyResponse } from '../dto/response/PropertyResponse.dto';
 
/**
 * useSearchProperties
 * - Hook che incapsula fetch, stato di caricamento/errore, filtri e paginazione.
 * - Espone funzioni per la UI: updateFilter, resetFilters, search, goToPage, setPageSize.
 */
export default function useSearchProperties() {
  const { state, dispatch } = useSearch();
  // Manteniamo una ref allo stato per evitare che la funzione `search`
  // cambi identità ad ogni aggiornamento dello state (evita effetti collaterali
  // in componenti che dipendono dalla funzione `search`).
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Risultati mappati per la UI
  const [properties, setProperties] = useState<PropertyDetail[]>([]);

  // Stati di paginazione locali
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSizeState] = useState<number>(20); // default: 20 elementi per richiesta (infinite scroll)
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalElements, setTotalElements] = useState<number>(0);
  // Stati per infinite scroll
  const [isFetchingMore, setIsFetchingMore] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  // Limite massimo di elementi da tenere in memoria (bounded cache)
  const MAX_CACHE = 100;

  const mapToPropertyDetail = (p: PropertyResponse): PropertyDetail => {
    const createdAtDate = new Date(p.createdAt);
    const updatedAtDate = new Date(p.updatedAt);

    const dateToArray = (date: Date): number[] => [
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
    ];

    return {
      id: p.id as any,
      description: (p as any).description,
      price: (p as any).price,
      area: (p as any).area,
      yearBuilt: (p as any).yearBuilt,
      contractType: (p as any).contract?.toString?.().toLowerCase?.() as "rent" | "sale",
      type: (p as any).propertyCategory?.toString?.().toLowerCase?.() as any,
      propertyCategory: (p as any).propertyCategory,
      condition: (p as any).condition as any,
      energyRating: (p as any).energyRating,
      address: {
        street: (p as any).address?.street,
        city: (p as any).address?.city,
        state: (p as any).address?.state,
        zipCode: (p as any).address?.zipCode,
        country: (p as any).address?.country,
        latitude: (p as any).address?.latitude,
        longitude: (p as any).address?.longitude,
        province: "",
        streetNumber: "",
      },
      agent: {
        id: (p as any).agent?.id,
        firstName: (p as any).agent?.firstName,
        lastName: (p as any).agent?.lastName,
        email: (p as any).agent?.email,
        contact: (p as any).agent?.phoneNumber,
      },
      createdAt: dateToArray(createdAtDate),
      updatedAt: dateToArray(updatedAtDate),
      firstImageUrl: (p as any).firstImageUrl,
      numberOfImages: (p as any).numberOfImages || 0,
      id_agent: (p as any).agent?.id,
      id_address: 0,
    } as unknown as PropertyDetail;
  };

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * search
   * - Non viene invocata automaticamente al cambio filtro: l'UI deve chiamarla esplicitamente.
   * - Usa i filtri presenti nello state del SearchContext e la paginazione locale (page, pageSize).
   */
  const search = useCallback(async () => {
    // Usiamo lo stato più recente dalla ref per evitare che la funzione
    // cambi identità quando `state` cambia (this prevents accidental effects).
    const currentState = stateRef.current;
    if (currentState.isLoadingFromStorage) {
      console.log('[useSearchProperties] Storage still loading, aborting search.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setProperties([]);

    try {
      const response = await searchService.searchProperties(currentState, page, pageSize);
      const mappedProperties = (response.content || []).map(mapToPropertyDetail);
      setProperties(mappedProperties);
 
      // Aggiorna informazioni di paginazione dallo shape del PagedPropertyResponse
      setTotalElements((response as any).totalElements ?? (response as any).numberOfElements ?? mappedProperties.length);
      setTotalPages((response as any).totalPages ?? Math.ceil(((response as any).totalElements ?? mappedProperties.length) / pageSize));
      // Sincronizza page con il valore rinviato dal backend, se presente
      if (typeof (response as any).number === 'number') {
        setPage((response as any).number);
      }
 
      // Determina se ci sono altre pagine da caricare
      if (typeof (response as any).totalPages === 'number' && typeof (response as any).number === 'number') {
        setHasMore((response as any).number < (response as any).totalPages - 1);
      } else if (typeof (response as any).totalElements === 'number') {
        setHasMore(((response as any).number ?? page) * pageSize + mappedProperties.length < (response as any).totalElements);
      } else {
        // fallback: se il numero di elementi restituiti è pari al pageSize, ipotizziamo che ci siano più elementi
        setHasMore(mappedProperties.length === pageSize);
      }
    } catch (err: any) {
      console.error('[useSearchProperties] search error', err);
      setError(err?.message || 'Errore durante la ricerca');
      setProperties([]);
      setTotalElements(0);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize]);

  /**
   * updateFilter
   * - Aggiorna i filtri nel SearchContext.
   * - Azzerare la paginazione locale (page = 0) per mantenere coerenza.
   */
  const updateFilter = useCallback((filterName: keyof SearchCriteria, newValue: any) => {
    try {
      console.log(`[useSearchProperties][DEBUG] updateFilter called for ${String(filterName)} with newValue:`, newValue);

      const sanitize = (targetCategory: keyof SearchCriteria, raw: Record<string, any>) => {
        const sanitized: Record<string, any> = {};
        const defaultCategoryDef: any = (defaultSearchCriteria as any)[targetCategory] || {};
        for (const k of Object.keys(raw || {})) {
          const v = raw[k];
          // Preserve explicit null/undefined from the UI: dispatcher / reducer will
          // resolve defaults based on defaultSearchCriteria / ALL_FILTERS. Overwriting
          // null here caused resets to re-apply defaults unintentionally.
          if (v === null || v === undefined) {
            sanitized[k] = v;
          } else {
            sanitized[k] = v;
          }
        }
        return sanitized;
      };

      if (filterName === 'general') {
        const payloadObj = typeof newValue === 'object' && newValue !== null ? newValue : { };
        const sanitized = sanitize('general', payloadObj as Record<string, any>);
        dispatch({ type: 'UPDATE_FILTER', payload: { subCategory: 'general', newFilters: sanitized } as any });
      } else {
        const payloadObj = typeof newValue === 'object' && newValue !== null ? newValue : { category: newValue };
        const sanitized = sanitize(filterName, payloadObj as Record<string, any>);
        dispatch({
          type: 'UPDATE_FILTER',
          payload: { category: filterName as keyof Omit<SearchCriteria, 'general'>, newFilters: sanitized } as any
        });
      }

      // Quando i filtri cambiano azzeriamo la pagina locale
      setPage(0);
    } catch (err) {
      console.error('[useSearchProperties] updateFilter error', err);
    }
  }, [dispatch]);

  /**
   * selectMainCategory
   */
  const selectMainCategory = useCallback((categoryKey: keyof Omit<SearchCriteria, 'general'> | null) => {
    try {
      dispatch({ type: 'SET_SELECTED_MAIN_CATEGORY_IN_PANEL', payload: categoryKey as any });

      if (categoryKey) {
        const existingCategoryState = (state.filters as any)[categoryKey];
        const defaultCatValue = existingCategoryState?.category?.value ?? null;

        if (!defaultCatValue) {
          const fallbackDefault = existingCategoryState?.category?.defaultValue ?? null;
          if (fallbackDefault !== null && fallbackDefault !== undefined) {
            updateFilter(categoryKey as any, { category: fallbackDefault } as any);
          }
        }
      }
    } catch (err) {
      console.error('[useSearchProperties] selectMainCategory error', err);
    }
  }, [dispatch, state.filters, updateFilter]);

  /**
   * resetFilters
   */
  const resetFilters = useCallback((keepTransactionType?: boolean) => {
    try {
      console.log('[useSearchProperties] Resetting filters. Keep transaction type:', keepTransactionType);
      if (typeof keepTransactionType === 'boolean') {
        dispatch({ type: 'RESET_FILTERS', payload: { keepTransactionType } });
      } else {
        dispatch({ type: 'RESET_FILTERS' });
      }
      console.log('[useSearchProperties] Dispatching SET_GEOLOCATION: null');
      dispatch({ type: 'SET_GEOLOCATION', payload: null });
 
      // Resetta anche la paginazione locale
      setPage(0);
      setPageSizeState(20);
    } catch (err) {
      console.error('[useSearchProperties] resetFilters error', err);
    }
  }, [dispatch]);

  const getSuggestions = useCallback(async (query: string) => {
    return SuggestionsRepository.getSuggestions(query);
  }, []);
  
  const saveSuggestions = useCallback(async (query: string, suggestions: any[]) => {
    return SuggestionsRepository.saveSuggestions(query, suggestions);
  }, []);

  /**
   * Pagination helpers
   */
  const goToPage = useCallback(async (pageNumber: number) => {
    setPage(pageNumber);
    // Avvia la ricerca per la nuova pagina
    await search();
  }, [search]);
 
  const setPageSize = useCallback(async (size: number) => {
    setPageSizeState(size);
    // Reset pagina quando cambia page size
    setPage(0);
    await search();
  }, [search]);
 
  /**
   * loadMore
   * - Carica la pagina successiva e appende i risultati (infinite scroll).
   * - Usa una cache limitata per evitare crescita illimitata della memoria.
   */
  const loadMore = useCallback(async () => {
    if (isFetchingMore || !hasMore) return;
    setIsFetchingMore(true);
    try {
      const currentState = stateRef.current;
      const nextPage = page + 1;
      const response = await searchService.searchProperties(currentState, nextPage, pageSize);
      const mapped = (response.content || []).map(mapToPropertyDetail);
      setProperties(prev => {
        const combined = [...prev, ...mapped];
        // mantieni solo gli ultimi MAX_CACHE elementi per evitare consumo eccessivo di memoria
        const trimmed = combined.length > MAX_CACHE ? combined.slice(combined.length - MAX_CACHE) : combined;
        // aggiorna totali basandosi sul nuovo array (trimmed)
        setTotalElements((response as any).totalElements ?? (response as any).numberOfElements ?? trimmed.length);
        setTotalPages((response as any).totalPages ?? Math.ceil(((response as any).totalElements ?? trimmed.length) / pageSize));
        return trimmed;
      });
 
      if (typeof (response as any).number === 'number') {
        setPage((response as any).number);
      } else {
        setPage(nextPage);
      }
 
      // Aggiorna hasMore
      if (typeof (response as any).totalPages === 'number' && typeof (response as any).number === 'number') {
        setHasMore((response as any).number < (response as any).totalPages - 1);
      } else if (typeof (response as any).totalElements === 'number') {
        setHasMore(((response as any).number ?? nextPage) * pageSize + mapped.length < (response as any).totalElements);
      } else {
        setHasMore(mapped.length === pageSize);
      }
    } catch (err) {
      console.error('[useSearchProperties] loadMore error', err);
    } finally {
      setIsFetchingMore(false);
    }
  }, [isFetchingMore, hasMore, page, pageSize]);

  /**
   * activeFiltersCount
   */
  const activeFiltersCount = useMemo(() => {
    const filters = (state && (state as any).filters) || {};
    let count = 0;
    const recurse = (obj: any) => {
      if (!obj || typeof obj !== 'object') return;
      for (const key of Object.keys(obj)) {
        if (key === 'centerLatitude' || key === 'centerLongitude' || key === 'radiusInMeters') {
          continue;
        }
        const val = obj[key];
        if (val && typeof val === 'object') {
          if ('isModified' in val && typeof val.isModified === 'boolean') {
            if (val.isModified === true) count++;
          } else {
            recurse(val);
          }
        }
      }
    };
    recurse(filters);
    return count;
  }, [state.filters]);

  return {
    properties,
    isLoading,
    error,
    search,
    updateFilter,
    selectMainCategory,
    resetFilters,
    activeFiltersCount,
    getSuggestions,
    saveSuggestions,
    // Pagination
    page,
    pageSize,
    totalPages,
    totalElements,
    goToPage,
    setPageSize,
    // Infinite scroll helpers
    loadMore,
    isFetchingMore,
    hasMore,
  };
}