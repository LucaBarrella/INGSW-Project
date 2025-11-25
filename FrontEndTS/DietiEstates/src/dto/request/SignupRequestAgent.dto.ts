import { SignupRequestDTO } from "./SignupRequest.dto";

export interface SignupRequestAgent extends SignupRequestDTO {
  phone?: string;
  licenseNumber?: string;
  confirmPassword: string;
}