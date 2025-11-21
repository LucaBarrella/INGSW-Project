import { LoginRequestDTO } from "../dto/request/LoginRequest.dto";
import { SignupRequestDTO } from "../dto/request/SignupRequest.dto";
import { IAuthService } from "./interfaces/IAuthService";
import { IAuthRepository } from "../repositories/interfaces/IAuthRepository";
import { User } from "../entity/User";
import { AuthResponseDTO } from "../dto/response/AuthResponse.dto";

export class AuthService implements IAuthService {
  constructor(private authRepository: IAuthRepository) {}

  private mapToUser(
    apiResponse: AuthResponseDTO,
    email?: string
  ): User {
    // Il backend non restituisce esplicitamente 'success', ma un token indica successo.
    // In caso di errore, l'interceptor di httpClient dovrebbe già lanciare un ApiError.
    return {
      email: email || "",
      firstName: "", // Manca nel DTO, da popolare se disponibile
      lastName: "",  // Manca nel DTO, da popolare se disponibile
      username: "",  // Manca nel DTO, da popolare se disponibile
      roles: apiResponse.availableRoles ?? []
    };
  }

  async login(
    credentials: LoginRequestDTO
  ): Promise<{ user: User; token: string }> {
    try {
      const response = await this.authRepository.login(credentials);
      const user = this.mapToUser(response, credentials.email);
      if (!response.accessToken) {
        throw new Error("Login failed: token not provided in response.");
      }
      return { user, token: response.accessToken };
    } catch (err) {
      throw err;
    }
  }

  async register(
    userData: SignupRequestDTO
  ): Promise<{ user: User; token: string }> {
    try {
      const response = await this.authRepository.register(userData);
      const user = this.mapToUser(response, userData.email);
      if (!response.accessToken) { // Usa accessToken come indicato dall'output curl
        throw new Error("Registration failed: token not provided in response.");
      }
      return { user, token: response.accessToken }; // Usa accessToken
    } catch (err) {
      throw err;
    }
  }

  async logout(): Promise<void> {
    // Il servizio delega al repository la gestione completa del logout:
    // il repository recupera il refresh token dallo storage, lo invalida sul backend
    // se presente e rimuove i token localmente.
    await this.authRepository.logout();
  }

  async loginWithGoogle(
    idToken: string
  ): Promise<{ user: User; token: string }> {
    try {
      const response = await this.authRepository.loginWithGoogle(idToken);
      const user = this.mapToUser(response);
      if (!response.accessToken) { // Usa accessToken come indicato dall'output curl
        throw new Error(
          "Google login failed: token not provided in response."
        );
      }
      return { user, token: response.accessToken }; // Usa accessToken
    } catch (err) {
      throw err;
    }
  }
}