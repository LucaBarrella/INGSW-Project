import { useState, useEffect } from 'react';
import { Offer } from '../../domain/Offer';
import { OfferRepository } from '../../data/repositories/OfferRepository';

export const useOffersViewModel = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const offerRepository = new OfferRepository();

  const fetchOffers = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedOffers = await offerRepository.findAll();
      setOffers(fetchedOffers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto durante il recupero delle offerte');
    } finally {
      setLoading(false);
    }
  };

  const fetchOfferById = async (id: string): Promise<Offer | null> => {
    setLoading(true);
    setError(null);
    try {
      const offer = await offerRepository.findById(id);
      return offer;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto durante il recupero dell\'offerta');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createOffer = async (offerData: Omit<Offer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Offer | null> => {
    setLoading(true);
    setError(null);
    try {
      const newOffer: Offer = {
        ...offerData,
        id: '', // Verrà assegnato dal repository
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const savedOffer = await offerRepository.save(newOffer);
      setOffers(prev => [...prev, savedOffer]);
      return savedOffer;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto durante la creazione dell\'offerta');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateOffer = async (id: string, offerData: Partial<Offer>): Promise<Offer | null> => {
    setLoading(true);
    setError(null);
    try {
      const existingOffer = await offerRepository.findById(id);
      if (!existingOffer) {
        throw new Error('Offerta non trovata');
      }
      const updatedOffer: Offer = {
        ...existingOffer,
        ...offerData,
        updatedAt: new Date(),
      };
      const savedOffer = await offerRepository.save(updatedOffer);
      setOffers(prev => prev.map(o => o.id === id ? savedOffer : o));
      return savedOffer;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto durante l\'aggiornamento dell\'offerta');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteOffer = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await offerRepository.delete(id);
      setOffers(prev => prev.filter(o => o.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto durante l\'eliminazione dell\'offerta');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateOfferStatus = async (id: string, status: Offer['status']): Promise<Offer | null> => {
    setLoading(true);
    setError(null);
    try {
      const updatedOffer = await updateOffer(id, { status });
      return updatedOffer;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto durante l\'aggiornamento dello stato dell\'offerta');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const filterOffers = (filters: {
    propertyId?: string;
    buyerId?: string;
    status?: Offer['status'];
    minAmount?: number;
    maxAmount?: number;
  }): Offer[] => {
    return offers.filter(offer => {
      if (filters.propertyId && offer.propertyId !== filters.propertyId) return false;
      if (filters.buyerId && offer.buyerId !== filters.buyerId) return false;
      if (filters.status && offer.status !== filters.status) return false;
      if (filters.minAmount && offer.amount < filters.minAmount) return false;
      if (filters.maxAmount && offer.amount > filters.maxAmount) return false;
      return true;
    });
  };

  const getOffersByProperty = async (propertyId: string): Promise<Offer[]> => {
    setLoading(true);
    setError(null);
    try {
      const propertyOffers = offers.filter(offer => offer.propertyId === propertyId);
      return propertyOffers;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto durante il recupero delle offerte per la proprietà');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getOffersByBuyer = async (buyerId: string): Promise<Offer[]> => {
    setLoading(true);
    setError(null);
    try {
      const buyerOffers = offers.filter(offer => offer.buyerId === buyerId);
      return buyerOffers;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto durante il recupero delle offerte per l\'acquirente');
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  return {
    offers,
    loading,
    error,
    fetchOffers,
    fetchOfferById,
    createOffer,
    updateOffer,
    deleteOffer,
    updateOfferStatus,
    filterOffers,
    getOffersByProperty,
    getOffersByBuyer,
  };
};