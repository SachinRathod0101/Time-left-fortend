import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import icebreakerService, { CreateIcebreakerData, UpdateIcebreakerData } from '../services/icebreakerService';
import { Icebreaker } from '../services/eventService';
import { useAuth } from './AuthContext';

interface IcebreakerContextType {
  icebreakers: Icebreaker[];
  loading: boolean;
  error: string | null;
  createIcebreaker: (icebreakerData: CreateIcebreakerData) => Promise<Icebreaker | null>;
  updateIcebreaker: (icebreakerId: string, icebreakerData: UpdateIcebreakerData) => Promise<Icebreaker | null>;
  deleteIcebreaker: (icebreakerId: string) => Promise<boolean>;
  addIcebreakerToEvent: (eventId: string, icebreakerId: string) => Promise<boolean>;
  removeIcebreakerFromEvent: (eventId: string, icebreakerId: string) => Promise<boolean>;
  fetchIcebreakers: () => Promise<void>;
  clearError: () => void;
}

const IcebreakerContext = createContext<IcebreakerContextType | undefined>(undefined);

export const useIcebreakers = () => {
  const context = useContext(IcebreakerContext);
  if (context === undefined) {
    throw new Error('useIcebreakers must be used within an IcebreakerProvider');
  }
  return context;
};

interface IcebreakerProviderProps {
  children: ReactNode;
}

export const IcebreakerProvider: React.FC<IcebreakerProviderProps> = ({ children }) => {
  const [icebreakers, setIcebreakers] = useState<Icebreaker[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  // Fetch all icebreakers
  const fetchIcebreakers = async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      setError(null);
      const icebreakersData = await icebreakerService.getAllIcebreakers();
      setIcebreakers(icebreakersData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch icebreakers');
    } finally {
      setLoading(false);
    }
  };

  // Load icebreakers when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchIcebreakers();
    }
  }, [isAuthenticated]);

  // Create a new icebreaker
  const createIcebreaker = async (icebreakerData: CreateIcebreakerData): Promise<Icebreaker | null> => {
    try {
      setLoading(true);
      setError(null);
      const newIcebreaker = await icebreakerService.createIcebreaker(icebreakerData);
      setIcebreakers([...icebreakers, newIcebreaker]);
      return newIcebreaker;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create icebreaker');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update an icebreaker
  const updateIcebreaker = async (icebreakerId: string, icebreakerData: UpdateIcebreakerData): Promise<Icebreaker | null> => {
    try {
      setLoading(true);
      setError(null);
      const updatedIcebreaker = await icebreakerService.updateIcebreaker(icebreakerId, icebreakerData);
      setIcebreakers(icebreakers.map(icebreaker => icebreaker._id === icebreakerId ? updatedIcebreaker : icebreaker));
      return updatedIcebreaker;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update icebreaker');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete an icebreaker
  const deleteIcebreaker = async (icebreakerId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await icebreakerService.deleteIcebreaker(icebreakerId);
      setIcebreakers(icebreakers.filter(icebreaker => icebreaker._id !== icebreakerId));
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete icebreaker');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Add icebreaker to event
  const addIcebreakerToEvent = async (eventId: string, icebreakerId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await icebreakerService.addIcebreakerToEvent(eventId, icebreakerId);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add icebreaker to event');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Remove icebreaker from event
  const removeIcebreakerFromEvent = async (eventId: string, icebreakerId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await icebreakerService.removeIcebreakerFromEvent(eventId, icebreakerId);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to remove icebreaker from event');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  return (
    <IcebreakerContext.Provider
      value={{
        icebreakers,
        loading,
        error,
        createIcebreaker,
        updateIcebreaker,
        deleteIcebreaker,
        addIcebreakerToEvent,
        removeIcebreakerFromEvent,
        fetchIcebreakers,
        clearError,
      }}
    >
      {children}
    </IcebreakerContext.Provider>
  );
};

export default IcebreakerContext;