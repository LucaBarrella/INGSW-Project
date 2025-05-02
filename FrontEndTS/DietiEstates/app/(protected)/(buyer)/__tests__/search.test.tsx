import React from 'react';
import { render, waitFor, screen } from '@testing-library/react-native'; // Import screen for better queries
import { ActivityIndicator } from 'react-native'; // Import ActivityIndicator
import SearchResultsScreen from '../search'; // Importa il componente della schermata
import ApiService from '@/app/_services/api.service'; // Importa il servizio da mockare
import { useLocalSearchParams, Stack } from 'expo-router'; // Importa hook e componenti usati

// Mock del modulo ApiService
jest.mock('@/app/_services/api.service', () => ({
  searchProperties: jest.fn(),
}));

// Mock del modulo expo-router
jest.mock('expo-router', () => ({
  useLocalSearchParams: jest.fn(),
  Stack: {
    Screen: (props: any) => null, // Mock semplice per Stack.Screen
  },
}));

// Mock react-native-iconify to prevent errors in tests
jest.mock('react-native-iconify', () => ({
    Iconify: (props: any) => {
        // Import Text inside the factory function
        const { Text: MockText } = require('react-native');
        return <MockText>Icon:{props.icon}</MockText>; // Simple mock
    }
}));

// Mock di componenti figli se necessario (es. BuyerPropertyCard)
// jest.mock('@/components/Buyer/BuyerPropertyCard', () => 'BuyerPropertyCard');

describe('SearchResultsScreen Component', () => {
  const mockSearchProperties = ApiService.searchProperties as jest.Mock;
  const mockUseLocalSearchParams = useLocalSearchParams as jest.Mock;

  beforeEach(() => {
    // Resetta i mock prima di ogni test
    mockSearchProperties.mockClear();
    mockUseLocalSearchParams.mockClear();
    // Imposta un valore di default per i params
    mockUseLocalSearchParams.mockReturnValue({ query: 'test query' }); 
  });

  it('dovrebbe mostrare l\'indicatore di caricamento inizialmente', async () => {
    mockSearchProperties.mockResolvedValue(new Promise(() => {})); // Promise che non si risolve

    render(<SearchResultsScreen />);

    // Verifica la presenza dell'ActivityIndicator usando testID o un approccio più robusto se possibile
    // Per ora, usiamo getByType come fallback, ma è deprecato
    // expect(screen.getByTestId('loading-indicator')).toBeTruthy(); // Esempio con testID
    expect(screen.UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
  });

  it('dovrebbe mostrare i risultati dopo il caricamento', async () => {
    const mockResults = [
      { id: 'res1', title: 'Result 1', address: 'Addr 1', price: 100000, type: 'Villa', status: 'Available', imageUrl: '' },
      { id: 'res2', title: 'Result 2', address: 'Addr 2', price: 200000, type: 'Apartment', status: 'Available', imageUrl: '' },
    ];
    mockSearchProperties.mockResolvedValue(mockResults);
    mockUseLocalSearchParams.mockReturnValue({ category: 'Villa' }); // Simula ricerca per categoria

    render(<SearchResultsScreen />);

    await waitFor(() => {
      // Verifica che l'indicatore di caricamento sia sparito
      expect(screen.queryByTestId('loading-indicator')).toBeNull(); // Esempio con testID
      // Verifica la presenza dei risultati
      expect(screen.getByText('Result 1')).toBeTruthy();
      expect(screen.getByText('Result 2')).toBeTruthy();
    });

    // Verifica che l'API sia stata chiamata con i parametri corretti
    expect(mockSearchProperties).toHaveBeenCalledWith({ category: 'Villa' });
  });

  it('dovrebbe mostrare il messaggio "Nessun risultato" se l\'API restituisce un array vuoto', async () => {
    mockSearchProperties.mockResolvedValue([]); // API restituisce array vuoto
    mockUseLocalSearchParams.mockReturnValue({ query: 'nonexistent' });

    render(<SearchResultsScreen />);

    await waitFor(() => {
      expect(screen.queryByTestId('loading-indicator')).toBeNull();
      expect(screen.getByText('Nessun risultato trovato per questa ricerca')).toBeTruthy();
    });
     expect(mockSearchProperties).toHaveBeenCalledWith({ query: 'nonexistent' });
  });


  it('dovrebbe mostrare un messaggio di errore generico se il caricamento fallisce', async () => {
    const mockError = new Error('API Error');
    mockSearchProperties.mockRejectedValue(mockError);
    mockUseLocalSearchParams.mockReturnValue({ query: 'error query' });

    render(<SearchResultsScreen />);

    // Attende che il caricamento finisca
    await waitFor(() => {
       expect(screen.queryByTestId('loading-indicator')).toBeNull();
    });
    
    // Verifica che venga mostrato il messaggio di errore corretto
    // Il componente SearchResultsScreen mostra questo testo specifico in caso di errore
    expect(screen.getByText('Impossibile caricare i risultati della ricerca. Riprova più tardi.')).toBeTruthy();

    expect(mockSearchProperties).toHaveBeenCalledWith({ query: 'error query' });
  });

});