import api from './api';

export interface BeerDTO {
  id: number;
  name: string;
  type: string;
  brand: string;
  expiryDate: string;
  quantity: number;
  notes?: string;
  userId: number;
}

export interface BeerCreateRequest {
  name: string;
  type: string;
  brand: string;
  expiryDate: string;
  quantity: number;
  notes?: string;
}

export interface BeerUpdateRequest extends BeerCreateRequest {
  id: number;
}

export interface BeerListResponse {
  beers: BeerDTO[];
  total: number;
}

export interface ExpiryTimelineStats {
  expiryBreakdown: {
    expired: number;
    within30Days: number;
    within90Days: number;
    after90Days: number;
  };
  monthlyExpiry: Record<string, number>;
}

export interface StatsSummary {
  totalBeers: number;
  expiredBeers: number;
  expiringSoon: number;
  avgDaysUntilExpiry: number;
  topBeerTypes: Array<{type: string, count: number}>;
}

class BeerService {
  async getAll(): Promise<BeerDTO[]> {
    const response = await api.get<BeerDTO[]>('/beers');
    return response.data;
  }

  async getById(id: number): Promise<BeerDTO> {
    const response = await api.get<BeerDTO>(`/beers/${id}`);
    return response.data;
  }

  async create(beer: BeerCreateRequest): Promise<BeerDTO> {
    const response = await api.post<BeerDTO>('/beers', beer);
    return response.data;
  }

  async update(beer: BeerUpdateRequest): Promise<BeerDTO> {
    const response = await api.put<BeerDTO>(`/beers/${beer.id}`, beer);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await api.delete(`/beers/${id}`);
  }

  async getExpiringSoon(days: number = 7): Promise<BeerDTO[]> {
    const response = await api.get<BeerDTO[]>(`/beers/expiring?days=${days}`);
    return response.data;
  }
  
  async search(query: string): Promise<BeerDTO[]> {
    const response = await api.get<BeerDTO[]>(`/beers/search?query=${encodeURIComponent(query)}`);
    return response.data;
  }

  // Statistics methods
  async getExpiryTimelineStats(): Promise<ExpiryTimelineStats> {
    const response = await api.get<ExpiryTimelineStats>('/beers/stats/expiry-timeline');
    return response.data;
  }

  async getTypeDistribution(): Promise<Record<string, number>> {
    const response = await api.get<Record<string, number>>('/beers/stats/type-distribution');
    return response.data;
  }

  async getBrandDistribution(): Promise<Record<string, number>> {
    const response = await api.get<Record<string, number>>('/beers/stats/brand-distribution');
    return response.data;
  }

  async getStatsSummary(): Promise<StatsSummary> {
    const response = await api.get<StatsSummary>('/beers/stats/summary');
    return response.data;
  }
}

export default new BeerService(); 