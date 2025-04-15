import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import beerService, { BeerDTO, BeerCreateRequest, BeerUpdateRequest } from '@/services/beer.service';
import { toast } from 'react-toastify';

interface BeerContextType {
  beers: BeerDTO[];
  loading: boolean;
  error: string | null;
  refreshBeers: () => Promise<void>;
  getBeer: (id: number) => Promise<BeerDTO | undefined>;
  addBeer: (beer: BeerCreateRequest) => Promise<BeerDTO | undefined>;
  updateBeer: (beer: BeerUpdateRequest) => Promise<BeerDTO | undefined>;
  deleteBeer: (id: number) => Promise<boolean>;
  searchBeers: (query: string) => Promise<void>;
  getExpiringSoon: (days: number) => Promise<BeerDTO[]>;
}

const BeerContext = createContext<BeerContextType | undefined>(undefined);

export function BeerProvider({ children }: { children: ReactNode }) {
  const [beers, setBeers] = useState<BeerDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const refreshBeers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await beerService.getAll();
      setBeers(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch beers';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const getBeer = useCallback(async (id: number): Promise<BeerDTO | undefined> => {
    try {
      return await beerService.getById(id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Failed to fetch beer with ID ${id}`;
      toast.error(errorMessage);
      return undefined;
    }
  }, []);

  const addBeer = useCallback(async (beer: BeerCreateRequest): Promise<BeerDTO | undefined> => {
    try {
      const newBeer = await beerService.create(beer);
      setBeers(prev => [...prev, newBeer]);
      toast.success('Beer added successfully!');
      return newBeer;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add beer';
      toast.error(errorMessage);
      return undefined;
    }
  }, []);

  const updateBeer = useCallback(async (beer: BeerUpdateRequest): Promise<BeerDTO | undefined> => {
    try {
      const updatedBeer = await beerService.update(beer);
      setBeers(prev => prev.map(b => b.id === updatedBeer.id ? updatedBeer : b));
      toast.success('Beer updated successfully!');
      return updatedBeer;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Failed to update beer with ID ${beer.id}`;
      toast.error(errorMessage);
      return undefined;
    }
  }, []);

  const deleteBeer = useCallback(async (id: number): Promise<boolean> => {
    try {
      await beerService.delete(id);
      setBeers(prev => prev.filter(b => b.id !== id));
      toast.success('Beer deleted successfully!');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Failed to delete beer with ID ${id}`;
      toast.error(errorMessage);
      return false;
    }
  }, []);

  const searchBeers = useCallback(async (query: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      if (!query.trim()) {
        await refreshBeers();
        return;
      }
      const data = await beerService.search(query);
      setBeers(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Search failed';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [refreshBeers]);

  const getExpiringSoon = useCallback(async (days: number = 7): Promise<BeerDTO[]> => {
    try {
      return await beerService.getExpiringSoon(days);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch expiring beers';
      toast.error(errorMessage);
      return [];
    }
  }, []);

  const value = {
    beers,
    loading,
    error,
    refreshBeers,
    getBeer,
    addBeer,
    updateBeer,
    deleteBeer,
    searchBeers,
    getExpiringSoon
  };

  return (
    <BeerContext.Provider value={value}>
      {children}
    </BeerContext.Provider>
  );
}

export function useBeer() {
  const context = useContext(BeerContext);
  if (context === undefined) {
    throw new Error('useBeer must be used within a BeerProvider');
  }
  return context;
} 