import React from 'react';
import { Text } from 'react-native';
import { render, waitFor } from '@testing-library/react-native';
import useInfiniteHistory from '@/hooks/useInfiniteHistory';
import HistoryStorageService from '@/app/_services/history.service';
import ApiService from '@/app/_services/api.service';

// Mock reale servizi con implementazioni controllate
jest.mock('@/app/_services/history.service');
jest.mock('@/app/_services/api.service');

const mockedHistory = HistoryStorageService as jest.Mocked<typeof HistoryStorageService>;
const mockedApi = ApiService as unknown as { getPropertyDetails: jest.Mock };

const TestComponentInitial: React.FC = () => {
  const {
    properties,
    isLoading,
    loadInitialHistory
  } = useInfiniteHistory();

  React.useEffect(() => {
    loadInitialHistory().catch(() => {});
  }, [loadInitialHistory]);

  return (
    <>
      {isLoading ? <Text testID="loading">loading</Text> : <Text testID="count">{properties.length}</Text>}
    </>
  );
};

const TestComponentLoadMore: React.FC = () => {
  const {
    properties,
    isLoading,
    loadInitialHistory,
    loadMoreHistory
  } = useInfiniteHistory();

  React.useEffect(() => {
    (async () => {
      await loadInitialHistory();
      // simula onEndReached
      await loadMoreHistory();
    })().catch(() => {});
  }, [loadInitialHistory, loadMoreHistory]);

  return (
    <>
      {isLoading ? <Text testID="loading">loading</Text> : <Text testID="count">{properties.length}</Text>}
    </>
  );
};

describe('useInfiniteHistory hook', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('carica la cronologia iniziale e popola le properties', async () => {
    // History: pagina 1 -> [1,2]
    mockedHistory.getHistory = jest.fn().mockResolvedValue([1, 2]);

    // ApiService ritorna dettagli per ogni id
    mockedApi.getPropertyDetails = jest.fn((id: number) =>
      Promise.resolve({
        id,
        title: `Prop ${id}`,
        price: 1000,
        createdAt: new Date(),
        updatedAt: new Date(),
        agentId: 'agent',
        address: 'via',
        description: '',
        status: 'active'
      })
    );

    const { getByTestId } = render(<TestComponentInitial />);

    await waitFor(() => {
      expect(getByTestId('count').props.children).toBe(2);
    });

    expect(mockedHistory.getHistory).toHaveBeenCalledWith(1, 10);
    expect(mockedApi.getPropertyDetails).toHaveBeenCalledTimes(2);
  });

  it('carica la pagina successiva con loadMoreHistory', async () => {
    // getHistory: prima call pagina1 -> [1,2], seconda call pagina2 -> [3]
    mockedHistory.getHistory = jest.fn()
      .mockResolvedValueOnce([1, 2])
      .mockResolvedValueOnce([3]);

    mockedApi.getPropertyDetails = jest.fn((id: number) =>
      Promise.resolve({
        id,
        title: `Prop ${id}`,
        price: 1000,
        createdAt: new Date(),
        updatedAt: new Date(),
        agentId: 'agent',
        address: 'via',
        description: '',
        status: 'active'
      })
    );

    const { getByTestId } = render(<TestComponentLoadMore />);

    await waitFor(() => {
      // dopo loadInitial + loadMore => 3 elementi
      expect(getByTestId('count').props.children).toBe(3);
    });

    expect(mockedHistory.getHistory).toHaveBeenCalledWith(1, 10);
    expect(mockedHistory.getHistory).toHaveBeenCalledWith(2, 10);
    expect(mockedApi.getPropertyDetails).toHaveBeenCalledTimes(3);
  });
});