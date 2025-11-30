import { OfferDTO } from '../dto/OfferDTO';
import httpClient from '../core/httpClient';
// Definisce i path relativi degli endpoint API per la gestione delle offerte
// NOTA: Gli endpoint per le offerte non erano presenti nel file api.service.ts originale.
// Vengono aggiunti qui come esempio. Sarà necessario definirli correttamente con il backend.
const offerEndpoints = {
  // Esempi di endpoint per le offerte, da adattare
  createOffer: '/offers/create',
  getOffersByProperty: '/properties/{propertyId}/offers',
  getOfferById: '/offers/{offerId}',
  updateOffer: '/offers/{offerId}',
  deleteOffer: '/offers/{offerId}',
  acceptOffer: '/offers/accept/{offerId}',
  rejectOffer: '/offers/reject/{offerId}',
  withdrawOffer: '/offers/withdraw/{offerId}',
  counterOffer: '/offers/counter/{offerId}',
} as const;

/**
 * Crea una nuova offerta per un immobile.
 * @param offerData - Dati dell'offerta da creare.
 * @returns La risposta dell'API (es. successo e ID della nuova offerta).
 */
export const createOffer = async (offerData: Partial<OfferDTO>): Promise<{ success: boolean; message?: string; id?: string | number }> => {
  console.log('[OfferApiService] createOffer:', offerData);
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
  const url = offerEndpoints.getOffersByProperty.replace('{propertyId}', propertyId.toString());
  const response = await httpClient.get(url);
  return response.data;
};

export const getOfferById = async (offerId: string | number): Promise<any> => {
  console.log('[OfferApiService] getOfferById:', offerId);
  const url = offerEndpoints.getOfferById.replace('{offerId}', offerId.toString());
  const response = await httpClient.get(url);
  return response.data;
};

/**
 * Aggiorna un'offerta esistente.
 * @param offerId - L'ID dell'offerta da aggiornare.
 * @param offerData - Dati aggiornati dell'offerta.
 * @returns La risposta dell'API.
 */
export const updateOffer = async (offerId: string | number, offerData: Partial<OfferDTO>): Promise<{ success: boolean; message?: string }> => {
  console.log('[OfferApiService] updateOffer:', offerId, offerData);
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
  const url = offerEndpoints.rejectOffer.replace('{offerId}', offerId.toString());
  const response = await httpClient.post(url);
  return response.data;
};

export default {
  createOffer,
  getOffersByProperty,
  getOfferById,
  updateOffer,
  deleteOffer,
  acceptOffer,
  rejectOffer,
};