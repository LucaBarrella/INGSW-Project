import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/User';
import * as UserApiService from '../api/UserApiService';
import { mapUserDtoToDomain } from '../mappers/UserMapper';

export class UserRepository implements IUserRepository {
  private apiService: typeof UserApiService;

  constructor() {
    this.apiService = UserApiService;
  }

  async findById(id: string): Promise<User | null> {
    try {
      const userProfile = await this.apiService.getAgentProfile();
      if (userProfile && userProfile.id === id) {
        const userDTO = {
          id: userProfile.id.toString(),
          email: userProfile.email,
          firstName: userProfile.firstName,
          lastName: userProfile.lastName,
          role: userProfile.role,
          createdAt: userProfile.createdAt?.toString() || new Date().toISOString(),
          updatedAt: userProfile.updatedAt?.toString() || new Date().toISOString(),
        };
        return mapUserDtoToDomain(userDTO);
      }
      return null;
    } catch (error) {
      console.error(`Error finding user by id ${id}:`, error);
      return null;
    }
  }

  async findAll(): Promise<User[]> {
    try {
      const userProfile = await this.apiService.getAgentProfile();
      if (userProfile) {
        const userDTO = {
          id: userProfile.id.toString(),
          email: userProfile.email,
          firstName: userProfile.firstName,
          lastName: userProfile.lastName,
          role: userProfile.role,
          createdAt: userProfile.createdAt?.toString() || new Date().toISOString(),
          updatedAt: userProfile.updatedAt?.toString() || new Date().toISOString(),
        };
        return [mapUserDtoToDomain(userDTO)];
      }
      return [];
    } catch (error) {
      console.error('Error finding all users:', error);
      return [];
    }
  }

  async save(user: User): Promise<User> {
    try {
      const userData = {
        ...user,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      };
      
      if (user.role === 'admin') {
        const result = await this.apiService.createAdmin(userData);
        if (result.success && result.id) {
          return { ...user, id: result.id.toString() };
        }
      } else if (user.role === 'agent') {
        const result = await this.apiService.createAgent(userData);
        if (result.success && result.id) {
          return { ...user, id: result.id.toString() };
        }
      }
      
      throw new Error('Failed to save user');
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const userProfile = await this.apiService.getAgentProfile();
      if (userProfile && userProfile.id === id) {
        throw new Error('Cannot delete current user profile');
      }
    } catch (error) {
      console.error(`Error deleting user with id ${id}:`, error);
      throw error;
    }
  }
}