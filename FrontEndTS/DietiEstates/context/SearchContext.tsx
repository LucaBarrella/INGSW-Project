import { createContext, Dispatch, useReducer, useEffect, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  PropertyFilters,
  Range,
  DEFAULT_PRICE_RANGES,
  RESIDENTIAL_CATEGORIES,
  COMMERCIAL_CATEGORIES,
  INDUSTRIAL_CATEGORIES,
  LAND_CATEGORIES,
} from '../components/Buyer/SearchIntegration/types'; // Assumendo che i tipi siano qui

// 1. Definire Tipi, Azioni e Stato Iniziale del Context

// Interfaccia di Stato (SearchState)
export interface SearchState {
  searchQuery: string;
  filters: PropertyFilters;
  selectedMainCategoryInPanel: keyof Omit<PropertyFilters, 'general'> | null;
  isLoadingFromStorage: boolean;
  errorStorage: string | null;
}

// Stato Iniziale (initialSearchState)
export const initialSearchState: SearchState = {
  searchQuery: '',
  filters: {
    general: {
      transactionType: 'sale', // Default a 'sale' o 'rent' come preferito
      priceRange: DEFAULT_PRICE_RANGES.sale.defaultRange, // Default per 'sale'
      size: { min: 0, max: 1000 }, // Esempio di range di default per la dimensione
    },
    residential: {
      category: RESIDENTIAL_CATEGORIES[0],
      rooms: '',
      bathrooms: '',
      floor: '',
      elevator: false,
      pool: false,
    },
    commercial: {
      category: COMMERCIAL_CATEGORIES[0],
      bathrooms: '',
      emergencyExit: false,
      constructionDate: '',
    },
    industrial: {
      category: INDUSTRIAL_CATEGORIES[0],
      ceilingHeight: '',
      fireSystem: false,
      floorLoad: '',
      offices: '',
      structure: '',
    },
    land: {
      category: LAND_CATEGORIES[0],
      soilType: '',
      slope: '',
    },
  },
  selectedMainCategoryInPanel: null,
  isLoadingFromStorage: true,
  errorStorage: null,
};

// Tipi di Azione (SearchAction)
export type SearchAction =
  | { type: 'SET_QUERY'; payload: string }
  | { type: 'SET_FILTERS'; payload: PropertyFilters }
  | { type: 'UPDATE_FILTER'; payload: Partial<PropertyFilters> | { category: keyof Omit<PropertyFilters, 'general'>; newFilters: Partial<PropertyFilters[keyof Omit<PropertyFilters, 'general'>]> } | { subCategory: 'general'; newFilters: Partial<PropertyFilters['general']>} }
  | { type: 'RESET_FILTERS'; payload?: { keepTransactionType?: boolean } }
  | { type: 'SET_SELECTED_MAIN_CATEGORY_IN_PANEL'; payload: keyof Omit<PropertyFilters, 'general'> | null }
  | { type: 'LOAD_STATE_FROM_STORAGE'; payload: Partial<SearchState> }
  | { type: 'SET_STORAGE_LOADING'; payload: boolean }
  | { type: 'SET_STORAGE_ERROR'; payload: string | null };

