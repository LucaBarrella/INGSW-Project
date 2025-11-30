import { IOfferService } from "@/src/services/interfaces/IOfferService";
import OfferApiService from "@/src/api/OfferApi";
import { OfferResponseDTO } from "@/src/dto/response/OfferResponseDTO";
export class OfferService implements IOfferService {
    async getOffers(): Promise<OfferResponseDTO[]> {
        return OfferApiService.getUserOffers();
    }
    async getReceivedOffers(): Promise<OfferResponseDTO[]> {
        return OfferApiService.getReceivedOffers();
    }
    async acceptOffer(offerId: string): Promise<void> {
        return OfferApiService.acceptOffer(offerId);
    }
    async rejectOffer(offerId: string): Promise<void> {
        return OfferApiService.rejectOffer(offerId);
    }
    async withdrawOffer(offerId: string): Promise<void> {
        return OfferApiService.withdrawOffer(offerId);
    }
}