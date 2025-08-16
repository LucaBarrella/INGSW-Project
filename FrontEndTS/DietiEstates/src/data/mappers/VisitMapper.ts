import { VisitDTO } from '../dto/VisitDTO';
import { Visit } from '../../domain/Visit';

export function mapVisitDtoToDomain(dto: VisitDTO): Visit {
  return {
    id: dto.id,
    propertyId: dto.propertyId,
    buyerId: dto.buyerId,
    agentId: dto.agentId,
    scheduledDate: new Date(dto.scheduledDate),
    status: dto.status,
    notes: dto.notes,
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
  };
}