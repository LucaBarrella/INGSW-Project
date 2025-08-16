export interface Property {
  id: string;
  title: string;
  description: string;
  address: string;
  price: number;
  agentId: string;
  status: 'active' | 'sold' | 'rented' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}