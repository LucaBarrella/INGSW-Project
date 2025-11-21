import { LoginRequestDTO } from "../../dto/request/LoginRequest.dto";
import { SignupRequestDTO } from "@/src/dto/request/SignupRequest.dto";
import { User } from "../../entity/User";

export interface IAuthService {
  login(credentials: LoginRequestDTO): Promise<{ user: User; token: string }>;
  register(userData: SignupRequestDTO): Promise<{ user: User; token: string }>;
  // Logout ora non richiede parametri: il service/repository recupera il refresh token dallo storage,
  // lo invalida sul backend se presente e rimuove i token localmente.
  logout(): Promise<void>;
  loginWithGoogle(idToken: string): Promise<{ user: User; token: string }>;
}