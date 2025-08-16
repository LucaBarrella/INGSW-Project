import { useState, useEffect } from 'react';
import { User } from '../../domain/User';
import { UserRepository } from '../../data/repositories/UserRepository';

// Interfaccia per i dati di creazione utente
export interface UserCreationData {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'agent' | 'buyer';
}

export const useUserViewModel = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const userRepository = new UserRepository();

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedUsers = await userRepository.findAll();
      setUsers(fetchedUsers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto durante il recupero degli utenti');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserById = async (id: string): Promise<User | null> => {
    setLoading(true);
    setError(null);
    try {
      const user = await userRepository.findById(id);
      return user;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto durante il recupero dell\'utente');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData: UserCreationData): Promise<User | null> => {
    setLoading(true);
    setError(null);
    try {
      const newUser: User = {
        ...userData,
        id: '', // Verrà assegnato dal repository
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const savedUser = await userRepository.save(newUser);
      setUsers(prev => [...prev, savedUser]);
      return savedUser;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto durante la creazione dell\'utente');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id: string, userData: Partial<User>): Promise<User | null> => {
    setLoading(true);
    setError(null);
    try {
      const existingUser = await userRepository.findById(id);
      if (!existingUser) {
        throw new Error('Utente non trovato');
      }
      const updatedUser: User = {
        ...existingUser,
        ...userData,
        updatedAt: new Date(),
      };
      const savedUser = await userRepository.save(updatedUser);
      setUsers(prev => prev.map(u => u.id === id ? savedUser : u));
      return savedUser;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto durante l\'aggiornamento dell\'utente');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await userRepository.delete(id);
      setUsers(prev => prev.filter(u => u.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto durante l\'eliminazione dell\'utente');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentUser = async (): Promise<User | null> => {
    setLoading(true);
    setError(null);
    try {
      // Recupera l'utente corrente basato sul token o su un altro meccanismo di identificazione
      // Per ora, simuliamo il recupero dell'utente corrente
      const user = await userRepository.findById('current-user-id'); // Sostituire con l'ID reale
      setCurrentUser(user);
      return user;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto durante il recupero dell\'utente corrente');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateCurrentUser = async (userData: Partial<User>): Promise<User | null> => {
    setLoading(true);
    setError(null);
    try {
      if (!currentUser) {
        throw new Error('Nessun utente corrente trovato');
      }
      const updatedUser = await updateUser(currentUser.id, userData);
      if (updatedUser) {
        setCurrentUser(updatedUser);
      }
      return updatedUser;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto durante l\'aggiornamento dell\'utente corrente');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = (filters: {
    role?: User['role'];
    email?: string;
    firstName?: string;
    lastName?: string;
  }): User[] => {
    return users.filter(user => {
      if (filters.role && user.role !== filters.role) return false;
      if (filters.email && !user.email.toLowerCase().includes(filters.email.toLowerCase())) return false;
      if (filters.firstName && !user.firstName.toLowerCase().includes(filters.firstName.toLowerCase())) return false;
      if (filters.lastName && !user.lastName.toLowerCase().includes(filters.lastName.toLowerCase())) return false;
      return true;
    });
  };

  useEffect(() => {
    fetchUsers();
    fetchCurrentUser();
  }, []);

  return {
    users,
    currentUser,
    loading,
    error,
    fetchUsers,
    fetchUserById,
    createUser,
    updateUser,
    deleteUser,
    fetchCurrentUser,
    updateCurrentUser,
    filterUsers,
  };
};