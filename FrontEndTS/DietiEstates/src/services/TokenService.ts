import * as SecureStore from "expo-secure-store";
import { ITokenService } from "./interfaces/ITokenService";
import { ITokenProvider } from "../core/auth/ITokenProvider";

/**
 * TokenService implementa l'adapter per lo storage sicuro.
 * Implementa sia ITokenService (service layer) che ITokenProvider (core abstraction)
 * in modo da poter essere iniettato come provider nel TokenManager.
 */
const ACCESS_TOKEN_KEY = "user_auth_token";
const REFRESH_TOKEN_KEY = "user_refresh_token";

export class TokenService implements ITokenService, ITokenProvider {
  async saveToken(token: string): Promise<void> {
    console.log('[TokenService] saveToken called, token present:', !!token);
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
  }

  async getToken(): Promise<string | null> {
    const t = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    console.log('[TokenService] getToken -> hasToken:', !!t);
    return t;
  }

  async removeToken(): Promise<void> {
    console.log('[TokenService] removeToken called');
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
  }

  async saveRefreshToken(token: string): Promise<void> {
    console.log('[TokenService] saveRefreshToken called, token present:', !!token);
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
  }

  async getRefreshToken(): Promise<string | null> {
    const t = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    console.log('[TokenService] getRefreshToken -> hasToken:', !!t);
    return t;
  }

  async removeRefreshToken(): Promise<void> {
    console.log('[TokenService] removeRefreshToken called');
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  }
}