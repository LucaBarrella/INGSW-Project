import httpClient from '../../../app/_services/httpClient';
import { mockDelay, MOCK_SUCCESS_RESPONSE } from '../../../app/_services/__mocks__/mockData';

// Definisce i path relativi degli endpoint API per la gestione delle visite
// NOTA: Gli endpoint per le visite non erano presenti nel file api.service.ts originale.
// Vengono aggiunti qui come esempio. Sarà necessario definirli correttamente con il backend.
const visitEndpoints = {
  // Esempi di endpoint per le visite, da adattare
  scheduleVisit: '/visits/schedule',
  getVisitsByProperty: '/properties/{propertyId}/visits',
  getVisitsByAgent: '/agent/visits',
  getVisitsByBuyer: '/buyer/visits',
  updateVisit: '/visits/{visitId}',
  cancelVisit: '/visits/{visitId}/cancel',
  confirmVisit: '/visits/{visitId}/confirm',
} as const;

/**
 * Pianifica una nuova visita per un immobile.
 * @param visitData - Dati della visita da pianificare.
 * @returns La risposta dell'API (es. successo e ID della nuova visita).
 */
export const scheduleVisit = async (visitData: any): Promise<{ success: boolean; message?: string; id?: string | number }> => {
  console.log('[VisitApiService] scheduleVisit:', visitData);
  if (process.env.NODE_ENV === 'test' || (httpClient as any).USE_MOCK_API_HTTP) {
    return mockDelay({ ...MOCK_SUCCESS_RESPONSE, id: `visit-mock-${Date.now()}` });
  }
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
  if (process.env.NODE_ENV === 'test' || (httpClient as any).USE_MOCK_API_HTTP) {
    // Mock data per le visite
    return mockDelay([
      { id: `visit-prop-${propertyId}-1`, propertyId, buyerId: 'buyer1', agentId: 'agent1', scheduledAt: '2023-10-28T14:00:00Z', status: 'scheduled' },
      { id: `visit-prop-${propertyId}-2`, propertyId, buyerId: 'buyer2', agentId: 'agent1', scheduledAt: '2023-10-29T10:30:00Z', status: 'confirmed' },
    ]);
  }
  const url = visitEndpoints.getVisitsByProperty.replace('{propertyId}', propertyId.toString());
  const response = await httpClient.get(url);
  return response.data;
};

/**
 * Recupera tutte le visite pianificate da un agente.
 * @param agentId - L'ID dell'agente (opzionale, se non fornito usa l'agente loggato).
 * @returns La risposta dell'API con la lista delle visite.
 */
export const getVisitsByAgent = async (agentId?: string): Promise<any[]> => {
  console.log('[VisitApiService] getVisitsByAgent:', agentId);
  if (process.env.NODE_ENV === 'test' || (httpClient as any).USE_MOCK_API_HTTP) {
    return mockDelay([
      { id: 'visit-agent-1', propertyId: 'prop1', buyerId: 'buyer1', agentId: agentId || 'current-agent', scheduledAt: '2023-10-28T14:00:00Z', status: 'scheduled' },
      { id: 'visit-agent-2', propertyId: 'prop2', buyerId: 'buyer3', agentId: agentId || 'current-agent', scheduledAt: '2023-10-29T10:30:00Z', status: 'confirmed' },
    ]);
  }
  const url = agentId ? `${visitEndpoints.getVisitsByAgent}?agentId=${agentId}` : visitEndpoints.getVisitsByAgent;
  const response = await httpClient.get(url);
  return response.data;
};

/**
 * Recupera tutte le visite pianificate da un acquirente.
 * @param buyerId - L'ID dell'acquirente (opzionale, se non fornito usa l'acquirente loggato).
 * @returns La risposta dell'API con la lista delle visite.
 */
export const getVisitsByBuyer = async (buyerId?: string): Promise<any[]> => {
  console.log('[VisitApiService] getVisitsByBuyer:', buyerId);
  if (process.env.NODE_ENV === 'test' || (httpClient as any).USE_MOCK_API_HTTP) {
    return mockDelay([
      { id: 'visit-buyer-1', propertyId: 'prop1', buyerId: buyerId || 'current-buyer', agentId: 'agent1', scheduledAt: '2023-10-28T14:00:00Z', status: 'scheduled' },
      { id: 'visit-buyer-2', propertyId: 'prop3', buyerId: buyerId || 'current-buyer', agentId: 'agent2', scheduledAt: '2023-10-30T16:00:00Z', status: 'completed' },
    ]);
  }
  const url = buyerId ? `${visitEndpoints.getVisitsByBuyer}?buyerId=${buyerId}` : visitEndpoints.getVisitsByBuyer;
  const response = await httpClient.get(url);
  return response.data;
};

/**
 * Aggiorna i dettagli di una visita esistente.
 * @param visitId - L'ID della visita da aggiornare.
 * @param visitData - Dati aggiornati della visita.
 * @returns La risposta dell'API.
 */
export const updateVisit = async (visitId: string | number, visitData: any): Promise<{ success: boolean; message?: string }> => {
  console.log('[VisitApiService] updateVisit:', visitId, visitData);
  if (process.env.NODE_ENV === 'test' || (httpClient as any).USE_MOCK_API_HTTP) {
    return mockDelay({ success: true, message: 'Visit updated successfully' });
  }
  const url = visitEndpoints.updateVisit.replace('{visitId}', visitId.toString());
  const response = await httpClient.put(url, visitData);
  return response.data;
};

/**
 * Annulla una visita pianificata.
 * @param visitId - L'ID della visita da annullare.
 * @returns La risposta dell'API.
 */
export const cancelVisit = async (visitId: string | number): Promise<{ success: boolean; message?: string }> => {
  console.log('[VisitApiService] cancelVisit:', visitId);
  if (process.env.NODE_ENV === 'test' || (httpClient as any).USE_MOCK_API_HTTP) {
    return mockDelay({ success: true, message: 'Visit cancelled successfully' });
  }
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
  if (process.env.NODE_ENV === 'test' || (httpClient as any).USE_MOCK_API_HTTP) {
    return mockDelay({ success: true, message: 'Visit confirmed successfully' });
  }
  const url = visitEndpoints.confirmVisit.replace('{visitId}', visitId.toString());
  const response = await httpClient.post(url);
  return response.data;
};

export default {
  scheduleVisit,
  getVisitsByProperty,
  getVisitsByAgent,
  getVisitsByBuyer,
  updateVisit,
  cancelVisit,
  confirmVisit,
};