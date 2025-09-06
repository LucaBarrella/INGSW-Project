import React, { createContext, useState, useEffect, useContext, ReactNode, useRef } from 'react';
import { getToken, saveToken, removeToken, saveRefreshToken, getRefreshToken, removeRefreshToken } from '@/app/_services/token.service';
import ApiService from '@/app/_services/api.service';
// Rimosso importazione errata di logout
import { UserCredentials } from '@/types/UserCredentials';
import { Alert } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import ApiError from '@/app/_services/errors/ApiError';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  user: any; // Puoi definire un tipo più specifico per l'utente
  signIn: (credentials: UserCredentials) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (credentials: UserCredentials) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
  hasCompletedOnboarding: boolean | null; // Aggiunto
  completeOnboarding: () => Promise<void>; // Nuova API per segnare l'onboarding come completato
  // Nuovi campi per la selezione del ruolo dopo il login
  availableRoles: string[] | null;
  setActiveRole: (role: string) => Promise<void>;
  activeRole: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null); // Nuovo stato per l'onboarding
  // Stato per i ruoli disponibili e ruolo attivo
  const [availableRoles, setAvailableRoles] = useState<string[] | null>(null);
  const [activeRole, setActiveRoleState] = useState<string | null>(null);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const loadAppState = async () => {
      try {
        const token = await getToken();
        const storedUserType = await AsyncStorage.getItem('userType');
        const storedAvailableRoles = await AsyncStorage.getItem('availableRoles');
        const storedActiveRole = await AsyncStorage.getItem('activeRole');
        console.log("AuthContext: Token caricato:", token ? "presente" : "assente");
        console.log("AuthContext: UserType caricato:", storedUserType);
        console.log("AuthContext: availableRoles raw:", storedAvailableRoles);
        console.log("AuthContext: activeRole raw:", storedActiveRole);

        let parsedAvailableRoles: string[] | null = null;
        if (storedAvailableRoles) {
          try {
            parsedAvailableRoles = JSON.parse(storedAvailableRoles);
            setAvailableRoles(parsedAvailableRoles);
          } catch (e) {
            console.warn("AuthContext: Impossibile parsare availableRoles da AsyncStorage:", e);
          }
        }

        if (token) {
          // Mantieni user consistente con token, userType e ruoli disponibili se presenti
          setUser({ token, userType: storedUserType, roles: parsedAvailableRoles ?? [] });
          console.log("AuthContext: Stato utente impostato da caricamento iniziale.");
        }

        if (storedActiveRole) {
          setActiveRoleState(storedActiveRole);
        }

        const onboardingStatus = await AsyncStorage.getItem('hasCompletedOnboarding');
        console.log("AuthContext: Valore raw 'hasCompletedOnboarding' da AsyncStorage:", onboardingStatus);
        const isCompleted = onboardingStatus === 'true';
        console.log("AuthContext: Risultato comparazione (onboardingStatus === 'true'):", isCompleted);
        setHasCompletedOnboarding(isCompleted);
        console.log("AuthContext: Stato 'hasCompletedOnboarding' impostato a:", isCompleted);
      } catch (error) {
        console.error('AuthContext: Errore durante il caricamento dello stato dell\'app:', error);
        // Non impostare a false qui, per evitare di forzare l'onboarding in caso di errore di lettura
        // setHasCompletedOnboarding(false);
      } finally {
        setIsLoading(false);
        console.log("AuthContext: Caricamento stato iniziale completato. isLoading = false.");
      }
    };
    loadAppState();
  }, []); // Esegui solo al mount iniziale

  const segmentsKey = segments.join('/');
  const lastRedirectRef = useRef<string | null>(null);
  
  useEffect(() => {
    console.log("AuthContext Effect - Stato attuale:", {
      isLoading,
      user: !!user, // Converti in booleano per semplicità nel log
      hasCompletedOnboarding,
      segments: segmentsKey,
    });
    console.log("AuthContext Effect - Valore di user all'inizio dell'effect:", user); // Nuovo log
  
    // Non reindirizzare finché lo stato non è completamente caricato
    if (isLoading || hasCompletedOnboarding === null) {
      console.log("AuthContext Effect - Stato non pronto per il reindirizzamento.");
      return;
    }
  
    const inOnboardingGroup = segments[0] === '(onboarding)';
    const inAuthGroup = segments[0] === '(auth)';
    const inProtectedGroup = segments[0] === '(protected)';
  
    let redirectPath: string | null = null;
  
    if (!hasCompletedOnboarding) {
      console.log("AuthContext Effect - Onboarding NON completato.");
      // Se l'onboarding non è stato completato, reindirizza sempre a /(onboarding)
      if (!inOnboardingGroup) {
        redirectPath = '/(onboarding)';
      } else {
        console.log("AuthContext Effect - Già in /(onboarding).");
      }
    } else {
      console.log("AuthContext Effect - Onboarding completato.");
      // Onboarding completato
      if (user) {
        console.log("AuthContext Effect - Utente loggato. user.userType:", user.userType);
        console.log("AuthContext Effect - Utente loggato. user.roles:", user.roles);
        console.log("AuthContext Effect - Utente loggato. availableRoles (from state):", availableRoles);

        // Utente loggato, reindirizza alla home protetta se non è già lì
        if (!inProtectedGroup) {
          // Se l'utente ha ruoli disponibili (anche uno solo), reindirizza alla selezione del ruolo
          if (user.roles && user.roles.length > 0) {
            redirectPath = '/(auth)/select-role';
            console.log("AuthContext Effect - Ruoli disponibili, reindirizzo a select-role.");
          } else {
            // Se l'utente non ha ruoli disponibili, è un buyer di default
            redirectPath = '/(protected)/(buyer)/(tabs)/home';
            console.log("AuthContext Effect - Nessun ruolo disponibile, reindirizzo a buyer (default).");
          }
        } else {
          console.log("AuthContext Effect - Già in /(protected).");
        }
      } else {
        console.log("AuthContext Effect - Utente NON loggato.");
        // Utente non loggato, reindirizza alla pagina di login se non è già lì
        if (!inAuthGroup) {
          redirectPath = '/(auth)/login';
        } else {
          console.log("AuthContext Effect - Già in /(auth)/login.");
        }
      }
    }
  
    if (redirectPath && redirectPath !== lastRedirectRef.current) {
      console.log(`AuthContext Effect - Reindirizzo a ${redirectPath}.`);
      lastRedirectRef.current = redirectPath;
      router.replace(redirectPath as any);
    } else {
      if (redirectPath) {
        console.log("AuthContext Effect - Redirect già eseguito a questo percorso, skip.");
      } else {
        console.log("AuthContext Effect - Nessun redirect necessario.");
      }
    }
  }, [user?.token, segmentsKey, isLoading, hasCompletedOnboarding]); // Aggiungi hasCompletedOnboarding alle dipendenze

  const clearError = () => setError(null);

  // Funzione esposta per completare l'onboarding in modo sincrono con lo stato del context.
  // Questo evita condizioni di gara quando una view scrive direttamente su AsyncStorage
  // e la context state non viene aggiornato subito, causando loop di routing.
  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
      setHasCompletedOnboarding(true);
      console.log("AuthContext: completeOnboarding impostato a true e salvato su AsyncStorage.");
    } catch (err) {
      console.error('AuthContext: Errore durante completeOnboarding:', err);
    }
  };

  // Imposta il ruolo attivo scelto dall'utente (usato nella selezione post-login).
  // Salva sia in AsyncStorage che nello stato in-memory per permettere il redirect
  // gestito dall'useEffect principale.
  const setActiveRole = async (role: string) => {
    try {
      await AsyncStorage.setItem('userType', role);
      await AsyncStorage.setItem('activeRole', role);
      setActiveRoleState(role);
      // Aggiorna lo user object se presente (aggiunge userType)
      setUser((prev: any) => {
        if (!prev) return prev;
        return { ...prev, userType: role };
      });
      console.log(`AuthContext: Ruolo attivo impostato su '${role}'`);
    } catch (err) {
      console.error('AuthContext: Errore durante setActiveRole:', err);
      throw err;
    }
  };

  const signIn = async (credentials: UserCredentials) => {
    clearError(); // Resetta l'errore all'inizio di un nuovo tentativo
    try {
      // Chiamata unificata al backend; temporaneamente mappata su loginUser finché
      // AuthApiService non espone il nuovo endpoint /api/auth/login.
      const responseData: any = await ApiService.loginUser(credentials);
  
      // Il nuovo backend può restituire shape diverse: supportiamo accessToken o token
      const token = responseData?.accessToken ?? responseData?.token ?? responseData?.data?.accessToken;
      const refreshToken = responseData?.refreshToken ?? responseData?.data?.refreshToken;
      const availableRoles = responseData?.roles ?? responseData?.availableRoles ?? responseData?.data?.roles;
  
      if (token) {
        await saveToken(token);
        if (refreshToken) {
          await saveRefreshToken(refreshToken);
        }
        await AsyncStorage.setItem('hasCompletedOnboarding', 'true'); // Imposta onboarding a true

        if (availableRoles) {
          await AsyncStorage.setItem('availableRoles', JSON.stringify(availableRoles));
          setAvailableRoles(availableRoles);
          console.log("AuthContext: 'availableRoles' salvato in AsyncStorage:", availableRoles);
        } else {
          // Se il backend non ha inviato ruoli, assicurati che lo stato sia almeno un array vuoto
          setAvailableRoles([]);
        }

        // Salva lo stato user con token e ruoli disponibili (l'app deciderà quale ruolo attivare)
        setUser({ token, roles: availableRoles ?? [] });
        console.log('Login riuscito, token e ruoli salvati e onboarding completato!');
        console.log('Stato user dopo signIn:', { user: { token, roles: availableRoles } });
        // Lascia che l'useEffect principale gestisca il redirect
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
    let logoutApiSuccess = false;
    try {
      const refreshToken = await getRefreshToken();
      console.log('Refresh token recuperato:', refreshToken);
      if (refreshToken) {
        await ApiService.logout(refreshToken); // Chiama la funzione API di logout con il refreshToken
        logoutApiSuccess = true;
        console.log('Logout API chiamato con successo.');
      } else {
        console.warn('Refresh token non trovato. Esecuzione del logout locale.');
      }
    } catch (apiError) {
      console.error('Errore durante il logout API:', apiError);
      // Non bloccare il logout locale anche se l'API fallisce
      Alert.alert('Errore Logout', 'Si è verificato un problema durante il logout dal server. Riprova più tardi.');
    } finally {
      await removeToken();
      await removeRefreshToken();
      setUser(null);
      console.log("Sign out process complete. User state should be null.");
      // La navigazione è gestita dall'useEffect
    }
  };

  const signUp = async (credentials: UserCredentials) => {
    clearError(); // Resetta l'errore all'inizio di un nuovo tentativo
    try {
      const responseData = await ApiService.registerUser(credentials);
      const token = responseData?.accessToken;
      if (token) {
        await saveToken(token);
        await saveRefreshToken(responseData.refreshToken);
        await AsyncStorage.setItem('hasCompletedOnboarding', 'true'); // Imposta onboarding a true
        if (responseData.userType) {
          await AsyncStorage.setItem('userType', responseData.userType);
          console.log("AuthContext: 'userType' salvato in AsyncStorage:", responseData.userType);
        }
        setUser({ token, userType: responseData.userType });
        console.log('Registrazione riuscita. Token, userType salvati e onboarding completato!');
        console.log('Stato user dopo signUp:', { user: { token, userType: responseData.userType } });
        Alert.alert(
          'Registrazione Riuscita',
          'Il tuo account è stato creato con successo. Benvenuto!',
          // Rimuovi il reindirizzamento esplicito qui, lascia che l'useEffect principale lo gestisca
          [ { text: 'OK' } ]
        );
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
    <AuthContext.Provider value={{
      user,
      signIn,
      signOut,
      signUp,
      isLoading,
      error,
      clearError,
      hasCompletedOnboarding,
      completeOnboarding,
      // Espongo i nuovi metodi/stati per la selezione ruolo post-login
      availableRoles,
      setActiveRole,
      activeRole
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