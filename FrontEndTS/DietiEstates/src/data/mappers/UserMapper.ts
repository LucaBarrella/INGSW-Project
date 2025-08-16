import { UserDTO } from '../dto/UserDTO';
import { User } from '../../domain/User';

export function mapUserDtoToDomain(dto: UserDTO): User {
  return {
    id: dto.id,
    email: dto.email,
    firstName: dto.firstName,
    lastName: dto.lastName,
    role: dto.role,
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
  };
}