import { useState, useEffect } from 'react';
import { User } from '../../domain/User';
import { UserRepository } from '../../data/repositories/UserRepository';

export const useUsersViewModel = () => {
  const [users, setUsers] = useState<User[]>([]);
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

  const createUser = async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User | null> => {
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

  const createAdmin = async (adminData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User | null> => {
    setLoading(true);
    setError(null);
    try {
      const newAdmin: User = {
        ...adminData,
        id: '', // Verrà assegnato dal repository
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const savedAdmin = await userRepository.save(newAdmin);
      setUsers(prev => [...prev, savedAdmin]);
      return savedAdmin;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto durante la creazione dell\'admin');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createAgent = async (agentData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User | null> => {
    setLoading(true);
    setError(null);
    try {
      const newAgent: User = {
        ...agentData,
        id: '', // Verrà assegnato dal repository
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const savedAgent = await userRepository.save(newAgent);
      setUsers(prev => [...prev, savedAgent]);
      return savedAgent;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto durante la creazione dell\'agente');
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    fetchUsers,
    fetchUserById,
    createUser,
    updateUser,
    deleteUser,
    createAdmin,
    createAgent,
  };
};