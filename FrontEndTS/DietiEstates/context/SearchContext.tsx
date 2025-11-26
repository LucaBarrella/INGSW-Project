import { createContext, Dispatch, useReducer, useContext, ReactNode, useEffect } from 'react';
import {
  DEFAULT_PRICE_RANGES,
  Geolocation,
  // Nuovi import dalla DTO per la nuova struttura dei filtri
  SearchCriteria,
  FilterState,
  defaultSearchCriteria,
} from '../src/dto/SearchDTO'; // Corretto il percorso di importazione
import SearchStateRepository from '../src/repositories/SearchStateRepository';
import { ALL_FILTERS } from '../config/filter-config';

// Helper functions: pure, piccole e fortemente tipizzate
const deepEqual = (a: unknown, b: unknown): boolean => {
  try {
    return JSON.stringify(a) === JSON.stringify(b);
  } catch {
    return a === b;
  }
};

const updateFilterState = <T,>(existing: FilterState<T>, newValue: T, defaultValue: T): FilterState<T> => {
  const isModified = !deepEqual(newValue, defaultValue);
  return { ...existing, value: newValue, isModified };
};

const updateFilterCategory = <TCategory extends Record<string, FilterState<any>>>(
  existingCategory: TCategory,
  newFilters: Partial<Record<keyof TCategory, any>>,
  defaultCategoryDef: Record<string, { defaultValue: any }>
): TCategory => {
  const updated = { ...existingCategory } as TCategory;
  for (const key of Object.keys(newFilters) as (keyof TCategory)[]) {
    const rawNewValue = newFilters[key];

    // Se non esiste lo stato corrente per questa chiave, creiamo un FilterState di fallback
    const existing = (updated[key] as unknown as FilterState<any>) ?? ({} as FilterState<any>);

    // Otteniamo il valore di default in modo robusto:
    // 1) dalla definizione di default della categoria (defaultCategoryDef)
    // 2) se non presente, dal file di configurazione globale ALL_FILTERS
    // 3) se non presente, dall'esistente.defaultValue
    // 4) infine fallback a rawNewValue
    let defaultValue: any = undefined;
    if (defaultCategoryDef && (defaultCategoryDef as any)[key as string] && (defaultCategoryDef as any)[key as string].defaultValue !== undefined) {
      defaultValue = (defaultCategoryDef as any)[key as string].defaultValue;
    } else if ((ALL_FILTERS as any) && (ALL_FILTERS as any)[key as string] && (ALL_FILTERS as any)[key as string].defaultValue !== undefined) {
      defaultValue = (ALL_FILTERS as any)[key as string].defaultValue;
    } else if (existing && (existing as any).defaultValue !== undefined) {
      defaultValue = (existing as any).defaultValue;
    } else {
      defaultValue = rawNewValue;
    }

    // Normalizziamo il FilterState usando updateFilterState (determina isModified)
    updated[key] = updateFilterState(existing as any, rawNewValue, defaultValue) as any;
  }
  return updated;
};

// 1. Definire Tipi, Azioni e Stato Iniziale del Context

// Interfaccia di Stato (SearchState)
export interface SearchState {
  searchQuery: string;
  geolocation: Geolocation | null;
  previousGeolocation: Geolocation | null; // Aggiunto per tracciare la geolocalizzazione precedente
  // Ora lo stato dei filtri utilizza la nuova struttura SearchCriteria che usa FilterState<T>
  filters: SearchCriteria;
  previousFilters: SearchCriteria; // Aggiunto per tracciare lo stato precedente
  selectedMainCategoryInPanel: keyof Omit<SearchCriteria, 'general'> | null;
  isLoadingFromStorage: boolean;
  errorStorage: string | null;
}

// Stato Iniziale (initialSearchState)
export const initialSearchState: SearchState = {
  searchQuery: '',
  geolocation: null,
  previousGeolocation: null, // Inizializza a null
  // Inizializziamo i filtri con il defaultSearchCriteria (usa FilterState<T>)
  filters: defaultSearchCriteria,
  previousFilters: defaultSearchCriteria, // Inizializza allo stesso valore
  selectedMainCategoryInPanel: null,
  // La persistenza è gestita da SearchRepository; il context resta puro.
  isLoadingFromStorage: false,
  errorStorage: null,
};

