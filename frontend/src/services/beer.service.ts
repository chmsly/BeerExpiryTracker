import api from './api';

export interface BeerDTO {
  id: string;
  brandName: string;
  productName: string;
  type?: string;
  expiryDate: string;
  imageUrl?: string;
}

export interface BeerFormData {
  brandName: string;
  productName: string;
  type?: string;
  expiryDate: Date;
  image?: File;
}

class BeerService {
  async getAllBeers(): Promise<BeerDTO[]> {
    const response = await api.get<BeerDTO[]>('/beers');
    return response.data;
  }

  async getBeerById(id: string): Promise<BeerDTO> {
    const response = await api.get<BeerDTO>(`/beers/${id}`);
    return response.data;
  }

  async searchBeers(query: string): Promise<BeerDTO[]> {
    const response = await api.get<BeerDTO[]>('/beers/search', {
      params: { query }
    });
    return response.data;
  }

  async getUpcomingExpiringBeers(days: number = 30): Promise<BeerDTO[]> {
    const response = await api.get<BeerDTO[]>('/beers/upcoming', {
      params: { days }
    });
    return response.data;
  }

  async createBeer(beerData: BeerFormData): Promise<BeerDTO> {
    const formData = new FormData();
    formData.append('brandName', beerData.brandName);
    formData.append('productName', beerData.productName);
    
    if (beerData.type) {
      formData.append('type', beerData.type);
    }
    
    formData.append('expiryDate', beerData.expiryDate.toISOString().split('T')[0]);
    
    if (beerData.image) {
      formData.append('image', beerData.image);
    }
    
    const response = await api.post<BeerDTO>('/beers', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  }

  async updateBeer(id: string, beerData: BeerFormData): Promise<BeerDTO> {
    const formData = new FormData();
    formData.append('brandName', beerData.brandName);
    formData.append('productName', beerData.productName);
    
    if (beerData.type) {
      formData.append('type', beerData.type);
    }
    
    formData.append('expiryDate', beerData.expiryDate.toISOString().split('T')[0]);
    
    if (beerData.image) {
      formData.append('image', beerData.image);
    }
    
    const response = await api.put<BeerDTO>(`/beers/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  }

  async deleteBeer(id: string): Promise<boolean> {
    const response = await api.delete(`/beers/${id}`);
    return response.data.success;
  }
}

export default new BeerService(); 