import { OfferResponseDTO } from "@/src/dto/response/OfferResponseDTO";

export interface IOfferRepository {
    getOffers(): Promise<OfferResponseDTO[]>;
}