import { Visit } from '../Visit';

export interface IVisitRepository {
  findById(id: string): Promise<Visit | null>;
  findAll(): Promise<Visit[]>;
  save(visit: Visit): Promise<Visit>;
  delete(id: string): Promise<void>;
}