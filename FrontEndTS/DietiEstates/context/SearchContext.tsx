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
import { FILTERS_CONFIG } from '../config/filter-config';

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

    // Normalizziamo eventuali wrapper FilterState passati nel payload:
    // - Se il chiamante ha passato { value: X, isModified: ... } o un oggetto con .value,
    //   usiamo il suo .value come nuovo valore effettivo. Manteniamo però rawNewValue
    //   integro per controlli speciali (es. __forceIsModified).
    let normalizedNewValue: any = rawNewValue;
    if (normalizedNewValue != null && typeof normalizedNewValue === 'object') {
      if ('value' in normalizedNewValue) {
        normalizedNewValue = (normalizedNewValue as any).value;
      }
    }

    // Otteniamo il valore di default in modo robusto:
    // 1) dalla definizione di default della categoria (defaultCategoryDef)
    // 2) se non presente, dal file di configurazione globale FILTERS_CONFIG
    // 3) se non presente, dall'esistente.defaultValue
    // 4) infine fallback a normalizedNewValue
    let defaultValue: any = undefined;
    if (defaultCategoryDef && (defaultCategoryDef as any)[key as string] && (defaultCategoryDef as any)[key as string].defaultValue !== undefined) {
      defaultValue = (defaultCategoryDef as any)[key as string].defaultValue;
    } else if ((FILTERS_CONFIG as any) && (FILTERS_CONFIG as any)[key as string] && (FILTERS_CONFIG as any)[key as string].defaultValue !== undefined) {
      defaultValue = (FILTERS_CONFIG as any)[key as string].defaultValue;
    } else if (existing && (existing as any).defaultValue !== undefined) {
      defaultValue = (existing as any).defaultValue;
    }

    // Normalizziamo il FilterState usando updateFilterState (determina isModified)
    const newState = updateFilterState(existing as any, normalizedNewValue, defaultValue) as any;
    // La logica per forzare isModified a true per 'contract' è stata spostata qui
    // per evitare il loop e garantire che sia marcato come modificato solo quando l'utente interagisce.
    // Aggiunto controllo per evitare il loop: se il valore è lo stesso e non c'è forceIsModified, non forzare isModified.
    if (String(key) === 'contract' && normalizedNewValue !== null && !deepEqual(normalizedNewValue, existing.value)) {
      newState.isModified = true;
    } else if (rawNewValue != null && typeof rawNewValue === 'object' && '__forceIsModified' in (rawNewValue as object) && (rawNewValue as any).__forceIsModified === true) { // Se è stato forzato dalla UI
      newState.isModified = true;
    } else if (String(key) === 'contract' && normalizedNewValue === null && existing.value !== null) { // Se il contratto viene resettato a null
      newState.isModified = false;
    }
    updated[key] = newState;
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
  // Indichiamo che al primo montaggio stiamo ancora caricando dallo storage:
  // questo impedisce alla UI di lanciare ricerche o renderizzare risultati
  // basandosi su filtri non ancora idratati.
  isLoadingFromStorage: true,
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
      // Clona i default per evitare side-effect sul defaultSearchCriteria
      const resetFilters: any = JSON.parse(JSON.stringify(defaultSearchCriteria));

      // Per il filtro 'contract', dopo un reset, vogliamo che sia sempre non selezionato (null)
      // e non modificato, indipendentemente da keepTransactionType.
      resetFilters.general.contract = {
        value: null,
        defaultValue: null,
        isModified: false,
      };
      
      // Per priceRange, se il contratto è stato resettato a null, usiamo il default per 'sale' come fallback
      const pr = (resetFilters.general.contract.value === 'rent') ? DEFAULT_PRICE_RANGES.rent.defaultRange : DEFAULT_PRICE_RANGES.sale.defaultRange;
      resetFilters.general.priceRange = {
        ...resetFilters.general.priceRange,
        value: pr,
        defaultValue: pr,
        isModified: false,
      };

      // Se keepTransactionType è true, ripristiniamo il valore del contratto precedente
      // SOLO SE non era null (cioè, l'utente aveva selezionato esplicitamente "rent" o "sale")
      // e lo marchiamo come modificato.
      if (keepTransactionType && state.filters.general.contract.value !== null) {
        resetFilters.general.contract.value = state.filters.general.contract.value;
        resetFilters.general.contract.isModified = true;
      }

      // Garantiamo che tutti gli altri FilterState abbiano value = defaultValue e isModified = false
      for (const catKey of Object.keys(resetFilters)) {
        const cat = resetFilters[catKey];
        if (!cat || typeof cat !== 'object') continue;
        for (const fKey of Object.keys(cat)) {
          // Do not restore 'contract' or 'priceRange' in 'general' here since handled above
          if (catKey === 'general' && (fKey === 'contract' || fKey === 'priceRange')) continue;
          const fs = cat[fKey];
          if (fs && typeof fs === 'object' && 'defaultValue' in fs) {
            // Special-case: clear selected category/subcategory choices on RESET
            if (fKey === 'category') {
              fs.value = null;
              fs.isModified = false;
            } else {
              // For other filters restore to their default value and mark as unmodified
              fs.value = fs.defaultValue;
              fs.isModified = false;
            }
            cat[fKey] = fs;
          }
        }
      }

      newState = {
        ...state,
        searchQuery: '',
        geolocation: null, // Azzera anche la geolocalizzazione qui
        filters: resetFilters as SearchCriteria,
        selectedMainCategoryInPanel: null,
      };
      break;
    }
    case 'SET_SELECTED_MAIN_CATEGORY_IN_PANEL': {
      const newCategory = action.payload;
      const oldCategory = state.selectedMainCategoryInPanel;
      const updatedFilters = { ...state.filters };

      if (newCategory !== oldCategory && oldCategory) {
        const oldCategoryKey = oldCategory as keyof Omit<SearchCriteria, 'general'>;
        // Clona profondamente l'oggetto di default per evitare problemi di riferimento e di tipo
        updatedFilters[oldCategoryKey] = JSON.parse(JSON.stringify(defaultSearchCriteria[oldCategoryKey]));
      }

      newState = { ...state, filters: updatedFilters, selectedMainCategoryInPanel: newCategory };
      break;
    }
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
      break;
    case 'LOAD_STATE_FROM_STORAGE':
      newState = {
        ...state,
        ...action.payload,
        isLoadingFromStorage: false,
        errorStorage: null,
      };
      break;
    case 'SET_STORAGE_LOADING':
      newState = { ...state, isLoadingFromStorage: action.payload };
      break;
    case 'SET_STORAGE_ERROR':
      newState = { ...state, errorStorage: action.payload, isLoadingFromStorage: false };
      console.error('[SearchContext] Storage error:', action.payload, 'isLoadingFromStorage: false');
      break;
    default:
      newState = state;
  }
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
        await SearchStateRepository.saveStateDebounced(state);
      } catch (e) {
        console.error('[SearchContext] Error saving state to storage', e);
      }
    };
    persist();
  }, [state, state.isLoadingFromStorage]);

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