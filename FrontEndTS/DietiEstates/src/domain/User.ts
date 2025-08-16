export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'agent' | 'buyer';
  createdAt: Date;
  updatedAt: Date;
}