// Tipi di Azione (SearchAction)
export type SearchAction =
  | { type: 'SET_QUERY'; payload: string }
  | { type: 'SET_FILTERS'; payload: SearchCriteria }
  // UPDATE_FILTER: payload indica quale "categoria" aggiornare e i nuovi valori (raw)
  | { type: 'UPDATE_FILTER'; payload: { subCategory: 'general'; newFilters: Partial<Record<keyof SearchCriteria['general'], any>> } | { category: keyof Omit<SearchCriteria, 'general'>; newFilters: Partial<Record<string, any>> } }
  | { type: 'RESET_FILTERS'; payload?: { keepTransactionType?: boolean } }
  | { type: 'SET_SELECTED_MAIN_CATEGORY_IN_PANEL'; payload: keyof Omit<SearchCriteria, 'general'> | null }
  | { type: 'SET_GEOLOCATION'; payload: Geolocation | null }
  | { type: 'HYDRATE_STATE'; payload: Partial<Pick<SearchState, 'filters' | 'searchQuery' | 'selectedMainCategoryInPanel' | 'geolocation'>> }
  | { type: 'LOAD_STATE_FROM_STORAGE'; payload: Partial<SearchState> }
  | { type: 'SET_STORAGE_LOADING'; payload: boolean }
  | { type: 'SET_STORAGE_ERROR'; payload: string | null };

// Creazione del Context
export interface SearchContextType {
  state: SearchState;
  dispatch: Dispatch<SearchAction>;
  setGeolocation: (g: Geolocation | null) => void;
}

// Verrà inizializzato a null e poi fornito dal Provider
// Questo è un placeholder per evitare errori di tipo prima che il provider sia implementato
const SearchContext = createContext<SearchContextType | undefined>(undefined);

// 2. Implementare il Reducer (searchReducer)
export const searchReducer = (state: SearchState, action: SearchAction): SearchState => {
  console.log('[SearchContext] Action Dispatched:', action.type, 'Payload:', 'payload' in action ? action.payload : 'N/A');
  let newState: SearchState;

  switch (action.type) {
    case 'SET_QUERY':
      newState = { ...state, searchQuery: action.payload };
      break;
    case 'SET_FILTERS':
      newState = { ...state, filters: action.payload };
      break;
    case 'UPDATE_FILTER': {
      const payload = action.payload as { subCategory?: 'general'; category?: keyof Omit<SearchCriteria, 'general'>; newFilters: Partial<Record<string, any>> };
      const updatedFilters: SearchCriteria = { ...state.filters };

      // Delega la logica di aggiornamento a funzioni helper pure
      if (payload.subCategory === 'general') {
        const newFilters = payload.newFilters as Partial<Record<keyof SearchCriteria['general'], any>>;
        updatedFilters.general = updateFilterCategory(state.filters.general, newFilters, defaultSearchCriteria.general as any);
      } else if (payload.category) {
        const categoryKey = payload.category as keyof Omit<SearchCriteria, 'general'>;
        const newFilters = payload.newFilters as Partial<Record<string, any>>;
        updatedFilters[categoryKey] = updateFilterCategory(state.filters[categoryKey] as any, newFilters, (defaultSearchCriteria as any)[categoryKey]);
      }

      newState = { ...state, previousFilters: state.filters, filters: updatedFilters };
      break;
    }
    case 'RESET_FILTERS': {
      const keepTransactionType = action.payload?.keepTransactionType === true;
      const effectiveContract = keepTransactionType ? state.filters.general.contract.value : defaultSearchCriteria.general.contract.value;

      // Clona i default per evitare side-effect sul defaultSearchCriteria
      const resetFilters: any = JSON.parse(JSON.stringify(defaultSearchCriteria));

      // Imposta contract al valore effettivo (può essere mantenuto o resettato).
      // Dopo un RESET vogliamo che nessun filtro rimanga segnato come "modified",
      // anche se manteniamo il tipo di transazione (keepTransactionType).
      resetFilters.general.contract = {
        ...resetFilters.general.contract,
        value: effectiveContract,
        // Forziamo isModified a false: il reset ristabilisce lo stato "pulito"
        isModified: false,
      };
      
      // PriceRange dipende dal tipo di contratto: usiamo i range per sale/rent come default post-reset
      const pr = effectiveContract === 'rent' ? DEFAULT_PRICE_RANGES.rent.defaultRange : DEFAULT_PRICE_RANGES.sale.defaultRange;
      resetFilters.general.priceRange = {
        ...resetFilters.general.priceRange,
        value: pr,
        defaultValue: pr,
        isModified: false,
      };

      // Garantiamo che tutti gli altri FilterState abbiano value = defaultValue e isModified = false
      for (const catKey of Object.keys(resetFilters)) {
        const cat = resetFilters[catKey];
        if (!cat || typeof cat !== 'object') continue;
        for (const fKey of Object.keys(cat)) {
          if (catKey === 'general' && (fKey === 'contract' || fKey === 'priceRange')) continue;
          const fs = cat[fKey];
          if (fs && typeof fs === 'object' && 'defaultValue' in fs) {
            fs.value = fs.defaultValue;
            fs.isModified = false;
            cat[fKey] = fs;
          }
        }
      }

      newState = {
        ...state,
        searchQuery: '',
        filters: resetFilters as SearchCriteria,
        selectedMainCategoryInPanel: null,
      };
      break;
    }
    case 'SET_SELECTED_MAIN_CATEGORY_IN_PANEL':
      newState = { ...state, selectedMainCategoryInPanel: action.payload };
      break;
    case 'SET_GEOLOCATION':
      newState = { ...state, previousGeolocation: state.geolocation, geolocation: action.payload };
      break;
    case 'HYDRATE_STATE':
      newState = {
        ...state,
        ...(action.payload.searchQuery !== undefined ? { searchQuery: action.payload.searchQuery } : {}),
        ...(action.payload.selectedMainCategoryInPanel !== undefined ? { selectedMainCategoryInPanel: action.payload.selectedMainCategoryInPanel } : {}),
        ...(action.payload.geolocation !== undefined ? { geolocation: action.payload.geolocation, previousGeolocation: action.payload.geolocation } : {}),
        ...(action.payload.filters ? { filters: action.payload.filters as SearchCriteria, previousFilters: action.payload.filters as SearchCriteria } : {}),
        isLoadingFromStorage: false,
        errorStorage: null,
      };
      console.log('[SearchContext] HYDRATE_STATE applied. isLoadingFromStorage: false');
      break;
    case 'LOAD_STATE_FROM_STORAGE':
      newState = {
        ...state,
        ...action.payload,
        isLoadingFromStorage: false,
        errorStorage: null,
      };
      console.log('[SearchContext] State loaded from storage. isLoadingFromStorage: false');
      break;
    case 'SET_STORAGE_LOADING':
      newState = { ...state, isLoadingFromStorage: action.payload };
      console.log('[SearchContext] isLoadingFromStorage set to:', action.payload);
      break;
    case 'SET_STORAGE_ERROR':
      newState = { ...state, errorStorage: action.payload, isLoadingFromStorage: false };
      console.error('[SearchContext] Storage error:', action.payload, 'isLoadingFromStorage: false');
      break;
    default:
      newState = state;
  }
  console.log('[SearchContext] New State:', newState);
  return newState;
};

