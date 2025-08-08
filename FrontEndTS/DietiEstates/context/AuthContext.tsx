import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { getToken, saveToken, removeToken } from '@/app/_services/token.service';
import ApiService from '@/app/_services/api.service';
import { logout } from '@/app/_services/api.service'; // Importa la funzione logout
import { UserCredentials } from '@/types/UserCredentials';
import { Alert } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import ApiError from '@/app/_services/errors/ApiError';

interface AuthContextType {
  user: any; // Puoi definire un tipo più specifico per l'utente
  signIn: (credentials: UserCredentials, userType: 'admin' | 'agent' | 'buyer') => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (credentials: UserCredentials) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await getToken();
        if (token) {
          // Qui potresti voler validare il token con il backend o decodificarlo
          // Per ora, assumiamo che la presenza del token significhi utente autenticato
          setUser({ token }); // O un oggetto utente più completo se il token contiene info
        }
      } catch (error) {
        console.error('Errore durante il caricamento del token:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  useEffect(() => {
    console.log("Auth effect running. User:", user ? user.userType : null, "Segments:", segments);
    const isProtected = (segments: string[]) => segments[0] === '(protected)';

    if (!isLoading) {
      const inAuthGroup = segments[0] === '(auth)';

      if (user && !isProtected(segments)) {
        // Utente loggato, reindirizza alla home protetta
        router.replace('/(protected)/(buyer)/(tabs)/home');
      } else if (!user && isProtected(segments)) {
        // Utente non loggato, reindirizza alla pagina di login
        console.log("Redirecting to login page...");
        router.replace('/(auth)');
      }
    }
  }, [user, segments, isLoading]);

  const clearError = () => setError(null);

  const signIn = async (credentials: UserCredentials, userType: 'admin' | 'agent' | 'buyer') => {
    clearError(); // Resetta l'errore all'inizio di un nuovo tentativo
    try {
      let responseData: any;
      switch (userType) {
        case 'admin':
          responseData = await ApiService.loginAdmin(credentials);
          break;
        case 'agent':
          responseData = await ApiService.loginAgent(credentials);
          break;
        default: // buyer
          responseData = await ApiService.loginUser(credentials);
      }

      const token = responseData?.accessToken;
      if (token) {
        await saveToken(token);
        setUser({ token });
        console.log('Login riuscito, token salvato!');
      } else {
        setError('Token di autenticazione non ricevuto dal server.');
      }
    } catch (err) {
      console.error('Errore durante il login:', err);
      if (err instanceof ApiError) {
        setError(err.userMessage);
      } else {
        setError('Si è verificato un errore imprevisto durante il login.');
      }
      throw err;
    }
  };

  const signOut = async () => {
    console.log("Attempting to sign out...");
    try {
      await logout(); // Chiama la funzione API di logout
      console.log('Logout API chiamato con successo.');
    } catch (apiError) {
      console.error('Errore durante il logout API:', apiError);
      // Non bloccare il logout locale anche se l'API fallisce
      Alert.alert('Errore Logout', 'Si è verificato un problema durante il logout dal server. Riprova più tardi.');
    } finally {
      await removeToken();
      setUser(null);
      console.log("Sign out process complete. User state should be null.");
      // La navigazione è gestita dall'useEffect
    }
  };

  const signUp = async (credentials: UserCredentials) => {
    clearError(); // Resetta l'errore all'inizio di un nuovo tentativo
    try {
      const responseData = await ApiService.registerUser(credentials);
      const token = responseData?.token;
      if (token) {
        await saveToken(token);
        setUser({ token });
        console.log('Registrazione riuscita, token salvato!');
      } else {
        setError('Token di autenticazione non ricevuto dopo la registrazione.');
      }
    } catch (err) {
      console.error('Errore durante la registrazione:', err);
      if (err instanceof ApiError) {
        setError(err.userMessage);
      } else {
        setError('Si è verificato un errore imprevisto durante la registrazione.');
      }
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, signUp, isLoading, error, clearError }}>
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