import { LoginRequestDTO } from "../dto/request/LoginRequest.dto";
import { SignupRequestDTO } from "../dto/request/SignupRequest.dto";
import { AuthResponseDTO } from "../dto/response/AuthResponse.dto";
import { IAuthRepository } from "./interfaces/IAuthRepository";
import { IAuthApi } from "../api/interfaces/IAuthApi";
import { ITokenService } from "../services/interfaces/ITokenService";
 
/**
 * AuthRepository ora è responsabile anche della persistenza locale dei token.
 * Il repository orchestra la chiamata all'API e la persistenza tramite ITokenService,
 * rispettando l'astrazione della source dei dati.
 */
export class AuthRepository implements IAuthRepository {
  constructor(private authApi: IAuthApi, private tokenService: ITokenService) {}
 
  async login(credentials: LoginRequestDTO): Promise<AuthResponseDTO> {
    const response = await this.authApi.login(credentials);
    // Persistenza token a livello di repository (fonte dati)
    if (response?.accessToken) {
      await this.tokenService.saveToken(response.accessToken);
    }
    if (response?.refreshToken) {
      await this.tokenService.saveRefreshToken(response.refreshToken);
    }
    return response;
  }
 
  async register(userData: SignupRequestDTO): Promise<AuthResponseDTO> {
    const response = await this.authApi.register(userData);
    if (response?.accessToken) {
      await this.tokenService.saveToken(response.accessToken);
    }
    if (response?.refreshToken) {
      await this.tokenService.saveRefreshToken(response.refreshToken);
    }
    return response;
  }
 
  async logout(): Promise<void> {
    try {
      const refreshToken = await this.tokenService.getRefreshToken();
      if (refreshToken) {
        try {
          await this.authApi.logout(refreshToken);
        } catch (err) {
          // Non blocchiamo il logout locale se la chiamata remota fallisce
          console.warn('[AuthRepository] Errore durante invalidazione refreshToken sul backend:', err);
        }
      }
    } finally {
      // Rimuoviamo i token locali indipendentemente dal risultato della chiamata remota
      await this.tokenService.removeToken();
      await this.tokenService.removeRefreshToken();
    }
  }
 
  async loginWithGoogle(idToken: string): Promise<AuthResponseDTO> {
    const response = await this.authApi.loginWithGoogle(idToken);
    if (response?.accessToken) {
      await this.tokenService.saveToken(response.accessToken);
    }
    if (response?.refreshToken) {
      await this.tokenService.saveRefreshToken(response.refreshToken);
    }
    return response;
  }
}