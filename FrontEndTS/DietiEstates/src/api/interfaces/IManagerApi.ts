export interface IManagerApi {
  createAgent(agentData: any): Promise<void>;
}