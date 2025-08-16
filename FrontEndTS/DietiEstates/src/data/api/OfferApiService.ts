import httpClient from '../../../app/_services/httpClient';
import { mockDelay, MOCK_SUCCESS_RESPONSE } from '../../../app/_services/__mocks__/mockData';

// Definisce i path relativi degli endpoint API per la gestione delle offerte
// NOTA: Gli endpoint per le offerte non erano presenti nel file api.service.ts originale.
// Vengono aggiunti qui come esempio. Sarà necessario definirli correttamente con il backend.
const offerEndpoints = {
  // Esempi di endpoint per le offerte, da adattare
  createOffer: '/offers/create',
  getOffersByProperty: '/properties/{propertyId}/offers',
  updateOffer: '/offers/{offerId}',
  deleteOffer: '/offers/{offerId}',
  acceptOffer: '/offers/{offerId}/accept',
  rejectOffer: '/offers/{offerId}/reject',
} as const;

/**
 * Crea una nuova offerta per un immobile.
 * @param offerData - Dati dell'offerta da creare.
 * @returns La risposta dell'API (es. successo e ID della nuova offerta).
 */
export const createOffer = async (offerData: any): Promise<{ success: boolean; message?: string; id?: string | number }> => {
  console.log('[OfferApiService] createOffer:', offerData);
  if (process.env.NODE_ENV === 'test' || (httpClient as any).USE_MOCK_API_HTTP) {
    return mockDelay({ ...MOCK_SUCCESS_RESPONSE, id: `offer-mock-${Date.now()}` });
  }
  const response = await httpClient.post(offerEndpoints.createOffer, offerData);
  return response.data;
};

/**
 * Recupera tutte le offerte per un immobile specifico.
 * @param propertyId - L'ID dell'immobile.
 * @returns La risposta dell'API con la lista delle offerte.
 */
export const getOffersByProperty = async (propertyId: string | number): Promise<any[]> => {
  console.log('[OfferApiService] getOffersByProperty:', propertyId);
  if (process.env.NODE_ENV === 'test' || (httpClient as any).USE_MOCK_API_HTTP) {
    // Mock data per le offerte
    return mockDelay([
      { id: `offer-prop-${propertyId}-1`, propertyId, buyerId: 'buyer1', amount: 250000, status: 'pending', createdAt: '2023-10-27T10:00:00Z' },
      { id: `offer-prop-${propertyId}-2`, propertyId, buyerId: 'buyer2', amount: 260000, status: 'accepted', createdAt: '2023-10-26T15:30:00Z' },
    ]);
  }
  const url = offerEndpoints.getOffersByProperty.replace('{propertyId}', propertyId.toString());
  const response = await httpClient.get(url);
  return response.data;
};

/**
 * Aggiorna un'offerta esistente.
 * @param offerId - L'ID dell'offerta da aggiornare.
 * @param offerData - Dati aggiornati dell'offerta.
 * @returns La risposta dell'API.
 */
export const updateOffer = async (offerId: string | number, offerData: any): Promise<{ success: boolean; message?: string }> => {
  console.log('[OfferApiService] updateOffer:', offerId, offerData);
  if (process.env.NODE_ENV === 'test' || (httpClient as any).USE_MOCK_API_HTTP) {
    return mockDelay({ success: true, message: 'Offer updated successfully' });
  }
  const url = offerEndpoints.updateOffer.replace('{offerId}', offerId.toString());
  const response = await httpClient.put(url, offerData);
  return response.data;
};

/**
 * Elimina un'offerta.
 * @param offerId - L'ID dell'offerta da eliminare.
 * @returns La risposta dell'API.
 */
export const deleteOffer = async (offerId: string | number): Promise<{ success: boolean; message?: string }> => {
  console.log('[OfferApiService] deleteOffer:', offerId);
  if (process.env.NODE_ENV === 'test' || (httpClient as any).USE_MOCK_API_HTTP) {
    return mockDelay({ success: true, message: 'Offer deleted successfully' });
  }
  const url = offerEndpoints.deleteOffer.replace('{offerId}', offerId.toString());
  const response = await httpClient.delete(url);
  return response.data;
};

/**
 * Accetta un'offerta.
 * @param offerId - L'ID dell'offerta da accettare.
 * @returns La risposta dell'API.
 */
export const acceptOffer = async (offerId: string | number): Promise<{ success: boolean; message?: string }> => {
  console.log('[OfferApiService] acceptOffer:', offerId);
  if (process.env.NODE_ENV === 'test' || (httpClient as any).USE_MOCK_API_HTTP) {
    return mockDelay({ success: true, message: 'Offer accepted successfully' });
  }
  const url = offerEndpoints.acceptOffer.replace('{offerId}', offerId.toString());
  const response = await httpClient.post(url);
  return response.data;
};

/**
 * Rifiuta un'offerta.
 * @param offerId - L'ID dell'offerta da rifiutare.
 * @returns La risposta dell'API.
 */
export const rejectOffer = async (offerId: string | number): Promise<{ success: boolean; message?: string }> => {
  console.log('[OfferApiService] rejectOffer:', offerId);
  if (process.env.NODE_ENV === 'test' || (httpClient as any).USE_MOCK_API_HTTP) {
    return mockDelay({ success: true, message: 'Offer rejected successfully' });
  }
  const url = offerEndpoints.rejectOffer.replace('{offerId}', offerId.toString());
  const response = await httpClient.post(url);
  return response.data;
};

export default {
  createOffer,
  getOffersByProperty,
  updateOffer,
  deleteOffer,
  acceptOffer,
  rejectOffer,
};