export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface DashboardStats {
  totalProperties: number;
  soldProperties: number;
  rentedProperties: number;
  activeListings: number;
  averagePrice: number;
  monthlyViews: number;
  totalBookings: number;
  averageBookingsPerProperty: number;
}

export interface PropertyDetail {
  id: number;
  title: string;
  address: string;
  type: string;
  price: string;
  views: number;
  bookings: number;
  status: "available" | "sold" | "rented";
  createdAt: string;
  updatedAt: string;
}
