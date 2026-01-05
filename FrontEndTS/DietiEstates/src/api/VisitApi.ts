import { VisitDTO } from '../dto/VisitDTO';
import httpClient from '../core/httpClient';
import { PagedVisitsDTO } from '../dto/response/PagedVisitsDTO';
import { AvailabilityDTO } from '../dto/response/AvailabilityDTO';
// Definisce i path relativi degli endpoint API per la gestione delle visite
// NOTA: Gli endpoint per le visite non erano presenti nel file api.service.ts originale.
// Vengono aggiunti qui come esempio. Sarà necessario definirli correttamente con il backend.
const visitEndpoints = {
  getVisitsByProperty: '/properties/{propertyId}/visits',
  getVisitsByAgent: '/visits/agent/me',
  getVisitsByBuyer: '/visits/me/',
  getVisitById: '/visits/{visitId}',
  updateVisit: '/visits/{visitId}',
  cancelVisit: '/visits/{visitId}/cancel',
  confirmVisit: '/visits/{visitId}/confirm',
  updateVisitStatus: '/visits/{visitId}/status',
  createVisit: '/visits',
} as const;

/**
 * Recupera tutte le visite per un immobile specifico.
 * @param propertyId - L'ID dell'immobile.
 * @returns La risposta dell'API con la lista delle visite.
 */
export const getVisitsByProperty = async (propertyId: string | number): Promise<any[]> => {
  console.log('[VisitApiService] getVisitsByProperty:', propertyId);
  const url = visitEndpoints.getVisitsByProperty.replace('{propertyId}', propertyId.toString());
  const response = await httpClient.get(url);
  return response.data;
};

/**
 * Recupera tutte le visite pianificate da un agente.
 * @param agentId - L'ID dell'agente (opzionale, se non fornito usa l'agente loggato).
 * @returns La risposta dell'API con la lista delle visite.
 */
export const getVisitsOfCurrentAgent = async (): Promise<PagedVisitsDTO> => {
  console.log('[VisitApiService] getVisitsOfCurrentAgent:');
  const url = visitEndpoints.getVisitsByAgent;
  const response = await httpClient.get(url);
  console.log('[VisitApiService] getVisitsOfCurrentAgent response:', response.data);
  // multiply by 1000 to convert from seconds to milliseconds
  response.data.content = response.data.content.map((visit: any) => {
    visit.visit.startTime *= 1000;
    visit.visit.endTime *= 1000;
    return visit;
  });
  return response.data;
};

/**
 * Recupera tutte le visite pianificate da un acquirente.
 * @param buyerId - L'ID dell'acquirente (opzionale, se non fornito usa l'acquirente loggato).
 * @returns La risposta dell'API con la lista delle visite.
 */
export const getVisitsByBuyer = async (): Promise<PagedVisitsDTO> => {
  const url = visitEndpoints.getVisitsByBuyer;
  const response = await httpClient.get(url);
  response.data.content = response.data.content.map((visit: any) => {
    visit.startTime *= 1000;
    visit.endTime *= 1000;
    visit.visit = visit;
    return visit;
  });
  return response.data;
};

export const getVisitById = async (visitId: string | number): Promise<any> => {
  console.log('[VisitApiService] getVisitById:', visitId);
  const url = visitEndpoints.getVisitById.replace('{visitId}', visitId.toString());
  const response = await httpClient.get(url);
  return response.data;
};

/**
 * Aggiorna i dettagli di una visita esistente.
 * @param visitId - L'ID della visita da aggiornare.
 * @param visitData - Dati aggiornati della visita.
 * @returns La risposta dell'API.
 */
export const updateVisit = async (visitId: string | number, visitData: Partial<VisitDTO>): Promise<{ success: boolean; message?: string }> => {
  console.log('[VisitApiService] updateVisit:', visitId, visitData);
  const url = visitEndpoints.updateVisit.replace('{visitId}', visitId.toString());
  const response = await httpClient.put(url, visitData);
  return response.data;
};

export const updateVisitStatus = async (visitId: string | number, status: "CONFIRMED" | "REJECTED" | "CANCELLED" | "PENDING"): Promise<{ success: boolean; message?: string }> => {
  const url = visitEndpoints.updateVisitStatus.replace('{visitId}', visitId.toString());
  const response = await httpClient.put(url, { status });
  return response.data;
};

export const createVisit = async (propertyId: number, agentId: number, startTime: string, endTime: string): Promise<{ success: boolean; message?: string }> => {
  const url = visitEndpoints.createVisit;
  const response = await httpClient.post(url, { propertyId, agentId, startTime, endTime });
  return response.data;
};

export const getAvailableSlots = async (agentId: number | string): Promise<AvailabilityDTO[]> => {
  const response = await httpClient.get<AvailabilityDTO[]>(`/agents/${agentId}/availabilities`);
  return response.data;
}

/**
 * Annulla una visita pianificata.
 * @param visitId - L'ID della visita da annullare.
 * @returns La risposta dell'API.
 */
export const cancelVisit = async (visitId: string | number): Promise<{ success: boolean; message?: string }> => {
  console.log('[VisitApiService] cancelVisit:', visitId);
  const url = visitEndpoints.cancelVisit.replace('{visitId}', visitId.toString());
  const response = await httpClient.post(url);
  return response.data;
};

/**
 * Conferma una visita pianificata.
 * @param visitId - L'ID della visita da confermare.
 * @returns La risposta dell'API.
 */
export const confirmVisit = async (visitId: string | number): Promise<{ success: boolean; message?: string }> => {
  console.log('[VisitApiService] confirmVisit:', visitId);
  const url = visitEndpoints.confirmVisit.replace('{visitId}', visitId.toString());
  const response = await httpClient.post(url);
  return response.data;
};

export default {
  getVisitsByProperty,
  getVisitsOfCurrentAgent,
  getVisitsByBuyer,
  getVisitById,
  updateVisit,
  updateVisitStatus,
  cancelVisit,
  confirmVisit,
  createVisit,
  getAvailableSlots
};