import { SignupRequestAgent } from "../dto/request/SignupRequestAgent.dto";
import { IManagerRepository } from "./interfaces/IManagerRepository";
import { ManagerApi } from "../api/ManagerApi";
import ApiError from "../core/errors/ApiError";
import { t } from "i18next";
import { ChangePasswordDTO } from "../dto/request/ChangePassword.dto";

export class ManagerRepository implements IManagerRepository {
    private managerApi: ManagerApi;

    constructor() {
        this.managerApi = new ManagerApi();
    }

    handleError(error: any): { success: boolean; message?: string } {
        const err = error as ApiError | any;
        const fields : string[] =  err.details.fields;
        let message = "";
        for (const field of fields) {
            message += `${t(`forms.errors.invalid.${field}`)}\n`;
        }
        if (!message) {
            message = err.response?.data?.message || t('forms.errors.generic');
        }
        
        return { success: false, message };
    }

    async createAgent(agentData: SignupRequestAgent): Promise<{ success: boolean; message?: string; id?: string | number }> {
        try {
            await this.managerApi.createAgent(agentData);
            return { success: true, message: "Agent created successfully" };
        } catch (error: any) {
            return this.handleError(error);
        }
    }

    async createManager(managerData: any): Promise<{ success: boolean; message?: string; id?: string | number }> {
        try {
            await this.managerApi.createManager(managerData);
            return { success: true, message: "Manager created successfully" };
        } catch (error: any) {
            return this.handleError(error);
        }
    }

    async changePassword(data: ChangePasswordDTO): Promise<{ success: boolean; message?: string }> {
        try {
            await this.managerApi.changePassword(data);
            return { success: true, message: "Password changed successfully" };
        } catch (error: any) {
            return this.handleError(error);
        }
    }
}