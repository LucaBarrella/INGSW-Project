import { LoginRequestDTO } from "../../dto/request/LoginRequest.dto";
import { SignupRequestDTO } from "../../dto/request/SignupRequest.dto";
import { AuthResponseDTO } from "../../dto/response/AuthResponse.dto";

export interface IAuthRepository {
  login(credentials: LoginRequestDTO): Promise<AuthResponseDTO>;
  register(userData: SignupRequestDTO): Promise<AuthResponseDTO>;
  // Il logout ora viene eseguito senza parametri: il repository legge il refresh token dallo storage,
  // lo invia al backend se presente e rimuove i token localmente.
  logout(): Promise<void>;
  loginWithGoogle(idToken: string): Promise<AuthResponseDTO>;
}