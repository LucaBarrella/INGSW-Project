// File api.service.ts originale refattorizzato.
// La logica è stata spostata nei servizi specializzati in src/data/api/
// Questo file ora esporta i nuovi servizi per mantenere la compatibilità.

// Importa i servizi API specializzati
import AuthApiService from '../../src/data/api/AuthApiService';
import UserApiService from '../../src/data/api/UserApiService';
import PropertyApiService from '../../src/data/api/PropertyApiService';
import OfferApiService from '../../src/data/api/OfferApiService';
import VisitApiService from '../../src/data/api/VisitApiService';

// Per mantenere la compatibilità con eventuali import che si aspettano l'oggetto ApiService
// viene esportato un oggetto che raggruppa tutti i servizi.
// Questo è un compromesso per evitare di dover modificare tutti i consumatori immediatamente.
// L'obiettivo futuro è che i consumatori importino i servizi specifici direttamente.
const ApiService = {
  auth: AuthApiService,
  users: UserApiService,
  properties: PropertyApiService,
  offers: OfferApiService,
  visits: VisitApiService,
  // Esponi le funzioni specifiche direttamente sull'oggetto ApiService per compatibilità
  // Auth
  loginUser: AuthApiService.loginUser,
  registerUser: AuthApiService.registerUser,
  loginAdmin: AuthApiService.loginAdmin,
  loginAgent: AuthApiService.loginAgent,
  changeAdminPassword: AuthApiService.changeAdminPassword,
  logout: AuthApiService.logout,
  // Users
  getAgentProfile: UserApiService.getAgentProfile,
  createAdmin: UserApiService.createAdmin,
  createAgent: UserApiService.createAgent,
  // Properties
  PropertyDTO_to_PropertyDetail: PropertyApiService.PropertyDTO_to_PropertyDetail,
  getAgentStats: PropertyApiService.getAgentStats,
  getAgentProperties: PropertyApiService.getAgentProperties,
  searchProperties: PropertyApiService.searchProperties,
  getFeaturedProperties: PropertyApiService.getFeaturedProperties,
  getPropertyDetails: PropertyApiService.getPropertyDetails,
  createProperty: PropertyApiService.createProperty,
  // Offers
  createOffer: OfferApiService.createOffer,
  getOffersByProperty: OfferApiService.getOffersByProperty,
  updateOffer: OfferApiService.updateOffer,
  deleteOffer: OfferApiService.deleteOffer,
  acceptOffer: OfferApiService.acceptOffer,
  rejectOffer: OfferApiService.rejectOffer,
  // Visits
  scheduleVisit: VisitApiService.scheduleVisit,
  getVisitsByProperty: VisitApiService.getVisitsByProperty,
  getVisitsByAgent: VisitApiService.getVisitsByAgent,
  getVisitsByBuyer: VisitApiService.getVisitsByBuyer,
  updateVisit: VisitApiService.updateVisit,
  cancelVisit: VisitApiService.cancelVisit,
  confirmVisit: VisitApiService.confirmVisit,
};

export default ApiService;

// Esporta anche i singoli servizi per un utilizzo più granulare
export { AuthApiService, UserApiService, PropertyApiService, OfferApiService, VisitApiService };
