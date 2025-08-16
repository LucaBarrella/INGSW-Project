import { PropertyDTO } from '../dto/PropertyDTO';
import { Property } from '../../domain/Property';

export function mapPropertyDtoToDomain(dto: PropertyDTO): Property {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description,
    address: dto.address,
    price: dto.price,
    agentId: dto.agentId,
    status: dto.status,
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
  };
}