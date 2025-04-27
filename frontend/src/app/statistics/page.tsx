'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BeerBottle, Calendar, Clock, TrendingUp, Award, Package, AlertTriangle } from 'lucide-react';
import statisticsService, { StatisticsResponse } from '@/services/statistics.service';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function StatisticsPage() {
  const [statistics, setStatistics] = useState<StatisticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        const data = await statisticsService.getStatistics();
        setStatistics(data);
        setError(null);
      } catch (err) {
        setError('Failed to load statistics. Please try again later.');
        console.error('Error fetching statistics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  return (
    <ProtectedRoute>
      <Layout>
        <div className="container mx-auto py-8">
          <h1 className="text-3xl font-bold mb-6">Beer Statistics</h1>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(7)].map((_, i) => (
                <Card key={i} className="w-full">
                  <CardHeader className="pb-2">
                    <Skeleton className="h-4 w-1/2 mb-2" />
                    <Skeleton className="h-8 w-full" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          ) : statistics ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center space-x-2">
                    <BeerBottle className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">Total Beers</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">{statistics.totalBeers}</p>
                  <p className="text-sm text-gray-500 mt-2">Total beers in your inventory</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-yellow-500" />
                    <CardTitle className="text-lg">Expiring Soon</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">{statistics.beersExpiringInOneWeek}</p>
                  <p className="text-sm text-gray-500 mt-2">Beers expiring within one week</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-blue-500" />
                    <CardTitle className="text-lg">Expiring This Month</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">{statistics.beersExpiringInOneMonth}</p>
                  <p className="text-sm text-gray-500 mt-2">Beers expiring within one month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <CardTitle className="text-lg">Expired</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">{statistics.beersExpired}</p>
                  <p className="text-sm text-gray-500 mt-2">Beers that have already expired</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center space-x-2">
                    <Award className="h-5 w-5 text-purple-500" />
                    <CardTitle className="text-lg">Most Common Brand</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{statistics.mostCommonBrand || 'N/A'}</p>
                  <p className="text-sm text-gray-500 mt-2">Your preferred beer brand</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center space-x-2">
                    <Package className="h-5 w-5 text-green-500" />
                    <CardTitle className="text-lg">Most Common Type</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{statistics.mostCommonType || 'N/A'}</p>
                  <p className="text-sm text-gray-500 mt-2">Your preferred beer type</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-indigo-500" />
                    <CardTitle className="text-lg">Average Days to Expiry</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">{Math.round(statistics.averageDaysToExpiry)}</p>
                  <p className="text-sm text-gray-500 mt-2">Average days until your beers expire</p>
                </CardContent>
              </Card>
            </div>
          ) : null}
        </div>
      </Layout>
    </ProtectedRoute>
  );
} 