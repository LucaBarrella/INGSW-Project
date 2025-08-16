import { Offer } from '../Offer';

export interface IOfferRepository {
  findById(id: string): Promise<Offer | null>;
  findAll(): Promise<Offer[]>;
  save(offer: Offer): Promise<Offer>;
  delete(id: string): Promise<void>;
}