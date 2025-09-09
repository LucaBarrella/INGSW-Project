export interface Property {
  id: string;
  title: string;
  description: string;
  address: string;
  price: number;
  agentId: string;
  status: 'active' | 'sold' | 'rented' | 'inactive';
  latitude: number;
  longitude: number;
  createdAt: Date;
  updatedAt: Date;
}