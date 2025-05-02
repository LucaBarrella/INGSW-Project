import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
import AddAdminScreen from '../add-admin'; // Importa il componente
import ApiService from '@/app/_services/api.service'; // Importa il servizio da mockare
import { useRouter } from 'expo-router'; // Importa hook usati

// Mock del modulo ApiService
jest.mock('@/app/_services/api.service', () => ({
  createAdmin: jest.fn(),
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
    props.onSubmit({ 
      name: 'Test', 
      surname: 'Admin', 
      email: 'test@admin.com', 
      birthDate: '2000-01-01', 
      password: 'password123' 
    });
  };
  // Simula un pulsante o un modo per triggerare onSubmit
  return (
    <button data-testid="submit-button" onClick={handlePress}>
      {props.isLoading ? 'Loading...' : 'Create Admin'}
    </button>
  );
});

describe('AddAdminScreen Component', () => {
  const mockCreateAdmin = ApiService.createAdmin as jest.Mock;
  const mockUseRouter = useRouter as jest.Mock;
  const mockRouterBack = jest.fn();

  beforeEach(() => {
    mockCreateAdmin.mockClear();
    mockUseRouter.mockReturnValue({ back: mockRouterBack });
    mockRouterBack.mockClear();
  });

  it('dovrebbe chiamare ApiService.createAdmin e router.back al submit con successo', async () => {
    mockCreateAdmin.mockResolvedValue({ success: true }); // Simula successo API

    render(<AddAdminScreen />);

    // Trova e simula il click sul pulsante (o l'evento submit del form mockato)
    const submitButton = screen.getByTestId('submit-button');
    fireEvent.press(submitButton);

    // Attende che le chiamate asincrone vengano completate
    await waitFor(() => {
      // Verifica che createAdmin sia stato chiamato
      expect(mockCreateAdmin).toHaveBeenCalledTimes(1);
      // Verifica che sia stato chiamato con i dati corretti (dal mock del form)
      expect(mockCreateAdmin).toHaveBeenCalledWith({
        name: 'Test', 
        surname: 'Admin', 
        email: 'test@admin.com', 
        birthDate: '2000-01-01', 
        password: 'password123' 
      });
      // Verifica che router.back sia stato chiamato
      expect(mockRouterBack).toHaveBeenCalledTimes(1);
    });

    // Verifica che non ci siano messaggi di errore
    expect(screen.queryByText('admin.screens.addAdmin.error')).toBeNull();
  });

  it('dovrebbe mostrare un messaggio di errore se ApiService.createAdmin fallisce', async () => {
    const errorMessage = 'Errore creazione admin';
    mockCreateAdmin.mockRejectedValue(new Error(errorMessage)); // Simula fallimento API

    render(<AddAdminScreen />);

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.press(submitButton);

    // Attende che l'errore venga gestito e mostrato
    await waitFor(() => {
      expect(mockCreateAdmin).toHaveBeenCalledTimes(1);
      // Verifica che il messaggio di errore sia visibile
      // Nota: il testo esatto dipende da come viene gestito l'errore nel componente
      expect(screen.getByText(errorMessage)).toBeTruthy(); 
    });

    // Verifica che router.back NON sia stato chiamato
    expect(mockRouterBack).not.toHaveBeenCalled();
  });
});