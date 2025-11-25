import { SignupRequestAgent } from "../dto/request/SignupRequestAgent.dto";
import { IManagerRepository } from "./interfaces/IManagerRepository";
import { ManagerApi } from "../api/ManagerApi";
import ApiError from "../core/errors/ApiError";

export class managerRepository implements IManagerRepository {
    private managerApi: ManagerApi;

    constructor() {
        this.managerApi = new ManagerApi();
    }

    handleError(error: any): { success: boolean; message?: string } {
        const err = error as ApiError | any;
        const details = err?.details ?? err?.response?.data;
        const message =
            typeof details === 'string'
                ? details
                : details?.message ?? err?.message ?? 'Failed to create agent';

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
}