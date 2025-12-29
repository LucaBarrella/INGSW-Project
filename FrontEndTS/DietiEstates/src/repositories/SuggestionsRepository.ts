import AsyncStorage from '@react-native-async-storage/async-storage';
import { PhotonFeature } from '@/components/Buyer/SearchIntegration/types';
import GeocodingService from '../services/GeocodingService';

/**
 * SuggestionsRepository
 * - Responsabilità: gestione dei suggerimenti (cache in memoria + persistenza su AsyncStorage)
 * - Migliorie implementate:
 *    * normalizzazione delle chiavi (lowercase) per evitare mismatch case-sensitive
 *    * fallback "startsWith" per suggerimenti salvati (utile per cronologia/autocomplete)
 *    * gestione di una cronologia di query recenti (LRU capped) con API dedicate
 *    * limitazione della dimensione della cache persistente
 */

const SUGGESTIONS_CACHE_KEY = 'photonSuggestionsCache';
const RECENT_QUERIES_KEY = 'recentSearchQueries';
const MAX_PERSISTED_ENTRIES = 100;
const MAX_RECENT_QUERIES = 20;

const inMemorySuggestionsCache: Map<string, PhotonFeature[]> = new Map();
const inMemoryAccessFrequency: Map<string, number> = new Map();
let suggestionsCacheLoaded = false;

const geocodingService = new GeocodingService();

const normalizeKey = (q: string) => String(q || '').trim().toLowerCase();

const loadSuggestionsCacheIfNeeded = async (): Promise<void> => {
  if (suggestionsCacheLoaded) return;
  try {
    const stored = await AsyncStorage.getItem(SUGGESTIONS_CACHE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as [string, PhotonFeature[]][];
      inMemorySuggestionsCache.clear();
      inMemoryAccessFrequency.clear();
      for (const [key, value] of parsed) {
        const k = normalizeKey(String(key));
        inMemorySuggestionsCache.set(k, value);
        inMemoryAccessFrequency.set(k, 1);
      }
      console.log('[SuggestionsRepository] Loaded suggestions cache from AsyncStorage:', inMemorySuggestionsCache.size, 'entries');
    }
    suggestionsCacheLoaded = true;
  } catch (e) {
    console.error('[SuggestionsRepository] Error loading suggestions cache from AsyncStorage', e);
    // Evitiamo retry infiniti marcando come caricato anche in caso di errore
    suggestionsCacheLoaded = true;
  }
};

const persistSuggestionsCache = async (): Promise<void> => {
  try {
    // Mantieni al massimo MAX_PERSISTED_ENTRIES salvati (LRU basico tramite access frequency)
    const entries = Array.from(inMemorySuggestionsCache.entries());
    // Ordina per frequency decrescente per tenere i più usati
    entries.sort((a, b) => (inMemoryAccessFrequency.get(b[0]) || 0) - (inMemoryAccessFrequency.get(a[0]) || 0));
    const limited = entries.slice(0, MAX_PERSISTED_ENTRIES);
    await AsyncStorage.setItem(SUGGESTIONS_CACHE_KEY, JSON.stringify(limited));
    console.log('[SuggestionsRepository] Persisted suggestions cache (entries):', limited.length);
  } catch (e) {
    console.error('[SuggestionsRepository] Error persisting suggestions cache', e);
  }
};

/**
 * Cronologia delle query recenti (semplice LRU).
 */
const addQueryToRecent = async (query: string): Promise<void> => {
  try {
    if (!query) return;
    const original = String(query || '').trim();
    if (!original) return;
    const normalizedIncoming = normalizeKey(original);

    const raw = await AsyncStorage.getItem(RECENT_QUERIES_KEY);
    const arr = raw ? (JSON.parse(raw) as string[]) : [];

    // Remove duplicates case-insensitively: keep first occurrence with its original casing
    const without = arr.filter(x => normalizeKey(String(x || '')) !== normalizedIncoming);

    // Prepend original (preserve user's casing)
    without.unshift(original);

    const limited = without.slice(0, MAX_RECENT_QUERIES);
    await AsyncStorage.setItem(RECENT_QUERIES_KEY, JSON.stringify(limited));
  } catch (e) {
    console.error('[SuggestionsRepository] Error adding query to recent history', e);
  }
};