// 3. Creare il Provider (SearchProvider)
export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(searchReducer, initialSearchState);

  // Hydration: carica stato persistente all'avvio del Provider e dispatcha HYDRATE_STATE
  useEffect(() => {
    let cancelled = false;
    const hydrate = async () => {
      try {
        dispatch({ type: 'SET_STORAGE_LOADING', payload: true });
        const partialState = await SearchStateRepository.loadStateFromStorage();
        const storedFilters = await SearchStateRepository.loadFilters();
        if (cancelled) return;
        const hydratePayload: any = {};
        if (partialState.searchQuery !== undefined) hydratePayload.searchQuery = partialState.searchQuery;
        if (partialState.selectedMainCategoryInPanel !== undefined) hydratePayload.selectedMainCategoryInPanel = partialState.selectedMainCategoryInPanel;
        if (partialState.geolocation !== undefined) hydratePayload.geolocation = partialState.geolocation;
        if (storedFilters) hydratePayload.filters = storedFilters;
        dispatch({ type: 'HYDRATE_STATE', payload: hydratePayload });
        console.log('[SearchContext] Hydrated from storage', hydratePayload);
      } catch (e) {
        console.error('[SearchContext] Error hydrating from storage', e);
        dispatch({ type: 'SET_STORAGE_ERROR', payload: 'Errore caricamento filtri da storage' });
      } finally {
        dispatch({ type: 'SET_STORAGE_LOADING', payload: false });
      }
    };
    hydrate();
    return () => { cancelled = true; };
  }, [dispatch]);

  // Persistenza: salva filtri (debounced nel repository) ogni volta che cambiano, evitando il salvataggio durante l'idratazione
  useEffect(() => {
    if (state.isLoadingFromStorage) return;
    const persist = async () => {
      try {
        await SearchStateRepository.saveFilters(state.filters);
      } catch (e) {
        console.error('[SearchContext] Error saving filters to storage', e);
        // Non dispatchiamo un errore di storage qui per non bloccare l'UI; il reducer ha already a SET_STORAGE_ERROR action if needed
      }
    };
    persist();
  }, [state.filters, state.isLoadingFromStorage]);

  const setGeolocation = (g: Geolocation | null) => {
    dispatch({ type: 'SET_GEOLOCATION', payload: g });
  };

  return (
    <SearchContext.Provider value={{ state, dispatch, setGeolocation }}>
      {children}
    </SearchContext.Provider>
  );
};

// Hook custom per un facile accesso al context
export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch deve essere utilizzato all\'interno di un SearchProvider');
  }
  return context;
};

export default SearchContext;