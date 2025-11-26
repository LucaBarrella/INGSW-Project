import { useEffect, useRef, useCallback } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { useSearch } from '@/context/SearchContext';

// Hook centralizza la sincronizzazione URL <-> SearchContext
// Ora: - non sincronizza più automaticamente ad ogni cambio di filtro (evita update durante render)
//      - espone forceSyncUrl() per sincronizzare esplicitamente (es. quando l'utente clicca "Cerca")
//      - esegue una sola inizializzazione "URL -> Context" all'avvio, senza causare loop
export default function useSearchUrlState() {
  const params = useLocalSearchParams<{ category?: string; query?: string; contract?: 'rent' | 'sale' }>();
  const { state, dispatch } = useSearch();

  const initializedFromUrlRef = useRef(false);
  const syncFromUrlRef = useRef(false);

  // Inizializza lo stato del context dai params URL una sola volta all'avvio della pagina,
  // solo dopo che lo storage (se presente) ha finito il suo caricamento.
  useEffect(() => {
    // Se già inizializzato o non ci sono params significativi, esci velocemente
    if (initializedFromUrlRef.current) return;
    if (!params) return;

    // Evita di sovrascrivere lo stato durante l'idratazione da storage
    if (state.isLoadingFromStorage) return;

    const hasQuery = typeof params.query === 'string' && params.query.length > 0;
    const hasCategory = typeof params.category === 'string' && params.category.length > 0;
    const hasContract = typeof params.contract === 'string' && params.contract.length > 0;

    if (!hasQuery && !hasCategory && !hasContract) {
      initializedFromUrlRef.current = true;
      return;
    }

    // Indichiamo che la sincronizzazione proviene dall'URL per evitare che il
    // side-effect di sincronizzazione (se reintrodotto) reagisca immediatamente.
    syncFromUrlRef.current = true;

    try {
      if (hasQuery) {
        dispatch({ type: 'SET_QUERY', payload: params.query as string });
      }
      if (hasCategory) {
        // selectedMainCategoryInPanel si aspetta la chiave di categoria (es. "residential")
        dispatch({ type: 'SET_SELECTED_MAIN_CATEGORY_IN_PANEL', payload: params.category as any });
      }
      if (hasContract) {
        // Aggiorna il contract dentro la sottocategoria 'general'
        dispatch({ type: 'UPDATE_FILTER', payload: { subCategory: 'general', newFilters: { contract: params.contract } } as any });
      }
    } catch (e) {
      // Non vogliamo bloccare la UI per errori di parsing params
      // eslint-disable-next-line no-console
      console.error('[useSearchUrlState] Error applying URL params to context', e);
    } finally {
      initializedFromUrlRef.current = true;
      // Permetti eventuali future sincronizzazioni esplicite
      setTimeout(() => {
        syncFromUrlRef.current = false;
      }, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, state.isLoadingFromStorage, dispatch]);

  // Espone utility per sincronizzare esplicitamente il Context -> URL
  // Questa funzione deve essere chiamata solo quando l'utente applica i filtri (es. clic "Cerca")
  const forceSyncUrl = useCallback(() => {
    const p: Record<string, string> = {};
    if (state.searchQuery) p.query = state.searchQuery;
    if (state.selectedMainCategoryInPanel) p.category = state.selectedMainCategoryInPanel;
    const contractVal = state.filters?.general?.contract?.value;
    if (contractVal) p.contract = contractVal;
    try {
      router.setParams(p as any);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('[useSearchUrlState] forceSyncUrl failed', e);
    }
  }, [state.searchQuery, state.selectedMainCategoryInPanel, state.filters]);

  return { forceSyncUrl };
}