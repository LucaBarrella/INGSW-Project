import { useState, useEffect } from 'react';
import { Property } from '../../domain/Property';
import { PropertyRepository } from '../../data/repositories/PropertyRepository';

export const usePropertiesViewModel = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const propertyRepository = new PropertyRepository();

  const fetchProperties = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedProperties = await propertyRepository.findAll();
      setProperties(fetchedProperties);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto durante il recupero delle proprietà');
    } finally {
      setLoading(false);
    }
  };

  const fetchPropertyById = async (id: string): Promise<Property | null> => {
    setLoading(true);
    setError(null);
    try {
      const property = await propertyRepository.findById(id);
      return property;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto durante il recupero della proprietà');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createProperty = async (propertyData: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>): Promise<Property | null> => {
    setLoading(true);
    setError(null);
    try {
      const newProperty: Property = {
        ...propertyData,
        id: '', // Verrà assegnato dal repository
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const savedProperty = await propertyRepository.save(newProperty);
      setProperties(prev => [...prev, savedProperty]);
      return savedProperty;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto durante la creazione della proprietà');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateProperty = async (id: string, propertyData: Partial<Property>): Promise<Property | null> => {
    setLoading(true);
    setError(null);
    try {
      const existingProperty = await propertyRepository.findById(id);
      if (!existingProperty) {
        throw new Error('Proprietà non trovata');
      }
      const updatedProperty: Property = {
        ...existingProperty,
        ...propertyData,
        updatedAt: new Date(),
      };
      const savedProperty = await propertyRepository.save(updatedProperty);
      setProperties(prev => prev.map(p => p.id === id ? savedProperty : p));
      return savedProperty;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto durante l\'aggiornamento della proprietà');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteProperty = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await propertyRepository.delete(id);
      setProperties(prev => prev.filter(p => p.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto durante l\'eliminazione della proprietà');
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  return {
    properties,
    loading,
    error,
    fetchProperties,
    fetchPropertyById,
    createProperty,
    updateProperty,
    deleteProperty,
  };
};