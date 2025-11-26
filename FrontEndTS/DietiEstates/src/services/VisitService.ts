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

  async getVisitsOfCurrentAgent(): Promise<{pending: VisitRequest[], others: VisitRequest[]}> {
    let visits : VisitDTO[] = (await this.visitRepository.getVisitsOfCurrentAgent()).content;
    let visitRequests: VisitRequest[] = [];
    
    // guarda starttime e endtime, se incastrano fai confronto address, se sono uguali group opportunity, se sono diversi conflict
    for (let visit of visits) {
      let newVisit : VisitRequest = {
        id: visit.visit.id,
        property: {
          id: "unset TODO",
          address: `${visit.address.country}, ${visit.address.city} (${visit.address.province}), ${visit.address.street} ${visit.address.streetNumber}`,
          addressId: visit.address.id
        },
        userInfo: visit.userInfo,
        startTime: new Date(visit.visit.startTime),
        endTime: new Date(visit.visit.endTime),
        status: visit.visit.status,
        potentialClients: [],
        isGroupOpportunity: false
      };
      
      for (let existingVisit of visitRequests) {
        if ( newVisit.startTime < existingVisit.endTime && newVisit.endTime > existingVisit.startTime) {
          if (visit.address.id !== existingVisit.property.addressId) {
            existingVisit.conflict = {conflictingAppointmentId: visit.visit.id, reason:"reason TODO"};
            newVisit.conflict = {conflictingAppointmentId: existingVisit.id, reason:"reason TODO"};
            visitRequests.push(newVisit);
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
    
    return {pending: visitRequests.filter(v => v.status === "PENDING"), others: visitRequests.filter(v => v.status !== "PENDING" && v.status !== "CANCELLED")};

  }

  async updateVisitStatus(visitId: string | number, status: "CONFIRMED" | "REJECTED" | "CANCELLED" | "PENDING"): Promise<{ success: boolean; message?: string }> {
    return this.visitRepository.updateVisitStatus(visitId, status);
  }
}