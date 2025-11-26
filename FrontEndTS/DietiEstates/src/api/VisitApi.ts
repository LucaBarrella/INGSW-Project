import { VisitDTO } from '../dto/VisitDTO';
import httpClient from '../core/httpClient';
import { PagedVisitsDTO } from '../dto/response/PagedVisitsDTO';
// Definisce i path relativi degli endpoint API per la gestione delle visite
// NOTA: Gli endpoint per le visite non erano presenti nel file api.service.ts originale.
// Vengono aggiunti qui come esempio. Sarà necessario definirli correttamente con il backend.
const visitEndpoints = {
  // Esempi di endpoint per le visite, da adattare
  scheduleVisit: '/visits/schedule',
  getVisitsByProperty: '/properties/{propertyId}/visits',
  getVisitsByAgent: '/visits/agent/me',
  getVisitsByBuyer: '/visits/me/',
  getVisitById: '/visits/{visitId}',
  updateVisit: '/visits/{visitId}',
  cancelVisit: '/visits/{visitId}/cancel',
  confirmVisit: '/visits/{visitId}/confirm',
  updateVisitStatus: '/visits/{visitId}/status',
} as const;

/**
 * Pianifica una nuova visita per un immobile.
 * @param visitData - Dati della visita da pianificare.
 * @returns La risposta dell'API (es. successo e ID della nuova visita).
 */
export const scheduleVisit = async (visitData: Partial<VisitDTO>): Promise<{ success: boolean; message?: string; id?: string | number }> => {
  console.log('[VisitApiService] scheduleVisit:', visitData);
  const response = await httpClient.post(visitEndpoints.scheduleVisit, visitData);
  return response.data;
};

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
  scheduleVisit,
  getVisitsByProperty,
  getVisitsOfCurrentAgent,
  getVisitsByBuyer,
  getVisitById,
  updateVisit,
  updateVisitStatus,
  cancelVisit,
  confirmVisit,
};