// Creazione del Context
export interface SearchContextType {
  state: SearchState;
  dispatch: Dispatch<SearchAction>;
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
    case 'UPDATE_FILTER':
      // Gestione deep merge per aggiornamenti parziali dei filtri
      if ('subCategory' in action.payload && action.payload.subCategory === 'general') {
        newState = {
          ...state,
          filters: {
            ...state.filters,
            general: {
              ...state.filters.general,
              ...action.payload.newFilters,
            },
          },
        };
      } else if ('category' in action.payload) {
        const categoryKey = action.payload.category as keyof Omit<PropertyFilters, 'general'>;
        newState = {
          ...state,
          filters: {
            ...state.filters,
            [categoryKey]: {
              ...state.filters[categoryKey],
              ...action.payload.newFilters,
            },
          },
        };
      } else {
         // Fallback per un aggiornamento più generico di PropertyFilters, anche se meno specifico
        newState = {
          ...state,
          filters: {
            ...state.filters,
            ...(action.payload as Partial<PropertyFilters>),
          },
        };
      }
      break;
    case 'RESET_FILTERS':
      const currentTransactionType = state.filters.general.transactionType;
      const defaultFilters = initialSearchState.filters;
      newState = {
        ...state,
        searchQuery: initialSearchState.searchQuery, // Resetta anche la query di ricerca
        filters: {
          ...defaultFilters,
          general: {
            ...defaultFilters.general,
            transactionType: action.payload?.keepTransactionType
              ? currentTransactionType
              : defaultFilters.general.transactionType,
            // Assicurati che il priceRange sia aggiornato in base al transactionType effettivo dopo il reset
            priceRange: (action.payload?.keepTransactionType ? currentTransactionType : defaultFilters.general.transactionType) === 'rent'
              ? DEFAULT_PRICE_RANGES.rent.defaultRange
              : DEFAULT_PRICE_RANGES.sale.defaultRange,
          },
        },
        selectedMainCategoryInPanel: null, // Resetta anche la categoria selezionata nel pannello
      };
      break;
    case 'SET_SELECTED_MAIN_CATEGORY_IN_PANEL':
      newState = { ...state, selectedMainCategoryInPanel: action.payload };
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

// Chiavi per AsyncStorage
const SEARCH_QUERY_KEY = 'searchQuery';
const FILTERS_KEY = 'filters';
const SELECTED_MAIN_CATEGORY_KEY = 'selectedMainCategoryInPanel';

// 3. Creare il Provider (SearchProvider)
export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(searchReducer, initialSearchState);

  // Effetto per Caricare da AsyncStorage (al mount del Provider)
  useEffect(() => {
    const loadState = async () => {
      try {
        console.log('[SearchContext] Attempting to load state from AsyncStorage...');
        dispatch({ type: 'SET_STORAGE_LOADING', payload: true });
        const storedQuery = await AsyncStorage.getItem(SEARCH_QUERY_KEY);
        const storedFilters = await AsyncStorage.getItem(FILTERS_KEY);
        const storedSelectedCategory = await AsyncStorage.getItem(SELECTED_MAIN_CATEGORY_KEY);

        console.log('[SearchContext] Raw from AsyncStorage:', { storedQuery, storedFilters, storedSelectedCategory });

        const loadedState: Partial<SearchState> = {};
        let successfullyParsedFilters = false;

        if (storedQuery !== null) {
          loadedState.searchQuery = storedQuery;
          console.log('[SearchContext] Loaded searchQuery:', storedQuery);
        }
        if (storedFilters !== null) {
          try {
            const parsedFilters: PropertyFilters = JSON.parse(storedFilters);
            // TODO: Aggiungere validazione più robusta per parsedFilters
            loadedState.filters = parsedFilters;
            successfullyParsedFilters = true;
            console.log('[SearchContext] Loaded and parsed filters:', parsedFilters);
          } catch (e) {
            console.error("[SearchContext] Errore nel parsing dei filtri da AsyncStorage", e);
            // Non dispatchare SET_STORAGE_ERROR qui, lascia che il flusso continui
            // per impostare isLoadingFromStorage a false. L'errore è già loggato.
            // Potremmo voler rimuovere la chiave corrotta.
            await AsyncStorage.removeItem(FILTERS_KEY);
          }
        }
        if (storedSelectedCategory !== null) {
          loadedState.selectedMainCategoryInPanel = storedSelectedCategory as keyof Omit<PropertyFilters, 'general'>;
          console.log('[SearchContext] Loaded selectedMainCategoryInPanel:', storedSelectedCategory);
        }

        if (Object.keys(loadedState).length > 0) {
          // Se abbiamo caricato qualcosa, anche solo la query, applichiamo lo stato caricato.
          // Se i filtri non sono stati parsati con successo, loadedState.filters sarà undefined,
          // e lo stato dei filtri rimarrà quello iniziale (o quello già presente se non era initialSearchState).
          // LOAD_STATE_FROM_STORAGE imposterà isLoadingFromStorage a false.
          dispatch({ type: 'LOAD_STATE_FROM_STORAGE', payload: loadedState });
        } else {
          // Nessun dato salvato o nessun dato caricato con successo (es. solo filtri corrotti)
          console.log('[SearchContext] No valid state found in AsyncStorage or only corrupted data.');
          dispatch({ type: 'SET_STORAGE_LOADING', payload: false });
        }

      } catch (error) {
        console.error("[SearchContext] Errore nel caricamento dello stato da AsyncStorage (catch generale)", error);
        dispatch({ type: 'SET_STORAGE_ERROR', payload: "Impossibile caricare le preferenze di ricerca." });
      }
    };

    loadState();
  }, []); // Eseguito solo al mount

