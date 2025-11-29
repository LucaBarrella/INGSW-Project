import { OfferResponseDTO } from '../dto/response/OfferResponseDTO';
import httpClient from '../core/httpClient';

const offerEndpoints = {
    getOffers: '/offers',
} as const;

export const getUserOffers = async (): Promise<OfferResponseDTO[]> => {
  const url = offerEndpoints.getOffers;
  const response = await httpClient.get(url);
  console.log('Fetched offers:', response.data);
  return response.data;
};

export default {
    getUserOffers
};