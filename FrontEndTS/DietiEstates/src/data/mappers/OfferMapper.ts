import { OfferDTO } from '../dto/OfferDTO';
import { Offer } from '../../domain/Offer';

export function mapOfferDtoToDomain(dto: OfferDTO): Offer {
  return {
    id: dto.id,
    propertyId: dto.propertyId,
    buyerId: dto.buyerId,
    amount: dto.amount,
    status: dto.status,
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
  };
}