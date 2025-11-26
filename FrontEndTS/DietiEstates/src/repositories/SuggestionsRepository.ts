import AsyncStorage from '@react-native-async-storage/async-storage';
import PhotonApi from '@/src/api/PhotonApi';
import { PhotonFeature } from '@/components/Buyer/SearchIntegration/types';

const SUGGESTIONS_CACHE_KEY = 'photonSuggestionsCache';

/**
 * SuggestionsRepository
 * - Responsabilità: gestione dei suggerimenti (cache in memoria + persistenza su AsyncStorage)
 * - Espone:
 *    * getSuggestions(query: string, limit?: number): Promise<PhotonFeature[]>
 *    * saveSuggestions(query: string, suggestions: PhotonFeature[]): Promise<void>
 *    * clearSuggestionsCache(): Promise<void>
 *
 * Nota: mantiene lo stesso comportamento presente in SearchRepository prima del refactor.
 */

const inMemorySuggestionsCache: Map<string, PhotonFeature[]> = new Map();
const inMemoryAccessFrequency: Map<string, number> = new Map();
let suggestionsCacheLoaded = false;

const loadSuggestionsCacheIfNeeded = async (): Promise<void> => {
  if (suggestionsCacheLoaded) return;
  try {
    const stored = await AsyncStorage.getItem(SUGGESTIONS_CACHE_KEY);
    if (!stored) {
      suggestionsCacheLoaded = true;
      return;
    }
    const parsed = JSON.parse(stored) as [string, PhotonFeature[]][];
    inMemorySuggestionsCache.clear();
    inMemoryAccessFrequency.clear();
    for (const [key, value] of parsed) {
      inMemorySuggestionsCache.set(key, value);
      inMemoryAccessFrequency.set(key, 1);
    }
    suggestionsCacheLoaded = true;
    console.log('[SuggestionsRepository] Loaded suggestions cache from AsyncStorage:', inMemorySuggestionsCache.size, 'entries');
  } catch (e) {
    console.error('[SuggestionsRepository] Error loading suggestions cache from AsyncStorage', e);
    // Evitiamo retry infiniti marcando come caricato anche in caso di errore
    suggestionsCacheLoaded = true;
  }
};

const persistSuggestionsCache = async (): Promise<void> => {
  try {
    const arr: [string, PhotonFeature[]][] = Array.from(inMemorySuggestionsCache.entries());
    await AsyncStorage.setItem(SUGGESTIONS_CACHE_KEY, JSON.stringify(arr));
    console.log('[SuggestionsRepository] Persisted suggestions cache (entries):', arr.length);
  } catch (e) {
    console.error('[SuggestionsRepository] Error persisting suggestions cache', e);
  }
};

const SuggestionsRepository = {
  async getSuggestions(query: string, limit = 6): Promise<PhotonFeature[]> {
    await loadSuggestionsCacheIfNeeded();
    const q = query.trim();
    if (!q) return [];
    const cached = inMemorySuggestionsCache.get(q);
    if (cached) {
      // update access frequency (LFU-ish)
      const prev = inMemoryAccessFrequency.get(q) || 0;
      inMemoryAccessFrequency.set(q, prev + 1);
      return cached;
    }

    // Cache miss: try remote Photon autocomplete and persist results.
    try {
      const features = await PhotonApi.getAutocompleteSuggestions(q, limit);
      if (features && features.length > 0) {
        // Persist via repository API (aggiorna in-memory cache e AsyncStorage)
        await SuggestionsRepository.saveSuggestions(q, features);
        return features;
      }
      return [];
    } catch (err) {
      console.error('[SuggestionsRepository] error fetching suggestions from Photon', err);
      return [];
    }
  },

  async saveSuggestions(query: string, suggestions: PhotonFeature[]): Promise<void> {
    await loadSuggestionsCacheIfNeeded();
    const q = query.trim();
    if (!q) return;
    inMemorySuggestionsCache.set(q, suggestions);
    inMemoryAccessFrequency.set(q, 1);
    // Persist asynchronously ma non await per non bloccare la UI
    persistSuggestionsCache().catch(err => console.error('[SuggestionsRepository] persistSuggestionsCache failed', err));
  },

  async clearSuggestionsCache(): Promise<void> {
    inMemorySuggestionsCache.clear();
    inMemoryAccessFrequency.clear();
    try {
      await AsyncStorage.removeItem(SUGGESTIONS_CACHE_KEY);
      console.log('[SuggestionsRepository] Cleared suggestions cache');
    } catch (e) {
      console.error('[SuggestionsRepository] Error clearing suggestions cache', e);
    }
  },
};

export default SuggestionsRepository;