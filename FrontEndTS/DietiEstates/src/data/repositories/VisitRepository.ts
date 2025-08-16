import { IVisitRepository } from '../../domain/repositories/IVisitRepository';
import { Visit } from '../../domain/Visit';
import * as VisitApiService from '../api/VisitApiService';
import { mapVisitDtoToDomain } from '../mappers/VisitMapper';

export class VisitRepository implements IVisitRepository {
  private apiService: typeof VisitApiService;

  constructor() {
    this.apiService = VisitApiService;
  }

  async findById(id: string): Promise<Visit | null> {
    try {
      const visits = await this.apiService.getVisitsByAgent();
      const visit = visits.find(v => v.id === id);
      if (visit) {
        const visitDTO = {
          id: visit.id.toString(),
          propertyId: visit.propertyId.toString(),
          buyerId: visit.buyerId.toString(),
          agentId: visit.agentId.toString(),
          scheduledDate: visit.scheduledDate?.toString() || new Date().toISOString(),
          status: visit.status,
          notes: visit.notes || '',
          createdAt: visit.createdAt?.toString() || new Date().toISOString(),
          updatedAt: visit.updatedAt?.toString() || new Date().toISOString(),
        };
        return mapVisitDtoToDomain(visitDTO);
      }
      return null;
    } catch (error) {
      console.error(`Error finding visit by id ${id}:`, error);
      return null;
    }
  }

  async findAll(): Promise<Visit[]> {
    try {
      const visits = await this.apiService.getVisitsByAgent();
      return visits.map(visit => {
        const visitDTO = {
          id: visit.id.toString(),
          propertyId: visit.propertyId.toString(),
          buyerId: visit.buyerId.toString(),
          agentId: visit.agentId.toString(),
          scheduledDate: visit.scheduledDate?.toString() || new Date().toISOString(),
          status: visit.status,
          notes: visit.notes || '',
          createdAt: visit.createdAt?.toString() || new Date().toISOString(),
          updatedAt: visit.updatedAt?.toString() || new Date().toISOString(),
        };
        return mapVisitDtoToDomain(visitDTO);
      });
    } catch (error) {
      console.error('Error finding all visits:', error);
      return [];
    }
  }

  async save(visit: Visit): Promise<Visit> {
    try {
      const visitData = {
        ...visit,
        propertyId: visit.propertyId,
        buyerId: visit.buyerId,
        agentId: visit.agentId,
        scheduledDate: visit.scheduledDate.toISOString(),
        status: visit.status,
        notes: visit.notes,
        createdAt: visit.createdAt.toISOString(),
        updatedAt: visit.updatedAt.toISOString(),
      };
      const result = await this.apiService.scheduleVisit(visitData);
      if (result.success && result.id) {
        return { ...visit, id: result.id.toString() };
      }
      throw new Error('Failed to save visit');
    } catch (error) {
      console.error('Error saving visit:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const result = await this.apiService.cancelVisit(id);
      if (!result.success) {
        throw new Error('Failed to delete visit');
      }
    } catch (error) {
      console.error(`Error deleting visit with id ${id}:`, error);
      throw error;
    }
  }
}