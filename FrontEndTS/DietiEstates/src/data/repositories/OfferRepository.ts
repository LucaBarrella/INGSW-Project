import { IOfferRepository } from '../../domain/repositories/IOfferRepository';
import { Offer } from '../../domain/Offer';
import * as OfferApiService from '../api/OfferApiService';
import { mapOfferDtoToDomain } from '../mappers/OfferMapper';

export class OfferRepository implements IOfferRepository {
  private apiService: typeof OfferApiService;

  constructor() {
    this.apiService = OfferApiService;
  }

  async findById(id: string): Promise<Offer | null> {
    try {
      const offers = await this.apiService.getOffersByProperty('dummy-property-id');
      const offer = offers.find(o => o.id === id);
      if (offer) {
        const offerDTO = {
          id: offer.id.toString(),
          propertyId: offer.propertyId.toString(),
          buyerId: offer.buyerId.toString(),
          amount: offer.amount,
          status: offer.status,
          createdAt: offer.createdAt?.toString() || new Date().toISOString(),
          updatedAt: offer.updatedAt?.toString() || new Date().toISOString(),
        };
        return mapOfferDtoToDomain(offerDTO);
      }
      return null;
    } catch (error) {
      console.error(`Error finding offer by id ${id}:`, error);
      return null;
    }
  }

  async findAll(): Promise<Offer[]> {
    try {
      const offers = await this.apiService.getOffersByProperty('dummy-property-id');
      return offers.map(offer => {
        const offerDTO = {
          id: offer.id.toString(),
          propertyId: offer.propertyId.toString(),
          buyerId: offer.buyerId.toString(),
          amount: offer.amount,
          status: offer.status,
          createdAt: offer.createdAt?.toString() || new Date().toISOString(),
          updatedAt: offer.updatedAt?.toString() || new Date().toISOString(),
        };
        return mapOfferDtoToDomain(offerDTO);
      });
    } catch (error) {
      console.error('Error finding all offers:', error);
      return [];
    }
  }

  async save(offer: Offer): Promise<Offer> {
    try {
      const offerData = {
        ...offer,
        propertyId: offer.propertyId,
        buyerId: offer.buyerId,
        amount: offer.amount,
        status: offer.status,
        createdAt: offer.createdAt.toISOString(),
        updatedAt: offer.updatedAt.toISOString(),
      };
      const result = await this.apiService.createOffer(offerData);
      if (result.success && result.id) {
        return { ...offer, id: result.id.toString() };
      }
      throw new Error('Failed to save offer');
    } catch (error) {
      console.error('Error saving offer:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const result = await this.apiService.deleteOffer(id);
      if (!result.success) {
        throw new Error('Failed to delete offer');
      }
    } catch (error) {
      console.error(`Error deleting offer with id ${id}:`, error);
      throw error;
    }
  }
}