import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useRouter, useSegments } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../src/entity/User';
import { useAuthHook, ValidationErrors } from '../src/hooks/useAuthHook';
import { IAuthService } from '../src/services/interfaces/IAuthService';
import { SignupRequestDTO } from '../src/dto/request/SignupRequest.dto';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: any) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (userData: SignupRequestDTO) => Promise<boolean>;
  hasCompletedOnboarding: boolean | null;
  completeOnboarding: () => Promise<void>;
  validationErrors: ValidationErrors;
  resetValidationErrors: (field?: keyof ValidationErrors) => void;
  loginWithProvider: (provider: 'google' | 'meta', idToken: string) => Promise<boolean>;
  navigateToRegister: () => void;
  handlePostAuthNavigation: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
  authService: IAuthService;
}

export const AuthProvider = ({ children, authService }: AuthProviderProps) => {
  const { user, token, isAuthenticated, isLoading, error, login, logout, register, validationErrors, resetValidationErrors, loginWithProvider, navigateToRegister, handlePostAuthNavigation } = useAuthHook(authService);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const checkOnboarding = async () => {
      const onboardingStatus = await AsyncStorage.getItem('hasCompletedOnboarding');
      setHasCompletedOnboarding(onboardingStatus === 'true');
    };
    checkOnboarding();
  }, []);

  useEffect(() => {
    if (isLoading || hasCompletedOnboarding === null) {
      return;
    }

    const inAuthGroup = segments[0] === '(auth)';
    const inProtectedGroup = segments[0] === '(protected)';

    if (!hasCompletedOnboarding) {
      if (segments[0] !== '(onboarding)') {
        router.replace('/(onboarding)');
      }
    } else if (isAuthenticated) {
      if (!inProtectedGroup) {
        // Logica di reindirizzamento specifica per ruolo (se necessaria)
        // Esempio: const role = user?.roles?.[0];
        router.replace('/(protected)/(buyer)/(tabs)/home');
      }
    } else {
      if (!inAuthGroup) {
        router.replace('/(auth)/login');
      }
    }
  }, [isAuthenticated, hasCompletedOnboarding, isLoading, segments, user]);

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
      setHasCompletedOnboarding(true);
    } catch (err) {
      console.error('Errore durante il salvataggio dello stato di onboarding:', err);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated,
      isLoading,
      error,
      login,
      logout,
      register,
      hasCompletedOnboarding,
      completeOnboarding,
      validationErrors,
      resetValidationErrors,
      loginWithProvider,
      navigateToRegister,
      handlePostAuthNavigation,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};