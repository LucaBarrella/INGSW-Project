import { useCallback, useState, useMemo } from 'react';
import type { SearchCriteria } from '@/src/dto/SearchDTO';
import { defaultSearchCriteria } from '@/src/dto/SearchDTO';
import SearchService from '@/src/services/SearchService';
import SuggestionsRepository from '@/src/repositories/SuggestionsRepository';
import { useSearch } from '@/context/SearchContext';
import { ALL_FILTERS } from '@/config/filter-config';
  
import { PropertyDetail } from '@/components/Agent/PropertyDashboard/types';
 
/**
 * useSearchProperties
 * - Hook che incapsula fetch, stato di caricamento/errore e funzioni di interazione.
 * - Si adatta alla nuova shape SearchCriteria per i filtri.
 */
export default function useSearchProperties() {
  const { state, dispatch } = useSearch();
  const [properties, setProperties] = useState<PropertyDetail[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
 
  const search = useCallback(async () => {
    // Evita chiamate ridondanti durante il caricamento iniziale dallo storage
    if (state.isLoadingFromStorage) {
      console.log('[useSearchProperties] Storage still loading, aborting search.');
      return;
    }
 
    setIsLoading(true);
    setError(null);
    setProperties([]);
 
    try {
      // search ora legge i filtri e la geolocalizzazione direttamente dallo stato del context
      const response = await SearchService.searchProperties(state.filters, state.geolocation);
      setProperties((response && (response as any).content) || []);
    } catch (err: any) {
      console.error('[useSearchProperties] search error', err);
      setError(err?.message || 'Errore durante la ricerca');
      setProperties([]);
    } finally {
      setIsLoading(false);
    }
  }, [state.isLoadingFromStorage, state.filters, state.geolocation]);
 
  /**
   * updateFilter
   * - Signature: updateFilter(filterName: keyof SearchCriteria, newValue: any)
   * - Dispatcha un'azione UPDATE_FILTER al SearchContext con { category, newFilters }.
   *   Il reducer si occupa di riconciliare i valori e calcolare isModified.
   */
  const updateFilter = useCallback((filterName: keyof SearchCriteria, newValue: any) => {
    try {
      // Sanitizza i valori null/undefined sostituendoli con i default quando presenti.
      // Usa sia defaultSearchCriteria (mappa dei FilterState) sia ALL_FILTERS (config globale)
      const sanitize = (targetCategory: keyof SearchCriteria, raw: Record<string, any>) => {
        const sanitized: Record<string, any> = {};
        const defaultCategoryDef: any = (defaultSearchCriteria as any)[targetCategory] || {};
        for (const k of Object.keys(raw || {})) {
          const v = raw[k];
          if (v === null || v === undefined) {
            const fromDefault = defaultCategoryDef[k] && defaultCategoryDef[k].defaultValue !== undefined
              ? defaultCategoryDef[k].defaultValue
              : undefined;
            const fromAll = (ALL_FILTERS as any)[k] && (ALL_FILTERS as any)[k].defaultValue !== undefined
              ? (ALL_FILTERS as any)[k].defaultValue
              : undefined;
            sanitized[k] = fromDefault !== undefined ? fromDefault : (fromAll !== undefined ? fromAll : v);
          } else {
            sanitized[k] = v;
          }
        }
        return sanitized;
      };

      // Se viene passato un valore primitivo (es. updateFilter('residential', 'Loft'))
      // lo interpretiamo come aggiornamento della proprietà 'category'
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
    } catch (err) {
      console.error('[useSearchProperties] updateFilter error', err);
    }
  }, [dispatch]);
 
  /**
   * resetFilters
   * - Dispatcha RESET_FILTERS. Accetta opzionalmente keepTransactionType per compatibilità.
   * - Resetta anche la geolocalizzazione.
   */
  const resetFilters = useCallback((keepTransactionType?: boolean) => {
    try {
      if (typeof keepTransactionType === 'boolean') {
        dispatch({ type: 'RESET_FILTERS', payload: { keepTransactionType } });
      } else {
        dispatch({ type: 'RESET_FILTERS' });
      }
      // Resetta anche la geolocalizzazione
      dispatch({ type: 'SET_GEOLOCATION', payload: null });
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
   * activeFiltersCount
   * - Conta ricorsivamente tutti i FilterState presenti in state.filters per cui isModified === true.
   * - I campi obbligatori (es. centerLatitude/centerLongitude/radiusInMeters) non vengono conteggiati
   *   se isModified === false, per cui la logica ricorsiva è già corretta nel non contarli.
   */
  const activeFiltersCount = useMemo(() => {
    const filters = (state && (state as any).filters) || {};
    let count = 0;
    const recurse = (obj: any) => {
      if (!obj || typeof obj !== 'object') return;
      for (const key of Object.keys(obj)) {
        // Escludiamo i campi di geolocalizzazione dal conteggio
        if (key === 'centerLatitude' || key === 'centerLongitude' || key === 'radiusInMeters') {
          continue;
        }
        const val = obj[key];
        if (val && typeof val === 'object') {
          // Se è un FilterState con isModified, contalo
          if ('isModified' in val && typeof val.isModified === 'boolean') {
            if (val.isModified === true) count++;
          } else {
            // Altrimenti scendi ricorsivamente
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
    resetFilters,
    activeFiltersCount,
    getSuggestions,
    saveSuggestions,
  };
}