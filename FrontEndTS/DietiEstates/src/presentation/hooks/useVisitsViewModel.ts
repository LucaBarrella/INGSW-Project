import { useState, useEffect } from 'react';
import { Visit } from '../../domain/Visit';
import { VisitRepository } from '../../data/repositories/VisitRepository';

export const useVisitsViewModel = () => {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const visitRepository = new VisitRepository();

  const fetchVisits = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedVisits = await visitRepository.findAll();
      setVisits(fetchedVisits);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto durante il recupero delle visite');
    } finally {
      setLoading(false);
    }
  };

  const fetchVisitById = async (id: string): Promise<Visit | null> => {
    setLoading(true);
    setError(null);
    try {
      const visit = await visitRepository.findById(id);
      return visit;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto durante il recupero della visita');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createVisit = async (visitData: Omit<Visit, 'id' | 'createdAt' | 'updatedAt'>): Promise<Visit | null> => {
    setLoading(true);
    setError(null);
    try {
      const newVisit: Visit = {
        ...visitData,
        id: '', // Verrà assegnato dal repository
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const savedVisit = await visitRepository.save(newVisit);
      setVisits(prev => [...prev, savedVisit]);
      return savedVisit;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto durante la creazione della visita');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateVisit = async (id: string, visitData: Partial<Visit>): Promise<Visit | null> => {
    setLoading(true);
    setError(null);
    try {
      const existingVisit = await visitRepository.findById(id);
      if (!existingVisit) {
        throw new Error('Visita non trovata');
      }
      const updatedVisit: Visit = {
        ...existingVisit,
        ...visitData,
        updatedAt: new Date(),
      };
      const savedVisit = await visitRepository.save(updatedVisit);
      setVisits(prev => prev.map(v => v.id === id ? savedVisit : v));
      return savedVisit;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto durante l\'aggiornamento della visita');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteVisit = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await visitRepository.delete(id);
      setVisits(prev => prev.filter(v => v.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto durante l\'eliminazione della visita');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateVisitStatus = async (id: string, status: Visit['status']): Promise<Visit | null> => {
    setLoading(true);
    setError(null);
    try {
      const updatedVisit = await updateVisit(id, { status });
      return updatedVisit;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto durante l\'aggiornamento dello stato della visita');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const addVisitNotes = async (id: string, notes: string): Promise<Visit | null> => {
    setLoading(true);
    setError(null);
    try {
      const updatedVisit = await updateVisit(id, { notes });
      return updatedVisit;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto durante l\'aggiornamento delle note della visita');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const filterVisits = (filters: {
    propertyId?: string;
    buyerId?: string;
    agentId?: string;
    status?: Visit['status'];
    scheduledDate?: Date;
    minScheduledDate?: Date;
    maxScheduledDate?: Date;
  }): Visit[] => {
    return visits.filter(visit => {
      if (filters.propertyId && visit.propertyId !== filters.propertyId) return false;
      if (filters.buyerId && visit.buyerId !== filters.buyerId) return false;
      if (filters.agentId && visit.agentId !== filters.agentId) return false;
      if (filters.status && visit.status !== filters.status) return false;
      if (filters.scheduledDate && visit.scheduledDate.getTime() !== filters.scheduledDate.getTime()) return false;
      if (filters.minScheduledDate && visit.scheduledDate < filters.minScheduledDate) return false;
      if (filters.maxScheduledDate && visit.scheduledDate > filters.maxScheduledDate) return false;
      return true;
    });
  };

  const getVisitsByProperty = async (propertyId: string): Promise<Visit[]> => {
    setLoading(true);
    setError(null);
    try {
      const propertyVisits = visits.filter(visit => visit.propertyId === propertyId);
      return propertyVisits;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto durante il recupero delle visite per la proprietà');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getVisitsByBuyer = async (buyerId: string): Promise<Visit[]> => {
    setLoading(true);
    setError(null);
    try {
      const buyerVisits = visits.filter(visit => visit.buyerId === buyerId);
      return buyerVisits;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto durante il recupero delle visite per l\'acquirente');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getVisitsByAgent = async (agentId: string): Promise<Visit[]> => {
    setLoading(true);
    setError(null);
    try {
      const agentVisits = visits.filter(visit => visit.agentId === agentId);
      return agentVisits;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto durante il recupero delle visite per l\'agente');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getUpcomingVisits = async (agentId?: string): Promise<Visit[]> => {
    setLoading(true);
    setError(null);
    try {
      const now = new Date();
      let upcomingVisits = visits.filter(visit => visit.scheduledDate > now);
      
      if (agentId) {
        upcomingVisits = upcomingVisits.filter(visit => visit.agentId === agentId);
      }
      
      // Ordina per data pianificata (dal più prossimo al più lontano)
      upcomingVisits.sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime());
      
      return upcomingVisits;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto durante il recupero delle visite imminenti');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getPastVisits = async (agentId?: string): Promise<Visit[]> => {
    setLoading(true);
    setError(null);
    try {
      const now = new Date();
      let pastVisits = visits.filter(visit => visit.scheduledDate <= now);
      
      if (agentId) {
        pastVisits = pastVisits.filter(visit => visit.agentId === agentId);
      }
      
      // Ordina per data pianificata (dal più recente al più vecchio)
      pastVisits.sort((a, b) => b.scheduledDate.getTime() - a.scheduledDate.getTime());
      
      return pastVisits;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto durante il recupero delle visite passate');
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisits();
  }, []);

  return {
    visits,
    loading,
    error,
    fetchVisits,
    fetchVisitById,
    createVisit,
    updateVisit,
    deleteVisit,
    updateVisitStatus,
    addVisitNotes,
    filterVisits,
    getVisitsByProperty,
    getVisitsByBuyer,
    getVisitsByAgent,
    getUpcomingVisits,
    getPastVisits,
  };
};