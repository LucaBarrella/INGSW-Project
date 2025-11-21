export interface PropertyDTO {
  id: string;
  title: string;
  description: string;
  address: string;
  price: number;
  agentId: string;
  status: 'active' | 'sold' | 'rented' | 'inactive';
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
}