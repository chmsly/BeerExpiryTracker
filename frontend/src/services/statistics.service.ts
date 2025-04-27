'use client';

import api from './api';

export interface StatisticsResponse {
  totalBeers: number;
  beersExpiringInOneWeek: number;
  beersExpiringInOneMonth: number;
  beersExpired: number;
  mostCommonBrand: string;
  mostCommonType: string;
  averageDaysToExpiry: number;
}

class StatisticsService {
  async getStatistics(): Promise<StatisticsResponse> {
    try {
      const response = await api.get('/statistics');
      return response.data;
    } catch (error) {
      console.error('Error fetching statistics:', error);
      // Return mock data in development or when API fails
      if (process.env.NODE_ENV === 'development') {
        console.log('Using mock statistics data');
        return {
          totalBeers: 15,
          beersExpiringInOneWeek: 3,
          beersExpiringInOneMonth: 7,
          beersExpired: 2,
          mostCommonBrand: 'Sierra Nevada',
          mostCommonType: 'IPA',
          averageDaysToExpiry: 45
        };
      }
      throw error;
    }
  }
}

export default new StatisticsService(); 