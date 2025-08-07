import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
import AddAgentScreen from '../add-agent'; // Importa il componente
import ApiService from '@/app/_services/api.service'; // Importa il servizio da mockare
import { useRouter } from 'expo-router'; // Importa hook usati

// Mock del modulo ApiService
jest.mock('@/app/_services/api.service', () => ({
  createAgent: jest.fn(), // Mock specifico per createAgent
}));

// Mock del modulo expo-router
jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => ({
    back: jest.fn(), // Mock della funzione back
  })),
}));

// Mock del modulo i18next per le traduzioni
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key, // Semplice funzione t
  }),
}));

// Mock del componente UserCreationForm per isolare il test
jest.mock('@/components/UserCreationForm', () => (props: any) => {
  // Mock che permette di simulare l'invio del form chiamando onSubmit
  const handlePress = () => {
    // Simula dati specifici per l'agente, incluso licenseNumber
    props.onSubmit({ 
      name: 'Test', 
      surname: 'Agent', 
      email: 'test@agent.com', 
      birthDate: '1995-05-05', 
      password: 'password456',
      licenseNumber: 'REA12345', // Campo specifico per agente
      phoneNumber: '1234567890' // Campo specifico per agente
    });
  };
  // Simula un pulsante o un modo per triggerare onSubmit
  return (
    <button data-testid="submit-button" onClick={handlePress}>
      {props.isLoading ? 'Loading...' : 'Create Agent'}
    </button>
  );
});

describe('AddAgentScreen Component', () => {
  const mockCreateAgent = ApiService.createAgent as jest.Mock;
  const mockUseRouter = useRouter as jest.Mock;
  const mockRouterBack = jest.fn();

  beforeEach(() => {
    mockCreateAgent.mockClear();
    mockUseRouter.mockReturnValue({ back: mockRouterBack });
    mockRouterBack.mockClear();
  });

  it('dovrebbe chiamare ApiService.createAgent e router.back al submit con successo', async () => {
    mockCreateAgent.mockResolvedValue({ success: true }); // Simula successo API

    render(<AddAgentScreen />);

    // Trova e simula il click sul pulsante (o l'evento submit del form mockato)
    const submitButton = screen.getByTestId('submit-button');
    fireEvent.press(submitButton);

    // Attende che le chiamate asincrone vengano completate
    await waitFor(() => {
      // Verifica che createAgent sia stato chiamato
      expect(mockCreateAgent).toHaveBeenCalledTimes(1);
      // Verifica che sia stato chiamato con i dati corretti (dal mock del form)
      expect(mockCreateAgent).toHaveBeenCalledWith({
        name: 'Test', 
        surname: 'Agent', 
        email: 'test@agent.com', 
        birthDate: '1995-05-05', 
        password: 'password456',
        licenseNumber: 'REA12345',
        phoneNumber: '1234567890'
      });
      // Verifica che router.back sia stato chiamato
      expect(mockRouterBack).toHaveBeenCalledTimes(1);
    });

    // Verifica che non ci siano messaggi di errore
    expect(screen.queryByText('admin.screens.addAgent.error')).toBeNull();
  });

  it('dovrebbe mostrare un messaggio di errore se ApiService.createAgent fallisce', async () => {
    const errorMessage = 'Errore creazione agente';
    mockCreateAgent.mockRejectedValue(new Error(errorMessage)); // Simula fallimento API

    render(<AddAgentScreen />);

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.press(submitButton);

    // Attende che l'errore venga gestito e mostrato
    await waitFor(() => {
      expect(mockCreateAgent).toHaveBeenCalledTimes(1);
      // Verifica che il messaggio di errore sia visibile
      expect(screen.getByText(errorMessage)).toBeTruthy(); 
    });

    // Verifica che router.back NON sia stato chiamato
    expect(mockRouterBack).not.toHaveBeenCalled();
  });
});