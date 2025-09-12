import AsyncStorage from '@react-native-async-storage/async-storage';

const HISTORY_KEY = 'RECENT_PROPERTIES_HISTORY';
const MAX_STORED = 500; // protezione contro crescita infinita

export default class HistoryStorageService {
  /**
   * Aggiunge un propertyId in testa alla cronologia (LIFO).
   * Rimuove eventuali duplicati presenti nella lista.
   */
  static async addPropertyToHistory(propertyId: number): Promise<void> {
    if (typeof propertyId !== 'number' || Number.isNaN(propertyId)) {
      throw new TypeError('propertyId deve essere un numero valido');
    }

    try {
      const raw = await AsyncStorage.getItem(HISTORY_KEY);
      const current: number[] = raw ? JSON.parse(raw) : [];

      // Rimuovi eventuali occorrenze esistenti
      const filtered = current.filter((id) => id !== propertyId);

      // Aggiungi in testa
      filtered.unshift(propertyId);

      // Limita la dimensione totale per sicurezza
      const limited = filtered.slice(0, MAX_STORED);

      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(limited));
    } catch (err) {
      console.error('[HistoryStorageService.addPropertyToHistory] ', err);
      throw err;
    }
  }

  /**
   * Restituisce un array di propertyId paginato (LIFO).
   * page: 1-based
   */
  static async getHistory(page = 1, limit = 10): Promise<number[]> {
    if (page < 1) throw new RangeError('page deve essere >= 1');
    if (limit < 1) throw new RangeError('limit deve essere >= 1');

    try {
      const raw = await AsyncStorage.getItem(HISTORY_KEY);
      const current: number[] = raw ? JSON.parse(raw) : [];

      const start = (page - 1) * limit;
      const slice = current.slice(start, start + limit);
      return slice;
    } catch (err) {
      console.error('[HistoryStorageService.getHistory] ', err);
      return [];
    }
  }

  /**
   * Restituisce il numero totale di elementi nella cronologia.
   */
  static async getHistoryCount(): Promise<number> {
    try {
      const raw = await AsyncStorage.getItem(HISTORY_KEY);
      const current: number[] = raw ? JSON.parse(raw) : [];
      return current.length;
    } catch (err) {
      console.error('[HistoryStorageService.getHistoryCount] ', err);
      return 0;
    }
  }

  /**
   * Utility per tests / amministrazione: pulisce la cronologia.
   */
  static async clearHistory(): Promise<void> {
    try {
      await AsyncStorage.removeItem(HISTORY_KEY);
    } catch (err) {
      console.error('[HistoryStorageService.clearHistory] ', err);
      throw err;
    }
  }
}