import { useState } from 'react';
import { OfferService } from '../services/OfferService';
import { IOfferService } from '../services/interfaces/IOfferService';
import { OfferResponseDTO } from '../dto/response/OfferResponseDTO';

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
      const data = (await offerService.getReceivedOffers());
      setReceivedOffers(data.content);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch received offers');
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
    fetchReceivedOffers
  };
};