export interface IManagerService {
    createAgent(agentData: any): Promise<{ success: boolean; message?: string; id?: string | number }>;
}