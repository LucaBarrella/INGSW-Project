import { useState, useEffect } from 'react';
import { VisitDTO } from '@/src/dto/VisitDTO';
import { VisitService } from '@/src/services/VisitService';
import { IVisitService } from '@/src/services/interfaces/IVisitService';
import { VisitRepository } from '@/src/repositories/VisitRepository';

interface UseVisitsHook {
  visits: VisitDTO[];
  loading: boolean;
  error: string | null;
  fetchVisitsByBuyer: (buyerId?: string) => Promise<void>;
  getVisitsOfCurrentAgent: () => Promise<VisitDTO[]>;
  scheduleVisit: (visitData: Partial<VisitDTO>) => Promise<{ success: boolean; message?: string; id?: string | number }>;
  updateVisit: (visitId: string | number, visitData: Partial<VisitDTO>) => Promise<{ success: boolean; message?: string }>;
  cancelVisit: (visitId: string | number) => Promise<{ success: boolean; message?: string }>;
  confirmVisit: (visitId: string | number) => Promise<{ success: boolean; message?: string }>;
  getVisitById: (visitId: string | number) => Promise<any>;
}

export const useVisits = (initialBuyerId?: string): UseVisitsHook => {
  const [visits, setVisits] = useState<VisitDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const visitService: IVisitService = new VisitService(new VisitRepository());

  const fetchVisitsByBuyer = async (buyerId?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = (await visitService.getVisitsByBuyer(buyerId)).content;
      setVisits(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch visits');
    } finally {
      setLoading(false);
    }
  };

  const scheduleVisit = async (visitData: Partial<VisitDTO>) => {
    setLoading(true);
    setError(null);
    try {
      const result = await visitService.scheduleVisit(visitData);
      // Optionally re-fetch visits after scheduling
      if (initialBuyerId) {
        fetchVisitsByBuyer(initialBuyerId);
      }
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to schedule visit');
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateVisit = async (visitId: string | number, visitData: Partial<VisitDTO>) => {
    setLoading(true);
    setError(null);
    try {
      const result = await visitService.updateVisit(visitId, visitData);
      if (initialBuyerId) {
        fetchVisitsByBuyer(initialBuyerId);
      }
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to update visit');
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const cancelVisit = async (visitId: string | number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await visitService.cancelVisit(visitId);
      if (initialBuyerId) {
        fetchVisitsByBuyer(initialBuyerId);
      }
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to cancel visit');
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const confirmVisit = async (visitId: string | number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await visitService.confirmVisit(visitId);
      if (initialBuyerId) {
        fetchVisitsByBuyer(initialBuyerId);
      }
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to confirm visit');
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const getVisitById = async (visitId: string | number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await visitService.getVisitById(visitId);
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to get visit by ID');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getVisitsOfCurrentAgent = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = (await visitService.getVisitsOfCurrentAgent()).content;
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch visits for agent');
    } finally {
      setLoading(false);
    }
    return [];
  };

  useEffect(() => {
    if (initialBuyerId) {
      fetchVisitsByBuyer(initialBuyerId);
    }
  }, [initialBuyerId]);

  return {
    visits,
    loading,
    error,
    getVisitsOfCurrentAgent,
    fetchVisitsByBuyer,
    scheduleVisit,
    updateVisit,
    cancelVisit,
    confirmVisit,
    getVisitById,
  };
};