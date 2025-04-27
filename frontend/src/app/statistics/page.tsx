'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import beerService, { StatsSummary, ExpiryTimelineStats } from '@/services/beer.service';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function StatisticsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<StatsSummary | null>(null);
  const [typeDistribution, setTypeDistribution] = useState<Record<string, number>>({});
  const [brandDistribution, setBrandDistribution] = useState<Record<string, number>>({});
  const [expiryTimeline, setExpiryTimeline] = useState<ExpiryTimelineStats | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        const [summaryData, typeData, brandData, timelineData] = await Promise.all([
          beerService.getStatsSummary(),
          beerService.getTypeDistribution(),
          beerService.getBrandDistribution(),
          beerService.getExpiryTimelineStats()
        ]);
        
        setSummary(summaryData);
        setTypeDistribution(typeData);
        setBrandDistribution(brandData);
        setExpiryTimeline(timelineData);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch statistics:', err);
        setError('Failed to load statistics. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  const typeChartData = {
    labels: Object.keys(typeDistribution),
    datasets: [
      {
        label: 'Beer Types',
        data: Object.values(typeDistribution),
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const brandChartData = {
    labels: Object.keys(brandDistribution),
    datasets: [
      {
        label: 'Beer Brands',
        data: Object.values(brandDistribution),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const expiryBreakdownData = expiryTimeline ? {
    labels: ['Expired', 'Within 30 Days', 'Within 90 Days', 'After 90 Days'],
    datasets: [
      {
        label: 'Expiry Timeline',
        data: [
          expiryTimeline.expiryBreakdown.expired,
          expiryTimeline.expiryBreakdown.within30Days,
          expiryTimeline.expiryBreakdown.within90Days,
          expiryTimeline.expiryBreakdown.after90Days,
        ],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(75, 192, 192, 0.5)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  } : { labels: [], datasets: [] };

  const monthlyExpiryData = expiryTimeline ? {
    labels: Object.keys(expiryTimeline.monthlyExpiry),
    datasets: [
      {
        label: 'Beers Expiring',
        data: Object.values(expiryTimeline.monthlyExpiry),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  } : { labels: [], datasets: [] };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Beer Statistics</h1>
          
          {loading && <p className="text-gray-600">Loading statistics...</p>}
          
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

          {!loading && !error && (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-700">Total Beers</h3>
                  <p className="text-3xl font-bold text-blue-600">{summary?.totalBeers || 0}</p>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-700">Expired Beers</h3>
                  <p className="text-3xl font-bold text-red-600">{summary?.expiredBeers || 0}</p>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-700">Expiring Soon</h3>
                  <p className="text-3xl font-bold text-yellow-600">{summary?.expiringSoon || 0}</p>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-700">Avg Days Until Expiry</h3>
                  <p className="text-3xl font-bold text-green-600">
                    {summary?.avgDaysUntilExpiry ? Math.round(summary.avgDaysUntilExpiry) : 0}
                  </p>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Beer Types Distribution</h3>
                  <div className="h-64">
                    <Pie data={typeChartData} options={{ maintainAspectRatio: false }} />
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Expiry Timeline</h3>
                  <div className="h-64">
                    <Pie data={expiryBreakdownData} options={{ maintainAspectRatio: false }} />
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Top Beer Brands</h3>
                  <div className="h-64">
                    <Bar 
                      data={brandChartData} 
                      options={{ 
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            beginAtZero: true,
                            ticks: {
                              precision: 0
                            }
                          }
                        }
                      }} 
                    />
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Monthly Expiry Forecast</h3>
                  <div className="h-64">
                    <Bar 
                      data={monthlyExpiryData} 
                      options={{ 
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            beginAtZero: true,
                            ticks: {
                              precision: 0
                            }
                          }
                        }
                      }} 
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
} 