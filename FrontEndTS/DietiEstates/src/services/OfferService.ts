import { IOfferService } from "@/src/services/interfaces/IOfferService";
import OfferApiService from "@/src/api/OfferApi";
import { OfferResponseDTO } from "@/src/dto/response/OfferResponseDTO";
export class OfferService implements IOfferService {
    async getOffers(): Promise<OfferResponseDTO[]> {
        return OfferApiService.getUserOffers();
    }
}