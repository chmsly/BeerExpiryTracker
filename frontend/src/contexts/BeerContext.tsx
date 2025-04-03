import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import beerService, { BeerDTO, BeerFormData } from '../services/beer.service';
import { useAuth } from './AuthContext';

interface BeerContextType {
  beers: BeerDTO[];
  upcomingExpiringBeers: BeerDTO[];
  loading: boolean;
  error: string | null;
  refreshBeers: () => Promise<void>;
  getUpcomingExpiring: (days?: number) => Promise<void>;
  addBeer: (beerData: BeerFormData) => Promise<BeerDTO | null>;
  updateBeer: (id: string, beerData: BeerFormData) => Promise<BeerDTO | null>;
  deleteBeer: (id: string) => Promise<boolean>;
  searchBeers: (query: string) => Promise<void>;
}

const BeerContext = createContext<BeerContextType | undefined>(undefined);

export const useBeer = () => {
  const context = useContext(BeerContext);
  if (context === undefined) {
    throw new Error('useBeer must be used within a BeerProvider');
  }
  return context;
};

interface BeerProviderProps {
  children: ReactNode;
}

export const BeerProvider: React.FC<BeerProviderProps> = ({ children }) => {
  const [beers, setBeers] = useState<BeerDTO[]>([]);
  const [upcomingExpiringBeers, setUpcomingExpiringBeers] = useState<BeerDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  // Load beers when auth state changes
  useEffect(() => {
    if (isAuthenticated) {
      refreshBeers();
      getUpcomingExpiring();
    } else {
      setBeers([]);
      setUpcomingExpiringBeers([]);
    }
  }, [isAuthenticated]);

  const refreshBeers = async (): Promise<void> => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await beerService.getAllBeers();
      setBeers(data);
    } catch (err) {
      setError('Failed to load beers');
      console.error('Error loading beers:', err);
    } finally {
      setLoading(false);
    }
  };

  const getUpcomingExpiring = async (days: number = 30): Promise<void> => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await beerService.getUpcomingExpiringBeers(days);
      setUpcomingExpiringBeers(data);
    } catch (err) {
      setError('Failed to load upcoming expiring beers');
      console.error('Error loading upcoming expiring beers:', err);
    } finally {
      setLoading(false);
    }
  };

  const addBeer = async (beerData: BeerFormData): Promise<BeerDTO | null> => {
    if (!isAuthenticated) return null;
    
    try {
      setLoading(true);
      setError(null);
      const newBeer = await beerService.createBeer(beerData);
      setBeers(prevBeers => [...prevBeers, newBeer]);
      
      // Refresh upcoming expiring beers in case this new beer is expiring soon
      getUpcomingExpiring();
      
      return newBeer;
    } catch (err) {
      setError('Failed to add beer');
      console.error('Error adding beer:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateBeer = async (id: string, beerData: BeerFormData): Promise<BeerDTO | null> => {
    if (!isAuthenticated) return null;
    
    try {
      setLoading(true);
      setError(null);
      const updatedBeer = await beerService.updateBeer(id, beerData);
      
      setBeers(prevBeers => 
        prevBeers.map(beer => beer.id === id ? updatedBeer : beer)
      );
      
      // Refresh upcoming expiring beers in case the update affects their status
      getUpcomingExpiring();
      
      return updatedBeer;
    } catch (err) {
      setError('Failed to update beer');
      console.error('Error updating beer:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteBeer = async (id: string): Promise<boolean> => {
    if (!isAuthenticated) return false;
    
    try {
      setLoading(true);
      setError(null);
      const success = await beerService.deleteBeer(id);
      
      if (success) {
        setBeers(prevBeers => prevBeers.filter(beer => beer.id !== id));
        // Refresh upcoming expiring beers
        getUpcomingExpiring();
      }
      
      return success;
    } catch (err) {
      setError('Failed to delete beer');
      console.error('Error deleting beer:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const searchBeers = async (query: string): Promise<void> => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      setError(null);
      
      if (!query.trim()) {
        // If query is empty, load all beers
        return refreshBeers();
      }
      
      const results = await beerService.searchBeers(query);
      setBeers(results);
    } catch (err) {
      setError('Failed to search beers');
      console.error('Error searching beers:', err);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    beers,
    upcomingExpiringBeers,
    loading,
    error,
    refreshBeers,
    getUpcomingExpiring,
    addBeer,
    updateBeer,
    deleteBeer,
    searchBeers,
  };

  return <BeerContext.Provider value={value}>{children}</BeerContext.Provider>;
}; 