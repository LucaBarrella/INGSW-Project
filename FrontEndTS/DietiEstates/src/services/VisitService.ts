import { IVisitService } from './interfaces/IVisitService';
import { IVisitRepository } from '../repositories/interfaces/IVisitRepository';
import { PagedVisitsDTO } from '../dto/response/PagedVisitsDTO';
import { VisitDTO } from '@/src/dto/VisitDTO';
import { VisitRequest } from '../dto/agenda';

export class VisitService implements IVisitService {
  private visitRepository: IVisitRepository;

  constructor(visitRepository: IVisitRepository) {
    this.visitRepository = visitRepository;
  }

  async getVisitsByBuyer(): Promise<PagedVisitsDTO> {
    return this.visitRepository.getVisitsByBuyer();
  }

  async getVisitsOfCurrentAgent(date: Date): Promise<{pending: VisitRequest[], confirmed: VisitRequest[]}> {
    const response = await this.visitRepository.getVisitsOfCurrentAgent();

    let visits : VisitDTO[] = response.content.filter(v => {
      const visitDate = new Date(v.startTime);
      return visitDate.getFullYear() === date.getFullYear() &&
             visitDate.getMonth() === date.getMonth() &&
             visitDate.getDate() === date.getDate();
    });
    let visitRequests: VisitRequest[] = [];
    
    // guarda starttime e endtime, se incastrano fai confronto address, se sono uguali group opportunity, se sono diversi conflict
    for (let visit of visits) {
      let newVisit : VisitRequest = {
        id: visit.id,
        property: {
          id: "unset",
          address: `${visit.address.country}, ${visit.address.city} (${visit.address.province}), ${visit.address.street} ${visit.address.streetNumber}`,
          addressId: visit.address.id
        },
        userInfo: visit.userInfo,
        startTime: new Date(visit.startTime),
        endTime: new Date(visit.endTime),
        status: visit.status,
        potentialClients: [],
        isGroupOpportunity: false
      };
      
      for (let existingVisit of visitRequests) {
        if ( newVisit.startTime < existingVisit.endTime && newVisit.endTime > existingVisit.startTime) {
          if (visit.visit.status === "CONFIRMED" && existingVisit.status === "CONFIRMED" && visit.address.id !== existingVisit.property.addressId) {
            newVisit.isGroupOpportunity = false;
            existingVisit.isGroupOpportunity = false;
            newVisit.potentialClients = [];
            existingVisit.potentialClients = [];
            existingVisit.conflict = {conflictingAppointmentId: visit.visit.id};
            newVisit.conflict = {conflictingAppointmentId: existingVisit.id};
            break;
          }
          else {
            existingVisit.isGroupOpportunity = true;
            existingVisit.potentialClients.push(newVisit.userInfo);
            newVisit.isGroupOpportunity = true;
            newVisit.potentialClients.push(existingVisit.userInfo);
          }
        }
      }
      visitRequests.push(newVisit);
    }
    
    return {pending: visitRequests.filter(v => v.status === "PENDING"), confirmed: visitRequests.filter(v => v.status === "CONFIRMED")};

  }

  async updateVisitStatus(visitId: string | number, status: "CONFIRMED" | "REJECTED" | "CANCELLED" | "PENDING"): Promise<{ success: boolean; message?: string }> {
    return this.visitRepository.updateVisitStatus(visitId, status);
  }

  async createVisit(propertyId: number, agentId: number, startTime: string, endTime: string): Promise<{ success: boolean; message?: string }> {
    return this.visitRepository.createVisit(propertyId, agentId, startTime, endTime);
  }
}