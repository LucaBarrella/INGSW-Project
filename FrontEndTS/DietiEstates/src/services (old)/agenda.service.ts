import { Appointment, VisitRequest } from '@/src/dto/agenda';
import httpClient from './httpClient';

// Definisce i path relativi degli endpoint API per l'agenda
const agendaEndpoints = {
  visitRequests: '/agenda/visit-requests',
  appointments: '/agenda/appointments',
} as const;

class AgendaService {
  /**
   * Recupera le richieste di visita.
   * @returns Una promessa che si risolve con un array di VisitRequest.
   */
  async getVisitRequests(): Promise<VisitRequest[]> {
    console.log('[AgendaService] getVisitRequests');
    const response = await httpClient.get(agendaEndpoints.visitRequests);
    return response.data;
  }

  /**
   * Recupera gli appuntamenti.
   * @returns Una promessa che si risolve con un array di Appointment.
   */
  async getAppointments(): Promise<Appointment[]> {
    console.log('[AgendaService] getAppointments');
    const response = await httpClient.get(agendaEndpoints.appointments);
    return response.data;
  }
}

export const agendaService = new AgendaService();