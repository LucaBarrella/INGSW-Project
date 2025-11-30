import { OfferResponseDTO } from '../dto/response/OfferResponseDTO';
import httpClient from '../core/httpClient';
import { CreateOfferRequest } from '../dto/request/CreateOfferRequest.dto';

const offerEndpoints = {
    getOffers: '/offers',
    acceptOffer: '/offers/accept/{offerId}',
    rejectOffer: '/offers/reject/{offerId}',
    withdrawOffer: '/offers/withdraw/{offerId}',
    counterOffer: '/offers/counter/{offerId}',
    getReceivedOffers: '/offers/agent_offers',
    createOffer: '/offers/create'
} as const;

export const getUserOffers = async (): Promise<OfferResponseDTO[]> => {
  const url = offerEndpoints.getOffers;
  const response = await httpClient.get(url);
  console.log('Fetched offers:', response.data);
  return response.data;
};

const getReceivedOffers = async (): Promise<OfferResponseDTO[]> => {
  const url = offerEndpoints.getReceivedOffers;
  const response = await httpClient.get(url);
  console.log('Fetched received offers:', response.data);
  return response.data;
}

const acceptOffer = async (offerId: string): Promise<void> => {
    const url = offerEndpoints.acceptOffer.replace('{offerId}', offerId);
    await httpClient.post(url);
}

const rejectOffer = async (offerId: string): Promise<void> => {
    const url = offerEndpoints.rejectOffer.replace('{offerId}', offerId);
    await httpClient.post(url);
}

const withdrawOffer = async (offerId: string): Promise<void> => {
    const url = offerEndpoints.withdrawOffer.replace('{offerId}', offerId);
    await httpClient.post(url);
}

const createOffer = async (offerData: CreateOfferRequest): Promise<any> => {
    const url = offerEndpoints.createOffer;
    const response = await httpClient.post(url, offerData);
    return response.data;
}

const createExternalOffer = async (offerData: CreateOfferRequest): Promise<any> => {
    const url = offerEndpoints.createOffer + '/external';
    const response = await httpClient.post(url, offerData);
    return response.data;
}

const counterOffer = async (offerId: string, price: number): Promise<any> => {
    const url = offerEndpoints.counterOffer.replace('{offerId}', offerId);
    const response = await httpClient.post(url, price);
    return response.data;
}

export default {
    getUserOffers,
    getReceivedOffers,
    acceptOffer,
    rejectOffer,
    withdrawOffer,
    counterOffer,
    createOffer,
    createExternalOffer
};