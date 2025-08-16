export interface UserDTO {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'agent' | 'buyer';
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
}