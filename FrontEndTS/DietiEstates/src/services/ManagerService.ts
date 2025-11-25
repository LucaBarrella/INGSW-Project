import { IManagerRepository } from '@/src/repositories/interfaces/IManagerRepository';
import { IManagerService } from './interfaces/IManagerService';
import { ChangePasswordDTOWithConfirm } from '../dto/request/ChangePasswordWithConfirm.dto';
import { t } from 'i18next';

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

    async changePassword(data: ChangePasswordDTOWithConfirm): Promise<{ success: boolean; message?: string }> {
        if (data.newPassword !== data.confirmNewPassword) {
            return { success: false, message:t('forms.errors.passwordsDontMatch') };
        }
        return await this.managerRepository.changePassword(data);
    }
}