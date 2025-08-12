import { Appointment, VisitRequest } from '@/types/agenda';
import { mockAppointments, mockVisitRequests, mockDelay } from './__mocks__/mockData';

class AgendaService {
  /**
   * Recupera le richieste di visita mock.
   * @returns Una promessa che si risolve con un array di VisitRequest.
   */
  getVisitRequests(): Promise<VisitRequest[]> {
    console.log('Fetching mock visit requests...');
    return mockDelay(mockVisitRequests);
  }

  /**
   * Recupera gli appuntamenti mock.
   * @returns Una promessa che si risolve con un array di Appointment.
   */
  getAppointments(): Promise<Appointment[]> {
    console.log('Fetching mock appointments...');
    return mockDelay(mockAppointments);
  }
}

export const agendaService = new AgendaService();