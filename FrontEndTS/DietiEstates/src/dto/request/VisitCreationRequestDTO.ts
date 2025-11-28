export interface VisitCreationRequestDTO {
  propertyId: number;
  agentId: number;
  startTime: number; // Unix timestamp in seconds
  endTime: number; // Unix timestamp in seconds
}