import { createContext, Dispatch, useReducer, useEffect, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  PropertyFilters,
  Range,
  DEFAULT_PRICE_RANGES,
  RESIDENTIAL_CATEGORIES,
  COMMERCIAL_CATEGORIES,
  LAND_CATEGORIES,
  GARAGE_CATEGORIES,
  Geolocation,
} from '../components/Buyer/SearchIntegration/types'; // Assumendo che i tipi siano qui

// 1. Definire Tipi, Azioni e Stato Iniziale del Context

// Interfaccia di Stato (SearchState)
export interface SearchState {
  searchQuery: string;
  geolocation: Geolocation | null;
  filters: PropertyFilters;
  selectedMainCategoryInPanel: keyof Omit<PropertyFilters, 'general'> | null;
  isLoadingFromStorage: boolean;
  errorStorage: string | null;
}

// Stato Iniziale (initialSearchState)
export const initialSearchState: SearchState = {
  searchQuery: '',
  geolocation: null,
  filters: {
    general: {
      contract: 'sale',
      priceRange: DEFAULT_PRICE_RANGES.sale.defaultRange,
      size: { min: 20, max: 200 },
      searchRadiusKm: { min: 20, max: 20 }, // Default: 20km radius
    },
    residential: {
      category: RESIDENTIAL_CATEGORIES[0],
      // backend-aligned defaults
      minNumberOfFloors: undefined,
      minNumberOfRooms: '',
      minNumberOfBathrooms: '',
      floor: '',
      mustHaveElevator: false,
      hasPool: false,
      minParkingSpaces: undefined,
    },
    commercial: {
      category: COMMERCIAL_CATEGORIES[0],
      minNumberOfFloors: undefined,
      minNumberOfRooms: undefined,
      minNumberOfBathrooms: undefined,
      mustHaveWheelchairAccess: false,
      minNumeroVetrine: undefined,
      constructionYear: '',
    },
    land: {
      category: LAND_CATEGORIES[0],
      mustBeAccessibleFromStreet: false,
      slope: 0,
    },
    garage: {
      category: GARAGE_CATEGORIES[0],
      minNumberOfFloors: undefined,
      mustHaveSurveillance: false,
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
  | { type: 'SET_GEOLOCATION'; payload: Geolocation | null }
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
    case 'UPDATE_FILTER':
      // Gestione deep merge per aggiornamenti parziali dei filtri
      if ('subCategory' in action.payload && action.payload.subCategory === 'general') {
        // SearchContext.tsx — aggiorna branch 'UPDATE_FILTER' per gestire il cambio contract
        const prevContract = state.filters.general.contract;
        const newGeneral = {
          ...state.filters.general,
          ...action.payload.newFilters,
        };

        // Se il contract viene cambiato e il priceRange era ancora il default precedente,
        // sincronizziamo il priceRange al default del nuovo contract.
        if ('contract' in action.payload.newFilters) {
          const prevDefault = prevContract === 'rent'
            ? DEFAULT_PRICE_RANGES.rent.defaultRange
            : DEFAULT_PRICE_RANGES.sale.defaultRange;
          const currPrice = state.filters.general.priceRange;
          const priceEqualToPrevDefault = currPrice.min === prevDefault.min && currPrice.max === prevDefault.max;

          const newContract = (action.payload.newFilters as any).contract as 'rent' | 'sale';
          if (priceEqualToPrevDefault) {
            newGeneral.priceRange = newContract === 'rent'
              ? DEFAULT_PRICE_RANGES.rent.defaultRange
              : DEFAULT_PRICE_RANGES.sale.defaultRange;
          }
        }

        newState = {
          ...state,
          filters: {
            ...state.filters,
            general: newGeneral,
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
      const currentTransactionType = state.filters.general.contract;
      const defaultFilters = initialSearchState.filters;
      newState = {
        ...state,
        searchQuery: initialSearchState.searchQuery, // Resetta anche la query di ricerca
        filters: {
          ...defaultFilters,
          general: {
            ...defaultFilters.general,
            contract: action.payload?.keepTransactionType
              ? currentTransactionType
              : defaultFilters.general.contract,
            // Assicurati che il priceRange sia aggiornato in base al transactionType effettivo dopo il reset
            priceRange: (action.payload?.keepTransactionType ? currentTransactionType : defaultFilters.general.contract) === 'rent'
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
    case 'SET_GEOLOCATION':
      newState = { ...state, geolocation: action.payload };
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
            // Validate filters.general.contract
            if (parsedFilters.general && !['sale', 'rent'].includes(parsedFilters.general.contract)) {
              console.warn('[SearchContext] Invalid filters.general.contract found in storage. Defaulting to "sale".');
              parsedFilters.general.contract = 'sale';
            } else if (!parsedFilters.general) {
              console.warn('[SearchContext] filters.general is undefined in storage. Defaulting contract to "sale".');
              parsedFilters.general = { ...initialSearchState.filters.general, contract: 'sale' };
            }
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