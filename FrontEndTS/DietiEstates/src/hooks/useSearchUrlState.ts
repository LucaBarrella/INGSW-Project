import { useEffect, useRef } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { useSearch } from '@/context/SearchContext';


// Hook centralizza la sincronizzazione URL <-> SearchContext
export default function useSearchUrlState() {
  const params = useLocalSearchParams<{ category?: string; query?: string; contract?: 'rent' | 'sale'; triggerSearch?: string }>();
  const { state } = useSearch();


  const syncFromUrlRef = useRef(false);
  const debounceTimer = useRef<number | null>(null);

  // Sincronizza parametri URL verso context quando cambiano
  useEffect(() => {
    // Sincronizzazione URL -> Context temporaneamente disabilitata per debug
  }, []);

  // Sincronizza context -> URL con debounce per evitare aggiornamenti eccessivi
  useEffect(() => {
    // Non sincronizzare se la sincronizzazione proviene dall'URL
    if (syncFromUrlRef.current) return;

    // Crea params oggetto senza campi undefined
    const newParams: Record<string, string> = {};
    if (state.searchQuery && state.searchQuery.length > 0) newParams.query = state.searchQuery;
    if (state.selectedMainCategoryInPanel) newParams.category = state.selectedMainCategoryInPanel;
    const contractVal = state.filters.general.contract.value;
    if (contractVal) newParams.contract = contractVal;

    // Evita chiamate ridondanti se i params sono già uguali
    const currentParams = params as Record<string, any>;
    const keysEqual = (a: Record<string, any>, b: Record<string, any>) => {
      const aKeys = Object.keys(a).sort();
      const bKeys = Object.keys(b).sort();
      if (aKeys.length !== bKeys.length) return false;
      for (let i = 0; i < aKeys.length; i++) {
        const k = aKeys[i];
        if (a[k] !== b[k]) return false;
      }
      return true;
    };
    if (keysEqual(newParams, Object.fromEntries(Object.entries(currentParams).filter(([_, v]) => v !== undefined)))) {
      return;
    }

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    debounceTimer.current = window.setTimeout(() => {
      router.setParams(newParams as any);
    }, 300);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [state.filters.general.contract.value, state.selectedMainCategoryInPanel, params]);

  // Espone utility per eventuali chiamate esplicite (es. forzare sync)
  const forceSyncUrl = () => {
    const p: Record<string, string> = {};
    if (state.searchQuery) p.query = state.searchQuery;
    if (state.selectedMainCategoryInPanel) p.category = state.selectedMainCategoryInPanel;
    const contractVal = state.filters.general.contract.value;
    if (contractVal) p.contract = contractVal;
    router.setParams(p as any);
  };

  return { forceSyncUrl };
}