const getRecentQueries = async (limit = 10): Promise<string[]> => {
  try {
    const raw = await AsyncStorage.getItem(RECENT_QUERIES_KEY);
    const arr = raw ? (JSON.parse(raw) as string[]) : [];
    return arr.slice(0, limit);
  } catch (e) {
    console.error('[SuggestionsRepository] Error reading recent queries', e);
    return [];
  }
};

const clearRecentQueries = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(RECENT_QUERIES_KEY);
    console.log('[SuggestionsRepository] Cleared recent queries');
  } catch (e) {
    console.error('[SuggestionsRepository] Error clearing recent queries', e);
  }
};

const SuggestionsRepository = {
  /**
   * Restituisce suggerimenti per la query:
   * - cerca prima una corrispondenza esatta in cache (case-insensitive)
   * - poi cerca voci in cache che iniziano con la query (utile per cronologia)
   * - infine, su cache miss, interpella Photon e salva i risultati
   */
  async getSuggestions(query: string, limit = 6): Promise<PhotonFeature[]> {
    await loadSuggestionsCacheIfNeeded();
    const q = String(query || '').trim();
    // Limite minimo di 3 caratteri per evitare ricerche troppo generiche e BAN
    if (!q || q.length < 3) return [];

    const qLower = normalizeKey(q);

    // Exact match (normalized)
    const cachedExact = inMemorySuggestionsCache.get(qLower);
    if (cachedExact) {
      const prev = inMemoryAccessFrequency.get(qLower) || 0;
      inMemoryAccessFrequency.set(qLower, prev + 1);
      return cachedExact.slice(0, limit);
    }

    // startsWith fallback on persisted cache keys
    // Use Array.from(...) to avoid downlevelIteration TypeScript errors when targeting older JS runtimes
    for (const [key, val] of Array.from(inMemorySuggestionsCache.entries())) {
      if (key.startsWith(qLower)) {
        const prev = inMemoryAccessFrequency.get(key) || 0;
        inMemoryAccessFrequency.set(key, prev + 1);
        return val.slice(0, limit);
      }
    }

    // Cache miss: fetch remote
    try {
      const features = await geocodingService.getSuggestions(q, limit);
      if (features && features.length > 0) {
        await SuggestionsRepository.saveSuggestions(q, features);
        return features.slice(0, limit);
      }
      return [];
    } catch (err) {
      console.error('[SuggestionsRepository] error fetching suggestions from Photon', err);
      return [];
    }
  },

  /**
   * Salva suggerimenti per una query (normalizza chiave a lowercase).
   */
  async saveSuggestions(query: string, suggestions: PhotonFeature[]): Promise<void> {
    await loadSuggestionsCacheIfNeeded();
    const q = String(query || '').trim();
    if (!q) return;
    const key = normalizeKey(q);
    inMemorySuggestionsCache.set(key, suggestions);
    inMemoryAccessFrequency.set(key, 1);
    // Persist in background
    persistSuggestionsCache().catch(err => console.error('[SuggestionsRepository] persistSuggestionsCache failed', err));
    // Aggiungi la query alla cronologia recente
    addQueryToRecent(q).catch(() => {});
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

  // History API
  async addQueryToHistory(query: string): Promise<void> {
    return addQueryToRecent(query);
  },

  async getRecentQueries(limit = 10): Promise<string[]> {
    return getRecentQueries(limit);
  },

  async clearRecentQueries(): Promise<void> {
    return clearRecentQueries();
  },
};

export default SuggestionsRepository;