import React from 'react';
import { render, waitFor, act } from '@testing-library/react-native'; // Import act
import PropertyDashboard from '../PropertyDashboard';
import ApiService from '@/app/_services/api.service'; // Importa il servizio da mockare
import { DashboardStats, PropertyDetail } from '../types'; // Import types for mock data

// Mock completo del modulo ApiService
jest.mock('@/app/_services/api.service', () => ({
  getAgentStats: jest.fn(),
  getAgentProperties: jest.fn(),
  // Mockare altre funzioni se necessario
}));

// Mock del modulo i18next per le traduzioni
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key, // Semplice funzione t che restituisce la chiave
  }),
}));

// // Mock react-native-css-interop - Spostato in jest.setup.js
// jest.mock('react-native-css-interop', () => ({
//   remapProps: jest.fn((_component, props) => props),
//   createElement: jest.fn(require('react').createElement),
// }));

// // Mock react-native-safe-area-context - Spostato in jest.setup.js
// jest.mock('react-native-safe-area-context', () => {
//   const inset = { top: 0, right: 0, bottom: 0, left: 0 };
//   return {
//     SafeAreaProvider: jest.fn(({ children }) => children),
//     SafeAreaConsumer: jest.fn(({ children }) => children(inset)),
//     useSafeAreaInsets: jest.fn(() => inset),
//     useSafeAreaFrame: jest.fn(() => ({ x: 0, y: 0, width: 390, height: 844 })),
//   };
// });


// Mock di componenti figli complessi se necessario (es. TimeRangeSelector)
jest.mock('../TimeRangeSelector', () => {
  const React = require('react');
  const MockTimeRangeSelector = (props: any) => {
    // Renderizza null o un placeholder semplice, accetta props
    return <React.Fragment />;
  };
  MockTimeRangeSelector.displayName = 'MockTimeRangeSelector'; // Aggiungi displayName
  return MockTimeRangeSelector;
});
// Mock più realistici per vedere i dati renderizzati
jest.mock('../StatCard', () => ({ StatCard: ({ title, value }: { title: string, value: number | string }) => `${title}: ${value}` }));
jest.mock('../PropertyTable', () => ({ PropertyTable: ({ propertyDetails }: { propertyDetails: PropertyDetail[] }) => propertyDetails.map(p => p.title).join(', ') }));

// Mock dei dati API (definiti qui per essere accessibili a tutti i test)
const mockStats: DashboardStats = {
  totalProperties: 10, soldProperties: 2, rentedProperties: 3, activeListings: 5,
  averagePrice: 250000, monthlyViews: 1500, totalBookings: 30, averageBookingsPerProperty: 3,
};

const mockProperties: PropertyDetail[] = [
  { id: 1, title: 'Test Property 1', address: '123 Test St', price: '300000', type: 'residential', status: 'available', views: 100, bookings: 5, imageUrl: 'url1', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, // Corretto status: 'active' -> 'available'
  { id: 2, title: 'Test Property 2', address: '456 Test Ave', price: '200000', type: 'commercial', status: 'sold', views: 50, bookings: 2, imageUrl: 'url2', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, // Aggiunto createdAt/updatedAt
];

describe('PropertyDashboard Component', () => {
  const mockGetAgentStats = ApiService.getAgentStats as jest.Mock;
  const mockGetAgentProperties = ApiService.getAgentProperties as jest.Mock;

  beforeEach(() => {
    // Resetta i mock prima di ogni test
    mockGetAgentStats.mockClear();
    mockGetAgentProperties.mockClear();
    jest.useFakeTimers(); // Abilita fake timers per questa suite
  });

  it('dovrebbe mostrare l\'indicatore di caricamento inizialmente', () => { // Rimosso async
    // Non serve mockare le chiamate qui, il rendering iniziale avviene prima degli useEffect
    // mockGetAgentStats.mockResolvedValue(new Promise(() => {})); // Non necessario
    // mockGetAgentProperties.mockResolvedValue(new Promise(() => {})); // Non necessario

    const { getByText } = render(<PropertyDashboard />);

    // Verifica che il testo "loading" sia presente
    expect(getByText('loading')).toBeTruthy();

    // Verifica (opzionale) che le statistiche o la tabella non siano ancora renderizzate
    // (Questo dipende da come sono strutturati i dati di default e il rendering)
    // expect(queryByText('totalProperties')).toBeNull();
  });

  it('dovrebbe mostrare le statistiche e la tabella dopo il caricamento dei dati', async () => {
    // Usa i mock definiti sopra
    mockGetAgentStats.mockResolvedValue(mockStats);
    mockGetAgentProperties.mockResolvedValue(mockProperties);

    let getByText: (text: string) => any;
    let queryByText: (text: string) => any;
    // Usa act per wrappare il rendering iniziale che triggera useEffect
    await act(async () => {
      const result = render(<PropertyDashboard />);
      getByText = result.getByText;
      queryByText = result.queryByText;
    });

    // Usa waitFor per attendere che gli aggiornamenti di stato asincroni si completino
    await waitFor(() => {
      expect(queryByText('loading')).toBeNull();
      // Verifica usando il mock di StatCard (usa valore da mockStats)
      expect(getByText('totalProperties: 10')).toBeTruthy();
      // Verifica usando il mock di PropertyTable (usa titoli da mockProperties)
      expect(getByText('Test Property 1, Test Property 2')).toBeTruthy();
    });
  });

  it('dovrebbe mostrare un messaggio di errore se il caricamento delle statistiche fallisce', async () => {
    const mockError = new Error('Failed to fetch stats');
    mockGetAgentStats.mockRejectedValue(mockError); // Simula errore per le stats
    mockGetAgentProperties.mockResolvedValue(mockProperties); // Simula successo per le proprietà

    let getByText: (text: string) => any;
    let queryByText: (text: string) => any;
    await act(async () => {
      const result = render(<PropertyDashboard />);
      getByText = result.getByText;
      queryByText = result.queryByText;
    });

    // Attende che il caricamento finisca e l'errore venga mostrato
    await waitFor(() => {
      expect(queryByText('loading')).toBeNull();
      expect(getByText('errors.fetchStatsError')).toBeTruthy(); // Verifica messaggio di errore specifico
    });
  });

  it('dovrebbe mostrare un messaggio di errore se il caricamento delle proprietà fallisce', async () => {
    // Usa mockStats definito sopra (o una versione vuota se preferito)
    const mockError = new Error('Failed to fetch properties');
    mockGetAgentStats.mockResolvedValue(mockStats); // Simula successo per le stats
    mockGetAgentProperties.mockRejectedValue(mockError); // Simula errore per le proprietà

    let getByText: (text: string) => any;
    let queryByText: (text: string) => any;
    await act(async () => {
      const result = render(<PropertyDashboard />);
      getByText = result.getByText;
      queryByText = result.queryByText;
    });

    // Attende che il caricamento finisca e l'errore venga mostrato
    await waitFor(() => {
      expect(queryByText('loading')).toBeNull();
      expect(getByText('errors.fetchPropertiesError')).toBeTruthy(); // Verifica messaggio di errore specifico
    });
  });

});