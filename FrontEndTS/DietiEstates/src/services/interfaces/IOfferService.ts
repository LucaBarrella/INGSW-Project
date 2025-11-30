import { CreateOfferRequest } from "@/src/dto/request/CreateOfferRequest.dto";
import { OfferResponseDTO } from "@/src/dto/response/OfferResponseDTO";
export interface IOfferService {
    getOffers(): Promise<OfferResponseDTO[]>;
    getReceivedOffers(): Promise<OfferResponseDTO[]>;
    acceptOffer(offerId: string): Promise<void>;
    rejectOffer(offerId: string): Promise<void>;
    withdrawOffer(offerId: string): Promise<any>;
    createOffer(offerData: CreateOfferRequest): Promise<any>;
    counterOffer(offerId: string, price: number): Promise<any>;
}