import { useState, useEffect } from 'react';
import { User } from '../../domain/User';
import * as AuthApiService from '../../data/api/AuthApiService';
import { LoginCredentials } from '../../../types/UserCredentials';
import { ApiResponseToken } from '../../data/api/ResponseTokenService';

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export const useAuthViewModel = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  });

  // Funzione per salvare il token e lo stato di autenticazione
  const saveAuthState = (token: string, user: User) => {
    setAuthState({
      user,
      token,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    });
    // Salvare il token in localStorage o AsyncStorage per la persistenza
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
  };

  // Funzione per caricare lo stato di autenticazione dal localStorage
  const loadAuthState = () => {
    const token = localStorage.getItem('authToken');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      try {
        const user: User = JSON.parse(userStr);
        setAuthState({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    }
  };

  // Carica lo stato di autenticazione all'avvio
  useEffect(() => {
    loadAuthState();
  }, []);

  const login = async (credentials: LoginCredentials, userType: 'buyer' | 'admin' | 'agent'): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      let response: ApiResponseToken;
      
      switch (userType) {
        case 'buyer':
          response = await AuthApiService.loginUser(credentials);
          break;
        case 'admin':
          response = await AuthApiService.loginAdmin(credentials);
          break;
        case 'agent':
          response = await AuthApiService.loginAgent(credentials);
          break;
        default:
          throw new Error('Tipo utente non valido');
      }

      if (response.success && response.token) {
        // Creare un oggetto utente semplificato basato sulle informazioni disponibili
        const user: User = {
          id: response.userId?.toString() || '',
          email: credentials.email,
          firstName: response.firstName || '',
          lastName: response.lastName || '',
          role: response.userType || 'buyer',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        saveAuthState(response.token, user);
        return true;
      } else {
        throw new Error(response.message || 'Login fallito');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Errore durante il login';
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return false;
    }
  };

  const register = async (userData: { 
    email: string; 
    password?: string; 
    name?: string; 
    firstName?: string;
    lastName?: string;
    role?: 'buyer' | 'admin' | 'agent';
  }): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await AuthApiService.registerUser(userData);
      
      if (response.success) {
        // Dopo la registrazione, effettua il login automaticamente
        const loginCredentials: LoginCredentials = {
          email: userData.email,
          password: userData.password || '',
        };
        
        // Determina il ruolo per il login
        const userType = userData.role || 'buyer';
        const loginSuccess = await login(loginCredentials, userType);
        
        return loginSuccess;
      } else {
        throw new Error(response.message || 'Registrazione fallita');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Errore durante la registrazione';
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      await AuthApiService.logout();
      
      // Rimuovi i dati dal localStorage
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      
      // Resetta lo stato di autenticazione
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Errore durante il logout';
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      // Nonostante l'errore, rimuoviamo i dati locali
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: errorMessage,
      });
    }
  };

  const changePassword = async (passwordData: { oldPassword: string; newPassword: string }): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await AuthApiService.changeAdminPassword(passwordData);
      
      if (response.success) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return true;
      } else {
        throw new Error(response.message || 'Cambio password fallito');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Errore durante il cambio password';
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return false;
    }
  };

  const clearError = () => {
    setAuthState(prev => ({ ...prev, error: null }));
  };

  return {
    ...authState,
    login,
    register,
    logout,
    changePassword,
    clearError,
    loadAuthState,
  };
};