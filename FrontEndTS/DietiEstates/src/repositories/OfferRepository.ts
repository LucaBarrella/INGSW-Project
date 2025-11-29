import { IOfferRepository } from "@/src/repositories/interfaces/IOfferRepository";
import OfferApiService from "@/src/api/OfferApi";
import { OfferResponseDTO } from "@/src/dto/response/OfferResponseDTO";

export class OfferRepository implements IOfferRepository {
    async getOffers(): Promise<OfferResponseDTO[]> {
        return OfferApiService.getUserOffers();
    }
}