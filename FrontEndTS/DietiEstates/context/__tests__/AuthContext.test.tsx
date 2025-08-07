import React from 'react';
import { render, act, waitFor } from '@testing-library/react-native';
import { AuthProvider, useAuth } from '../AuthContext';
import * as tokenService from '@/app/_services/token.service';
import ApiService from '@/app/_services/api.service';
import { Text, View } from 'react-native';

jest.mock('@/app/_services/token.service');
jest.mock('@/app/_services/api.service');
jest.mock('expo-router', () => ({
  useRouter: () => ({
    replace: jest.fn(),
  }),
  useSegments: () => ['(auth)'],
}));

const TestComponent = () => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <Text>Loading...</Text>;
  return <Text>{user ? `User: ${user.token}` : 'No user'}</Text>;
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should have correct initial state', async () => {
    (tokenService.getToken as jest.Mock).mockResolvedValue(null);
    const { findByText } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    expect(await findByText('No user')).toBeTruthy();
  });

  it('should login successfully and save token', async () => {
    const mockToken = 'fake-token';
    (ApiService.loginUser as jest.Mock).mockResolvedValue({ accessToken: mockToken });
    (tokenService.saveToken as jest.Mock).mockResolvedValue(undefined);

    let authContext: any;
    const TestLoginComponent = () => {
      authContext = useAuth();
      return null;
    };

    render(
      <AuthProvider>
        <TestLoginComponent />
      </AuthProvider>
    );

    await act(async () => {
      if (authContext) {
        await authContext.signIn({ email: 'test@test.com', password: 'password' }, 'buyer');
      }
    });

    expect(ApiService.loginUser).toHaveBeenCalledWith({ email: 'test@test.com', password: 'password' });
    expect(tokenService.saveToken).toHaveBeenCalledWith(mockToken);
    expect(authContext?.user).toEqual({ token: mockToken });
  });

  it('should logout successfully and remove token', async () => {
    (tokenService.removeToken as jest.Mock).mockResolvedValue(undefined);

    let authContext: any;
    const TestLogoutComponent = () => {
      authContext = useAuth();
      return null;
    };

    render(
      <AuthProvider>
        <TestLogoutComponent />
      </AuthProvider>
    );
    
    // Simulate user being logged in
    await act(async () => {
      if (authContext) {
        (ApiService.loginUser as jest.Mock).mockResolvedValue({ accessToken: 'test-token' });
        await authContext.signIn({ email: 'test@test.com', password: 'password' }, 'buyer');
      }
    });

    await act(async () => {
      if (authContext) {
        await authContext.signOut();
      }
    });

    expect(tokenService.removeToken).toHaveBeenCalled();
    expect(authContext?.user).toBeNull();
  });

  it('should auto-login if token exists', async () => {
    const mockToken = 'existing-token';
    (tokenService.getToken as jest.Mock).mockResolvedValue(mockToken);

    const { findByText } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(await findByText(`User: ${mockToken}`)).toBeTruthy();
    expect(tokenService.getToken).toHaveBeenCalled();
  });
});