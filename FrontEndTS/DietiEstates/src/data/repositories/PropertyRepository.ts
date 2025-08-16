import { IPropertyRepository } from '../../domain/repositories/IPropertyRepository';
import { Property } from '../../domain/Property';
import * as PropertyApiService from '../api/PropertyApiService';
import { mapPropertyDtoToDomain } from '../mappers/PropertyMapper';
import { PropertyDetail } from '../../../components/Agent/PropertyDashboard/types';

export class PropertyRepository implements IPropertyRepository {
  private apiService: typeof PropertyApiService;

  constructor() {
    this.apiService = PropertyApiService;
  }

  async findById(id: string): Promise<Property | null> {
    try {
      const propertyDetail: PropertyDetail = await this.apiService.getPropertyDetails(id);
      const propertyDTO = {
        id: propertyDetail.id.toString(),
        title: propertyDetail.title || '',
        description: propertyDetail.description || '',
        address: propertyDetail.address?.city || '',
        price: propertyDetail.price || 0,
        agentId: propertyDetail.agent?.id?.toString() || '',
        status: (propertyDetail.status as 'active' | 'sold' | 'rented' | 'inactive') || 'inactive',
        createdAt: propertyDetail.createdAt?.toString() || new Date().toISOString(),
        updatedAt: propertyDetail.updatedAt?.toString() || new Date().toISOString(),
      };
      return mapPropertyDtoToDomain(propertyDTO);
    } catch (error) {
      console.error(`Error finding property by id ${id}:`, error);
      return null;
    }
  }

  async findAll(): Promise<Property[]> {
    try {
      const propertiesDetail: PropertyDetail[] = await this.apiService.getAgentProperties();
      return propertiesDetail.map(propertyDetail => {
        const propertyDTO = {
          id: propertyDetail.id.toString(),
          title: propertyDetail.title || '',
          description: propertyDetail.description || '',
          address: propertyDetail.address?.city || '',
          price: propertyDetail.price || 0,
          agentId: propertyDetail.agent?.id?.toString() || '',
          status: (propertyDetail.status as 'active' | 'sold' | 'rented' | 'inactive') || 'inactive',
          createdAt: propertyDetail.createdAt?.toString() || new Date().toISOString(),
          updatedAt: propertyDetail.updatedAt?.toString() || new Date().toISOString(),
        };
        return mapPropertyDtoToDomain(propertyDTO);
      });
    } catch (error) {
      console.error('Error finding all properties:', error);
      return [];
    }
  }

  async save(property: Property): Promise<Property> {
    try {
      const propertyData = {
        ...property,
        createdAt: property.createdAt.toISOString(),
        updatedAt: property.updatedAt.toISOString(),
      };
      const result = await this.apiService.createProperty(propertyData);
      if (result.success && result.id) {
        return { ...property, id: result.id.toString() };
      }
      throw new Error('Failed to save property');
    } catch (error) {
      console.error('Error saving property:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const propertyDetail: PropertyDetail = await this.apiService.getPropertyDetails(id);
      if (propertyDetail) {
        await this.apiService.createProperty({ ...propertyDetail, status: 'deleted' });
      }
    } catch (error) {
      console.error(`Error deleting property with id ${id}:`, error);
      throw error;
    }
  }
}