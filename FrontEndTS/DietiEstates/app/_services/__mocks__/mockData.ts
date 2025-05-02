import { PropertyDetail, DashboardStats } from '@/components/Agent/PropertyDashboard/types';
import { PropertyType } from '@/components/Agent/AddPropertySteps/Step1_PropertyType';

// --- DATI MOCK ---
export const MOCK_DELAY = 500; // Simula un ritardo di rete

export const mockDelay = (data: any) => new Promise(resolve => setTimeout(() => resolve(data), MOCK_DELAY));

export const MOCK_TOKEN_RESPONSE = { token: 'mock-jwt-token-12345', userType: 'buyer' };
export const MOCK_SUCCESS_RESPONSE = { success: true, message: 'Operazione completata con successo (Mock)' };
export const MOCK_AGENT_PROFILE = { fullName: 'Mario Rossi (Mock)', email: 'mock.agent@dietiestates.it', reaNumber: 'REA-MOCK-123' };

export const MOCK_AGENT_STATS: DashboardStats = {
  totalProperties: 15,
  soldProperties: 3,
  rentedProperties: 2,
  activeListings: 10,
  averagePrice: 350000,
  monthlyViews: 2500,
  totalBookings: 45,
  averageBookingsPerProperty: 3,
};

export const MOCK_PROPERTIES: PropertyDetail[] = [
  {
    id: 1,
    title: 'Villa di Lusso con Piscina',
    address: 'Via dei Giardini 1, Como',
    price: '750000',
    views: 120,
    bookings: 5,
    status: 'available',
    createdAt: new Date(2024, 3, 15).toISOString(),
    updatedAt: new Date().toISOString(),
    type: 'RESIDENTIAL',
    imageUrl: 'https://picsum.photos/seed/villa1/800/600'
  },
  {
    id: 2,
    title: 'Negozio in Centro',
    address: 'Corso Italia 45, Milano',
    price: '450000',
    views: 250,
    bookings: 15,
    status: 'available',
    createdAt: new Date(2024, 4, 1).toISOString(),
    updatedAt: new Date().toISOString(),
    type: 'COMMERCIAL',
    imageUrl: 'https://picsum.photos/seed/commercial1/800/600'
  },
  {
    id: 3,
    title: 'Capannone Industriale',
    address: 'Zona Industriale 3, Bergamo',
    price: '1200000',
    views: 80,
    bookings: 2,
    status: 'sold',
    createdAt: new Date(2024, 2, 10).toISOString(),
    updatedAt: new Date().toISOString(),
    type: 'INDUSTRIAL',
    imageUrl: 'https://picsum.photos/seed/industrial1/800/600'
  },
  {
    id: 4,
    title: 'Terreno Edificabile',
    address: 'Via delle Querce 78, Monza',
    price: '350000',
    views: 95,
    bookings: 3,
    status: 'available',
    createdAt: new Date(2024, 2, 20).toISOString(),
    updatedAt: new Date().toISOString(),
    type: 'LAND',
    imageUrl: 'https://picsum.photos/seed/land1/800/600'
  }
];

export const MOCK_FEATURED_PROPERTIES: PropertyDetail[] = MOCK_PROPERTIES.slice(0, 2);
export const MOCK_PROPERTY_DETAILS: PropertyDetail = { ...MOCK_PROPERTIES[0] };