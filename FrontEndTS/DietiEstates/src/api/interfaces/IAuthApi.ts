import { LoginRequestDTO } from "../../dto/request/LoginRequest.dto";
import { SignupRequestDTO } from "../../dto/request/SignupRequest.dto";
import { AuthResponseDTO } from "../../dto/response/AuthResponse.dto";

export interface IAuthApi {
  login(credentials: LoginRequestDTO): Promise<AuthResponseDTO>;
  register(userData: SignupRequestDTO): Promise<AuthResponseDTO>;
  logout(refreshToken: string): Promise<{ success: boolean; message?: string }>;
  loginWithGoogle(idToken: string): Promise<AuthResponseDTO>;
}