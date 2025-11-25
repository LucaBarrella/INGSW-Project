import { useState, useEffect } from 'react';
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

  useEffect(() => {
    const fetchVisits = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log("[useBuyerVisits] Fetching visits");
        const data: PagedVisitsDTO = await visitService.getVisitsByBuyer();
        console.log(JSON.stringify(data));
        const visitDTOs: VisitDTO[] = data.content.map(visit => ({
          id: visit.id,
          propertyId: visit.propertyId,
          buyerId: visit.buyerId,
          agentId: visit.agentId,
          status: visit.status,
          notes: visit.notes,
          scheduledDate: visit.scheduledDate.toString(),
          createdAt: visit.createdAt.toString(),
          updatedAt: visit.updatedAt.toString(),
        }));
        setVisits(visitDTOs);
      } catch (err) {
        console.log("Failed to fetch buyer visits:", err);
        setError(err as Error);
      } finally {
        console.log("[useBuyerVisits] Finished fetching visits");
        setLoading(false);
      }
    };

    fetchVisits();
  }, []);

  return { visits, loading, error };
};