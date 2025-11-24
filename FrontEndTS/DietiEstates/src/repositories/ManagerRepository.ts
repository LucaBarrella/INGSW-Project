import { SignupRequestAgent } from "../dto/request/SignupRequestAgent.dto";
import { IManagerRepository } from "./interfaces/IManagerRepository";
import { ManagerApi } from "../api/ManagerApi";

export class managerRepository implements IManagerRepository {
    private managerApi: ManagerApi;

    constructor() {
        this.managerApi = new ManagerApi();
    }

    async createAgent(agentData: SignupRequestAgent): Promise<{ success: boolean; message?: string; id?: string | number }> {
        try {
            await this.managerApi.createAgent(agentData);
            return { success: true, message: "Agent created successfully" };
        } catch (error: any) {
            return { success: false, message: error.message || "Failed to create agent" };
        }
    }
}