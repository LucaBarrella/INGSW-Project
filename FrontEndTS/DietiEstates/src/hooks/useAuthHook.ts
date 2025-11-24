import { useState, useEffect, useCallback } from 'react';
import { router } from 'expo-router';
import { User } from '../entity/User';
import { LoginRequestDTO } from '../dto/request/LoginRequest.dto';
import { useRegistrationValidator, ValidationErrors } from './useRegistrationValidator';
import { useLoginValidator, LoginValidationErrors } from './useLoginValidator';
import { IAuthService } from '../services/interfaces/IAuthService';
import { SignupRequestDTO } from '../dto/request/SignupRequest.dto';
import ErrorHandler from '../core/errors/ErrorHandler';
import ApiError from '../core/errors/ApiError';
import { getToken } from '../core/auth/TokenManager';

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export { ValidationErrors };

const initialAuthState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

type Provider = 'google' | 'meta';

const extractUserMessage = (err: unknown, fallback?: string) => {
  try {
    const apiError = ApiError.from(err);
    return (apiError as any).userMessage ?? ErrorHandler.handle(err, fallback);
  } catch {
    return ErrorHandler.handle(err, fallback);
  }
};

export const useAuthHook = (authService: IAuthService) => {
  const [authState, setAuthState] = useState<AuthState>(initialAuthState);
  const [validationErrorsState, setValidationErrorsState] = useState<ValidationErrors>({} as ValidationErrors);

  const {
    validateRegistration,
    errors: registrationValidationErrors,
    resetValidationErrors: resetRegistrationValidationErrors,
  } = useRegistrationValidator();

  const {
    validateLogin,
    errors: loginValidationErrors,
    resetValidationErrors: resetLoginValidationErrors,
  } = useLoginValidator();

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        if (!token) return;

        // Try to rehydrate user using service-provided methods
        try {
          if (typeof (authService as any).getProfile === 'function') {
            const user = await (authService as any).getProfile();
            if (user) {
              setAuthState({ user, token, isAuthenticated: true, isLoading: false, error: null });
              return;
            }
          }

          if (typeof (authService as any).rehydrate === 'function') {
            const res = await (authService as any).rehydrate(token);
            if (res?.user) {
              setAuthState({ user: res.user, token, isAuthenticated: true, isLoading: false, error: null });
              return;
            }
          }

          // token present but no user details available
          setAuthState(prev => ({ ...prev, token, isAuthenticated: true, isLoading: false }));
        } catch {
          // swallow rehydrate errors; leave unauthenticated state if rehydrate fails
        }
      } catch {
        // ignore startup read errors
      }
    })();
    // intentionally only on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setAuthState(prev => ({ ...prev, isLoading: loading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setAuthState(prev => ({ ...prev, error, isLoading: error ? false : prev.isLoading }));
  }, []);

  const updateAuthState = useCallback((user: User | null, token: string | null) => {
    setAuthState({
      user,
      token,
      isAuthenticated: !!token,
      isLoading: false,
      error: null,
    });
  }, []);

  const handlePostAuthNavigation = useCallback((user: User | null) => {
    console.log('Handling post-auth navigation for user:', JSON.stringify(user));
    console.log('User roles:', user?.roles);
    if (!user?.roles || user.roles.length === 0) {
      router.replace('/(auth)/select-role');
      return;
    }

    if (user.roles.length > 1) {
      router.replace('/(auth)/select-role');
      return;
    }
    console.log(user.roles[0]);
    console.log(user.roles[0]=== 'ROLE_MANAGER');

    switch (user.roles[0]) {
      case 'ROLE_BUYER':
        router.replace('/(protected)/(buyer)/(tabs)/home');
        break;
      case 'ROLE_AGENT':
        router.replace('/(protected)/(agent)/(tabs)/home');
        break;
      case 'ROLE_MANAGER':
        console.log('Navigating to admin home');
        router.replace('/(protected)/(admin)/(tabs)/profile');
        break;
      default:
        router.replace('/(auth)/select-role');
    }
  }, []);

  const login = useCallback(
    async (credentials: LoginRequestDTO): Promise<boolean> => {
      const { isValid } = validateLogin(credentials);
      if (!isValid) {
        setValidationErrorsState({ ...loginValidationErrors } as ValidationErrors);
        return false;
      }

      setValidationErrorsState({} as ValidationErrors);
      setLoading(true);
      setError(null);

      try {
        const { user, token } = await authService.login(credentials);
        updateAuthState(user, token);
        handlePostAuthNavigation(user);
        return true;
      } catch (err) {
        setError(extractUserMessage(err));
        return false;
      } finally {
        setLoading(false);
      }
    },
    [validateLogin, loginValidationErrors, authService, updateAuthState, handlePostAuthNavigation, setLoading, setError]
  );

  const register = useCallback(
    async (userData: SignupRequestDTO): Promise<boolean> => {
      const { isValid } = validateRegistration(userData);
      if (!isValid) {
        setValidationErrorsState({ ...registrationValidationErrors } as ValidationErrors);
        return false;
      }

      setLoading(true);
      setError(null);

      try {
        const { user, token } = await authService.register(userData);
        updateAuthState(user, token);
        return true;
      } catch (err) {
        try {
          const apiError = ApiError.from(err);
          if (apiError.statusCode === 409) {
            setError(ErrorHandler.handle(err, 'Utente già esistente.'));
            return false;
          }
          setError((apiError as any).userMessage ?? ErrorHandler.handle(err));
          return false;
        } catch {
          setError(ErrorHandler.handle(err));
          return false;
        }
      } finally {
        setLoading(false);
      }
    },
    [validateRegistration, registrationValidationErrors, authService, updateAuthState, setLoading, setError]
  );

  const logout = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      await authService.logout();
    } catch {
      // proceed with local cleanup even if remote logout fails
    } finally {
      setAuthState(initialAuthState);
      router.replace('./(auth)');
    }
  }, [authService]);

  const loginWithProvider = useCallback(
    async (provider: Provider, idToken: string): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        if (provider !== 'google') throw new Error(`Provider ${provider} non supportato.`);

        const { user, token } = await authService.loginWithGoogle(idToken);
        updateAuthState(user, token);
        return true;
      } catch (err) {
        setError(extractUserMessage(err));
        return false;
      } finally {
        setLoading(false);
      }
    },
    [authService, updateAuthState, setLoading, setError]
  );

  const navigateToRegister = useCallback(() => {
    router.push('/(auth)/register');
  }, []);

  const resetValidationErrors = useCallback((field?: keyof ValidationErrors) => {
    resetRegistrationValidationErrors(field as keyof ValidationErrors);
    resetLoginValidationErrors(field as keyof LoginValidationErrors);
    setValidationErrorsState({} as ValidationErrors);
  }, [resetRegistrationValidationErrors, resetLoginValidationErrors]);

  const clearError = useCallback(() => setError(null), [setError]);

  return {
    ...authState,
    login,
    register,
    logout,
    clearError,
    validationErrors: validationErrorsState,
    resetValidationErrors,
    loginWithProvider,
    navigateToRegister,
    handlePostAuthNavigation,
  };
};
