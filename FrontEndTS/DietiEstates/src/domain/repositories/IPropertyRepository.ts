import { Property } from '../Property';

export interface IPropertyRepository {
  findById(id: string): Promise<Property | null>;
  findAll(): Promise<Property[]>;
  save(property: Property): Promise<Property>;
  delete(id: string): Promise<void>;
}