import { OfferResponseDTO } from "@/src/dto/response/OfferResponseDTO";
export interface IOfferService {
    getOffers(): Promise<OfferResponseDTO[]>;
}