  // Effetto per Salvare in AsyncStorage (quando lo stato rilevante cambia)
  useEffect(() => {
    const saveState = async () => {
      if (state.isLoadingFromStorage && !state.errorStorage) {
        // Non salvare mentre si sta ancora caricando dallo storage, a meno che non ci sia già un errore di storage
        console.log('[SearchContext] Skipping save, still loading from storage.');
        return;
      }
      console.log('[SearchContext] Attempting to save state to AsyncStorage:', {
        query: state.searchQuery,
        filters: state.filters,
        selectedCat: state.selectedMainCategoryInPanel
      });
      try {
        // Salva searchQuery
        if (state.searchQuery !== initialSearchState.searchQuery || !AsyncStorage.getItem(SEARCH_QUERY_KEY)) {
             await AsyncStorage.setItem(SEARCH_QUERY_KEY, state.searchQuery);
             console.log('[SearchContext] Saved searchQuery:', state.searchQuery);
        } else if (state.searchQuery === initialSearchState.searchQuery) {
            await AsyncStorage.removeItem(SEARCH_QUERY_KEY);
            console.log('[SearchContext] Removed searchQuery (back to default).');
        }

        // Salva filters
        const filtersString = JSON.stringify(state.filters);
        const initialFiltersString = JSON.stringify(initialSearchState.filters);
        if (filtersString !== initialFiltersString || !AsyncStorage.getItem(FILTERS_KEY)) {
            await AsyncStorage.setItem(FILTERS_KEY, filtersString);
            console.log('[SearchContext] Saved filters:', filtersString);
        } else if (filtersString === initialFiltersString) {
            await AsyncStorage.removeItem(FILTERS_KEY);
            console.log('[SearchContext] Removed filters (back to default).');
        }

        // Salva selectedMainCategoryInPanel
        if (state.selectedMainCategoryInPanel !== initialSearchState.selectedMainCategoryInPanel || !AsyncStorage.getItem(SELECTED_MAIN_CATEGORY_KEY)) {
            if (state.selectedMainCategoryInPanel) {
                 await AsyncStorage.setItem(SELECTED_MAIN_CATEGORY_KEY, state.selectedMainCategoryInPanel);
                 console.log('[SearchContext] Saved selectedMainCategoryInPanel:', state.selectedMainCategoryInPanel);
            } else {
                await AsyncStorage.removeItem(SELECTED_MAIN_CATEGORY_KEY);
                console.log('[SearchContext] Removed selectedMainCategoryInPanel (is null).');
            }
        } else if (state.selectedMainCategoryInPanel === initialSearchState.selectedMainCategoryInPanel) { // usually null
             await AsyncStorage.removeItem(SELECTED_MAIN_CATEGORY_KEY);
             console.log('[SearchContext] Removed selectedMainCategoryInPanel (back to default null).');
        }

      } catch (error) {
        console.error("[SearchContext] Errore nel salvataggio dello stato in AsyncStorage", error);
        dispatch({ type: 'SET_STORAGE_ERROR', payload: "Impossibile salvare le preferenze di ricerca." });
      }
    };

    saveState();
  }, [state.searchQuery, state.filters, state.selectedMainCategoryInPanel, state.isLoadingFromStorage]);

  return (
    <SearchContext.Provider value={{ state, dispatch }}>
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