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
      // BUG FIX: Correctly save or remove searchQuery
      if (state.searchQuery) {
        console.log('[SearchStateRepository] Saving searchQuery to storage:', state.searchQuery);
        await AsyncStorage.setItem(SEARCH_QUERY_KEY, state.searchQuery);
      } else {
        console.log('[SearchStateRepository] searchQuery is empty, removing from storage.');
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

      // BUG FIX: Correctly save or remove geolocation
      if (state.geolocation) {
        console.log('[SearchStateRepository] Saving geolocation to storage:', state.geolocation);
        await AsyncStorage.setItem(GEOLOCATION_KEY, JSON.stringify(state.geolocation));
      } else {
        console.log('[SearchStateRepository] Geolocation is null, removing from storage.');
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
  _pendingStateSaveTimer: null as ReturnType<typeof setTimeout> | null,
  _pendingStatePayload: null as SearchState | null,
 
  async saveStateDebounced(state: SearchState): Promise<void> {
    // Aggiorna il payload pendente e (re)programma il debounce
    try {
      this._pendingStatePayload = state;
      const debounceMs = 500;
      if (this._pendingStateSaveTimer) {
        clearTimeout(this._pendingStateSaveTimer);
      }
      this._pendingStateSaveTimer = setTimeout(async () => {
        try {
          const payload = this._pendingStatePayload;
          if (payload) {
            await this.saveStateToStorage(payload);
            console.log('[SearchStateRepository] Debounced state saved to AsyncStorage');
          }
        } catch (e) {
          console.error('[SearchStateRepository] Error saving debounced state to storage', e);
        } finally {
          this._pendingStateSaveTimer = null;
          this._pendingStatePayload = null;
        }
      }, debounceMs);
    } catch (e) {
      console.error('[SearchStateRepository] saveStateDebounced scheduling failed', e);
      throw e;
    }
  },
};

export default SearchStateRepository;