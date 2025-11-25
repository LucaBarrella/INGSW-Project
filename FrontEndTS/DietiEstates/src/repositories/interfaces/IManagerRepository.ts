import { ChangePasswordDTO } from "@/src/dto/request/ChangePassword.dto";

export interface IManagerRepository {
    createAgent(agentData: any): Promise<{ success: boolean; message?: string; id?: string | number }>;
    createManager(managerData: any): Promise<{ success: boolean; message?: string; id?: string | number }>;
    changePassword(data: ChangePasswordDTO): Promise<{ success: boolean; message?: string }>;
}