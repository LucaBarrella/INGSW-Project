import axios, {AxiosInstance} from "axios";
import { LoginRequestDTO } from "../dto/request/LoginRequest.dto";
import { SignupRequestDTO } from "../dto/request/SignupRequest.dto";
import { AuthResponseDTO } from "../dto/response/AuthResponse.dto";
import { IAuthApi } from "./interfaces/IAuthApi";
import ApiError from "../core/errors/ApiError";
const REFRESH_ENDPOINT = "/auth/refresh";
import httpClient from "../core/httpClient";

const AUTH_ENDPOINTS = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/signup",
  LOGOUT: "/auth/logout",
  GOOGLE: "/auth/google",
  REFRESH: REFRESH_ENDPOINT,
} as const;


export class AuthApi implements IAuthApi {
  private readonly client: AxiosInstance = httpClient;

  private normalizeAndThrow(err: unknown): never {
    // Se l'errore è già un ApiError (es. dall'interceptor httpClient), rilanciarlo così com'è
    if (err instanceof ApiError) {
      throw err;
    }

    if (axios.isAxiosError(err)) {
      const status = err.response?.status ?? 0;
      const message = err.message;
      // Manteniamo qui solo il wrapper tecnico: ApiError contiene statusCode + message
      throw new ApiError(status, message);
    }

    // Fallback generico
    throw new ApiError(0, String(err));
  }

  async login(credentials: LoginRequestDTO): Promise<AuthResponseDTO> {
    try {
      const res = await this.client.post<AuthResponseDTO>(AUTH_ENDPOINTS.LOGIN, credentials);
      return res.data;
    } catch (err) {
      this.normalizeAndThrow(err);
    }
  }

  async register(userData: SignupRequestDTO): Promise<AuthResponseDTO> {
    try {
      const res = await this.client.post<AuthResponseDTO>(AUTH_ENDPOINTS.REGISTER, userData);
      return res.data;
    } catch (err) {
      this.normalizeAndThrow(err);
    }
  }

  async logout(refreshToken: string): Promise<{ success: boolean; message?: string }> {
    try {
      const res = await this.client.post<{ success: boolean; message?: string }>(
        AUTH_ENDPOINTS.LOGOUT,
        { refreshToken }
      );
      return res.data;
    } catch (err) {
      this.normalizeAndThrow(err);
    }
  }

  async loginWithGoogle(idToken: string): Promise<AuthResponseDTO> {
    try {
      const res = await this.client.post<AuthResponseDTO>(AUTH_ENDPOINTS.GOOGLE, { idToken });
      return res.data;
    } catch (err) {
      this.normalizeAndThrow(err);
    }
  }
}