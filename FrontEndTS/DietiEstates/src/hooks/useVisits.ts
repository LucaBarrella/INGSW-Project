import { useState, useEffect } from 'react';
import { VisitDTO } from '@/src/dto/VisitDTO';
import { VisitService } from '@/src/services/VisitService';
import { IVisitService } from '@/src/services/interfaces/IVisitService';
import { VisitRepository } from '@/src/repositories/VisitRepository';

export const useVisits = (initialBuyerId?: string) => {
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

  const updateVisitStatus = async (visitId: string | number, status: "CONFIRMED" | "REJECTED" | "CANCELLED" | "PENDING") => {
    setLoading(true);
    setError(null);
    try {
      const result = await visitService.updateVisitStatus(visitId, status);
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

  const getVisitsOfCurrentAgent = async (date: Date) => {
    setLoading(true);
    setError(null);
    try {
      const data = await visitService.getVisitsOfCurrentAgent(date);
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch visits for agent');
    } finally {
      setLoading(false);
    }
    return {pending: [], confirmed: []};
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
    updateVisitStatus
  };
};