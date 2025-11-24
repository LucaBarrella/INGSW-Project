import { IManagerRepository } from '@/src/repositories/interfaces/IManagerRepository';
import { IManagerService } from './interfaces/IManagerService';

export class ManagerService implements IManagerService {
    private managerRepository: IManagerRepository;
    constructor (managerRepository: IManagerRepository) {
        this.managerRepository = managerRepository;
    }

    async createAgent(agentData: any): Promise<{ success: boolean; message?: string; id?: string | number }> {
        return await this.managerRepository.createAgent(agentData);
    }
}