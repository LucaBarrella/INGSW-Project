import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { VisitService } from '../services/VisitService';
import { VisitRepository } from '../repositories/VisitRepository';
import { VisitDTO } from '../dto/VisitDTO';
import { PagedVisitsDTO } from '../dto/response/PagedVisitsDTO';

interface UseBuyerVisitsResult {
  visits: VisitDTO[] | null;
  loading: boolean;
  error: Error | null;
}

export const useBuyerVisits = (): UseBuyerVisitsResult => {
  const [visits, setVisits] = useState<VisitDTO[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Placeholder for VisitService instance.
  // In a real application, this would typically be injected or provided via a dependency injection container or React Context.
  // For now, we'll instantiate it directly.
  const visitRepository = new VisitRepository();
  const visitService = new VisitService(visitRepository);

  const fetchVisits = async () => {
    setLoading(true);
    setError(null);
    try {
      const data: PagedVisitsDTO = await visitService.getVisitsByBuyer();
      setVisits(data.content);
    } catch (err) {
      console.log("Failed to fetch buyer visits:", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchVisits();
    }, [])
  );

  return { visits, loading, error };
};