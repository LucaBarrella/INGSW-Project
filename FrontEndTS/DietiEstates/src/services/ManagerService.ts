import { IManagerRepository } from '@/src/repositories/interfaces/IManagerRepository';
import { IManagerService } from './interfaces/IManagerService';
import { ChangePasswordDTO } from '../dto/request/ChangePassword.dto';

export class ManagerService implements IManagerService {
    private managerRepository: IManagerRepository;
    constructor (managerRepository: IManagerRepository) {
        this.managerRepository = managerRepository;
    }

    async createAgent(agentData: any): Promise<{ success: boolean; message?: string; id?: string | number }> {
        return await this.managerRepository.createAgent(agentData);
    }

    async createManager(managerData: any): Promise<{ success: boolean; message?: string; id?: string | number }> {
        return await this.managerRepository.createManager(managerData);
    }

    async changePassword(data: ChangePasswordDTO): Promise<{ success: boolean; message?: string }> {
        return await this.managerRepository.changePassword(data);
    }
}