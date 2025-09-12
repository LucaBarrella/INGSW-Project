import HistoryStorageService from '@/app/_services/history.service';
import AsyncStorage from '@react-native-async-storage/async-storage';

describe('HistoryStorageService', () => {
  beforeEach(async () => {
    await HistoryStorageService.clearHistory();
  });

  it('addPropertyToHistory should add ids in LIFO order and remove duplicates', async () => {
    await HistoryStorageService.addPropertyToHistory(1);
    await HistoryStorageService.addPropertyToHistory(2);
    // re-add 1: should move to head
    await HistoryStorageService.addPropertyToHistory(1);

    const all = await HistoryStorageService.getHistory(1, 10);
    expect(all).toEqual([1, 2]);
  });

  it('getHistory should return paginated results', async () => {
    // add 6 items
    for (let i = 1; i <= 6; i++) {
      await HistoryStorageService.addPropertyToHistory(i);
    }
    // page 1 limit 3 => ids [6,5,4]
    const p1 = await HistoryStorageService.getHistory(1, 3);
    expect(p1).toEqual([6, 5, 4]);

    const p2 = await HistoryStorageService.getHistory(2, 3);
    expect(p2).toEqual([3, 2, 1]);
  });

  it('getHistoryCount should return correct total', async () => {
    await HistoryStorageService.addPropertyToHistory(10);
    await HistoryStorageService.addPropertyToHistory(20);
    const count = await HistoryStorageService.getHistoryCount();
    expect(count).toBe(2);
  });

  it('clearHistory should remove stored key', async () => {
    await HistoryStorageService.addPropertyToHistory(1);
    await HistoryStorageService.clearHistory();
    const count = await HistoryStorageService.getHistoryCount();
    expect(count).toBe(0);
    const raw = await AsyncStorage.getItem('RECENT_PROPERTIES_HISTORY');
    expect(raw).toBeNull();
  });
});