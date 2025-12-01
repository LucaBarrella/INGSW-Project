import httpClient from '@/src/core/httpClient';

/**
 * CategoriesService
 * - Fetches property types and categories from backend endpoints
 * - Keeps a simple in-memory cache with optional TTL
 * - Exposes refresh to invalidate cache
 */

type CacheEntry<T> = {
  value: T;
  fetchedAt: number;
};

export class CategoriesService {
  private typesCache: CacheEntry<string[]> | null = null;
  private categoriesCache: Map<string, CacheEntry<string[]>> = new Map();
  private ttlMs: number;

  constructor(ttlMs = 1000 * 60 * 5) { // default 5 minutes
    this.ttlMs = ttlMs;
  }

  private isFresh(entry?: CacheEntry<any> | null) {
    if (!entry) return false;
    return (Date.now() - entry.fetchedAt) < this.ttlMs;
  }

  async getPropertyTypes(forceRefresh = false): Promise<string[]> {
    if (!forceRefresh && this.isFresh(this.typesCache)) {
      return this.typesCache!.value;
    }
    try {
      const resp = await httpClient.get('/api/property-types');
      const types: string[] = Array.isArray(resp?.data) ? resp.data : [];
      this.typesCache = { value: types, fetchedAt: Date.now() };
      return types;
    } catch (e) {
      console.error('[CategoriesService] getPropertyTypes error', e);
      // Return cached value if present even if stale, else empty array
      return this.typesCache?.value ?? [];
    }
  }

  async getCategoriesForType(type: string, forceRefresh = false): Promise<string[]> {
    const key = String(type);
    const cached = this.categoriesCache.get(key);
    if (!forceRefresh && this.isFresh(cached)) {
      return cached!.value;
    }
    try {
      const resp = await httpClient.get(`/api/categories?type=${encodeURIComponent(key)}`);
      const cats: string[] = Array.isArray(resp?.data) ? resp.data : [];
      this.categoriesCache.set(key, { value: cats, fetchedAt: Date.now() });
      return cats;
    } catch (e) {
      console.error('[CategoriesService] getCategoriesForType error for', type, e);
      return cached?.value ?? [];
    }
  }

  async getAllCategoriesMap(forceRefresh = false): Promise<Record<string, string[]>> {
    const map: Record<string, string[]> = {};
    const types = await this.getPropertyTypes(forceRefresh);
    await Promise.all(types.map(async (t) => {
      map[t] = await this.getCategoriesForType(t, forceRefresh);
    }));
    return map;
  }

  invalidateCache() {
    this.typesCache = null;
    this.categoriesCache.clear();
  }

  async refreshAll() {
    this.invalidateCache();
    return this.getAllCategoriesMap(true);
  }
}

export default new CategoriesService();