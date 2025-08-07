import * as SecureStore from 'expo-secure-store';
import { saveToken, getToken, removeToken } from '../token.service';

jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn(),
  getItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

describe('Token Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should save the token correctly', async () => {
    const token = 'test-token';
    await saveToken(token);
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith('auth_token', token);
  });

  it('should get the token correctly', async () => {
    const token = 'test-token';
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(token);
    const result = await getToken();
    expect(result).toBe(token);
    expect(SecureStore.getItemAsync).toHaveBeenCalledWith('auth_token');
  });

  it('should return null if no token is found', async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);
    const result = await getToken();
    expect(result).toBeNull();
  });

  it('should remove the token correctly', async () => {
    await removeToken();
    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('auth_token');
  });
});