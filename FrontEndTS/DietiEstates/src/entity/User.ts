export interface User {
  firstName: string;
  lastName:string;
  username: string;
  email: string;
  roles?: string[]; // Aggiunto il campo ruoli
}