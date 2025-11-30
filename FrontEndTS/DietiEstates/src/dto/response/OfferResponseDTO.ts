import { PropertyDTO } from "@/components/Agent/PropertyDashboard/types";
import { UserInfo } from "../agenda";

export interface OfferResponseDTO {
    id: number;
    property: PropertyDTO;
    user?: UserInfo;
    price: number;
    date: string; // ISO string
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN' | 'COUNTERED';
    createdAt: string; // ISO string
}