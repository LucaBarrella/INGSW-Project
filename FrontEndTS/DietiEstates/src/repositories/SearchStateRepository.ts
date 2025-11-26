import AsyncStorage from '@react-native-async-storage/async-storage';
import { Geolocation, SearchCriteria, defaultSearchCriteria } from '@/src/dto/SearchDTO';
import { SearchState, initialSearchState } from '@/context/SearchContext';

const SEARCH_QUERY_KEY = 'searchQuery';
const FILTERS_KEY = 'filters';
const SELECTED_MAIN_CATEGORY_KEY = 'selectedMainCategoryInPanel';
const GEOLOCATION_KEY = 'geolocation';

/**
 * SearchStateRepository
 * - Responsabilità: persistenza dello stato dei filtri/UI su AsyncStorage.
 * - Espone:
 *    * loadStateFromStorage(): Promise<Partial<SearchState>>
 *    * saveStateToStorage(state: SearchState): Promise<void>
 *    * loadFilters(): Promise<SearchCriteria | null>
 *    * saveFilters(filters: SearchCriteria): Promise<void>   (debounced)
 *
 * Nota: mantiene la logica di debounce per saveFilters così com'era in SearchRepository.
 */

const SearchStateRepository = {
  async loadStateFromStorage(): Promise<Partial<SearchState>> {
    try {
      const [storedQuery, storedFilters, storedSelectedCategory, storedGeolocation] = await Promise.all([
        AsyncStorage.getItem(SEARCH_QUERY_KEY),
        AsyncStorage.getItem(FILTERS_KEY),
        AsyncStorage.getItem(SELECTED_MAIN_CATEGORY_KEY),
        AsyncStorage.getItem(GEOLOCATION_KEY),
      ]);

      const result: Partial<SearchState> = {};
      if (storedQuery !== null) result.searchQuery = storedQuery;
      if (storedFilters !== null) {
        try {
          result.filters = JSON.parse(storedFilters) as any as SearchCriteria;
        } catch (e) {
          console.error('[SearchStateRepository] Error parsing stored filters, removing corrupted key', e);
          await AsyncStorage.removeItem(FILTERS_KEY);
        }
      }
      if (storedSelectedCategory !== null) {
        result.selectedMainCategoryInPanel = storedSelectedCategory as any;
      }
      if (storedGeolocation !== null) {
        try {
          result.geolocation = JSON.parse(storedGeolocation) as Geolocation;
        } catch (e) {
          console.error('[SearchStateRepository] Error parsing stored geolocation, removing corrupted key', e);
          await AsyncStorage.removeItem(GEOLOCATION_KEY);
        }
      }

      return result;
    } catch (e) {
      console.error('[SearchStateRepository] Error loading state from storage', e);
      throw e;
    }
  },

  async saveStateToStorage(state: SearchState): Promise<void> {
    try {
      // Save or remove keys depending on equality with initial state to avoid unnecessary writes
      if (state.searchQuery !== initialSearchState.searchQuery) {
        await AsyncStorage.setItem(SEARCH_QUERY_KEY, state.searchQuery);
      } else {
        await AsyncStorage.removeItem(SEARCH_QUERY_KEY);
      }

      const filtersString = JSON.stringify(state.filters);
      const initialFiltersString = JSON.stringify(initialSearchState.filters);
      if (filtersString !== initialFiltersString) {
        await AsyncStorage.setItem(FILTERS_KEY, filtersString);
      } else {
        await AsyncStorage.removeItem(FILTERS_KEY);
      }

      if (state.selectedMainCategoryInPanel) {
        await AsyncStorage.setItem(SELECTED_MAIN_CATEGORY_KEY, state.selectedMainCategoryInPanel);
      } else {
        await AsyncStorage.removeItem(SELECTED_MAIN_CATEGORY_KEY);
      }

      const geoString = JSON.stringify(state.geolocation);
      const initialGeoString = JSON.stringify(initialSearchState.geolocation);
      if (geoString !== initialGeoString) {
        await AsyncStorage.setItem(GEOLOCATION_KEY, geoString);
      } else {
        await AsyncStorage.removeItem(GEOLOCATION_KEY);
      }
    } catch (e) {
      console.error('[SearchStateRepository] Error saving state to storage', e);
      throw e;
    }
  },

  async loadFilters(): Promise<SearchCriteria | null> {
    try {
      const stored = await AsyncStorage.getItem(FILTERS_KEY);
      if (stored === null) return null;
      try {
        const parsed = JSON.parse(stored) as SearchCriteria;
        // Minimal validation: ensure presence of general.contract.value
        if (parsed?.general?.contract && (parsed.general.contract.value === 'rent' || parsed.general.contract.value === 'sale')) {
          return parsed;
        }
        // If shape differs (legacy), attempt to migrate (best-effort)
        console.warn('[SearchStateRepository] Stored filters shape unexpected, attempting migration if possible.');
        return parsed as any;
      } catch (e) {
        console.error('[SearchStateRepository] Error parsing stored filters, removing corrupted key', e);
        await AsyncStorage.removeItem(FILTERS_KEY);
        return null;
      }
    } catch (e) {
      console.error('[SearchStateRepository] Error reading filters from storage', e);
      return null;
    }
  },

  // Debounce helper: mantiene lo stato di salvataggio pendente
  _pendingFiltersSaveTimer: null as ReturnType<typeof setTimeout> | null,
  _pendingFiltersPayload: null as SearchCriteria | null,

  async saveFilters(filters: SearchCriteria): Promise<void> {
    // Aggiorna il payload pendente e (re)programma il debounce
    try {
      (SearchStateRepository as any)._pendingFiltersPayload = filters;
      const debounceMs = 500;
      if ((SearchStateRepository as any)._pendingFiltersSaveTimer) {
        clearTimeout((SearchStateRepository as any)._pendingFiltersSaveTimer);
      }
      (SearchStateRepository as any)._pendingFiltersSaveTimer = setTimeout(async () => {
        try {
          const payload = (SearchStateRepository as any)._pendingFiltersPayload as SearchCriteria;
          const payloadString = JSON.stringify(payload);
          const defaultString = JSON.stringify(defaultSearchCriteria);
          if (payloadString === defaultString) {
            // Se i filtri sono uguali ai default, rimuoviamo la chiave per risparmiare spazio
            await AsyncStorage.removeItem(FILTERS_KEY);
            console.log('[SearchStateRepository] Filters equal to defaults — removed from AsyncStorage');
          } else {
            await AsyncStorage.setItem(FILTERS_KEY, payloadString);
            console.log('[SearchStateRepository] Filters saved to AsyncStorage');
          }
        } catch (e) {
          console.error('[SearchStateRepository] Error saving filters to storage', e);
        } finally {
          (SearchStateRepository as any)._pendingFiltersSaveTimer = null;
          (SearchStateRepository as any)._pendingFiltersPayload = null;
        }
      }, debounceMs);
    } catch (e) {
      console.error('[SearchStateRepository] saveFilters scheduling failed', e);
      throw e;
    }
  },
};

export default SearchStateRepository;