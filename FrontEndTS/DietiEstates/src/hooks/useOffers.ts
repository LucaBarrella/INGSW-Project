import { useState } from 'react';
import { OfferService } from '../services/OfferService';
import { IOfferService } from '../services/interfaces/IOfferService';
import { OfferResponseDTO } from '../dto/response/OfferResponseDTO';
import { CreateOfferRequest } from '../dto/request/CreateOfferRequest.dto';

export const useOffers = () => {
  const [offers, setOffers] = useState<OfferResponseDTO[]>([]);
  const [receivedOffers, setReceivedOffers] = useState<OfferResponseDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const offerService: IOfferService = new OfferService();
  const fetchOffers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = (await offerService.getOffers());
      setOffers(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch offers');
    } finally {
      setLoading(false);
    }
  };

  const fetchReceivedOffers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await offerService.getReceivedOffers();
      setReceivedOffers(data.content);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch received offers');
    } finally {
      setLoading(false);
    }
  };

  const rejectOffer = async (offerId: string) => {
    setLoading(true);
    setError(null);
    try {
      await offerService.rejectOffer(offerId);
    } catch (err: any) {
      setError(err.message || 'Failed to reject offer');
    } finally {
      setLoading(false);
    }
  };

  const acceptOffer = async (offerId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await offerService.acceptOffer(offerId);
      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to accept offer');
    } finally {
      setLoading(false);
    }
  };

  const withdrawOffer = async (offerId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await offerService.withdrawOffer(offerId);
      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to withdraw offer');
    } finally {
      setLoading(false);
    }
  };

  const counterOffer = async (offerId: string, price: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await offerService.counterOffer(offerId, price);
      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to submit counter offer');
    } finally {
      setLoading(false);
    }
  };

  const createOffer = async (offerData: CreateOfferRequest) => {
    setLoading(true);
    setError(null);
    try {
      return await offerService.createOffer(offerData);
    } catch (err: any) {
      setError(err.message || 'Failed to create offer');
    } finally {
      setLoading(false);
    }
  };

  const createExternalOffer = async (offerData: CreateOfferRequest) => {
    setLoading(true);
    setError(null);
    try {
      return await offerService.createExternalOffer(offerData);
    } catch (err: any) {
      setError(err.message || 'Failed to create external offer');
    } finally {
      setLoading(false);
    }
  };

  return {
    offers,
    receivedOffers,
    loading,
    error,
    fetchOffers,
    fetchReceivedOffers,
    acceptOffer,
    rejectOffer,
    withdrawOffer,
    counterOffer,
    createOffer,
    createExternalOffer
  };
};