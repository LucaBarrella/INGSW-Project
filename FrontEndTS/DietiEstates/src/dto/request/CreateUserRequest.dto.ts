export interface CreateUserRequest {
  email: string;
  username: string;
  name: string;
  surname: string;
  phone?: string;
  licenseNumber?: string;
}