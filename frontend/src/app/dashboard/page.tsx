'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { useBeer } from '@/contexts/BeerContext';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function Dashboard() {
  const { loading: authLoading } = useAuth();
  const { 
    beers, 
    upcomingExpiringBeers, 
    loading, 
    error, 
    refreshBeers, 
    getUpcomingExpiring 
  } = useBeer();

  const [expiryDays, setExpiryDays] = useState(30);

  // Load data on mount
  useEffect(() => {
    refreshBeers();
    getUpcomingExpiring(expiryDays);
  }, [expiryDays]); // eslint-disable-line react-hooks/exhaustive-deps

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  // Calculate days until expiry
  const getDaysUntilExpiry = (dateString: string) => {
    const expiryDate = new Date(dateString);
    const today = new Date();
    
    // Clear time part for accurate day calculation
    today.setHours(0, 0, 0, 0);
    expiryDate.setHours(0, 0, 0, 0);
    
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  // Get CSS class for expiry indicator
  const getExpiryClass = (dateString: string) => {
    const days = getDaysUntilExpiry(dateString);
    if (days <= 7) return 'bg-red-100 text-red-800 border-red-300';
    if (days <= 14) return 'bg-orange-100 text-orange-800 border-orange-300';
    return 'bg-yellow-100 text-yellow-800 border-yellow-300';
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="bg-gradient-to-b from-amber-50 to-amber-100 min-h-[calc(100vh-64px-88px)]">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-amber-800 mb-6">Dashboard</h1>
            
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6 border border-amber-200">
                <h2 className="text-xl font-semibold text-amber-800 mb-2">Total Beers</h2>
                <p className="text-3xl font-bold text-amber-600">{beers.length}</p>
                <Link href="/beers" className="text-amber-600 hover:text-amber-800 text-sm mt-2 inline-block">
                  View all beers →
                </Link>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6 border border-amber-200">
                <h2 className="text-xl font-semibold text-amber-800 mb-2">Expiring Soon</h2>
                <p className="text-3xl font-bold text-amber-600">{upcomingExpiringBeers.length}</p>
                <div className="flex items-center mt-2">
                  <label htmlFor="expiryDays" className="text-sm text-gray-600 mr-2">
                    Days:
                  </label>
                  <select
                    id="expiryDays"
                    value={expiryDays}
                    onChange={(e) => setExpiryDays(Number(e.target.value))}
                    className="text-sm border border-gray-300 rounded-md p-1"
                  >
                    <option value={7}>7 days</option>
                    <option value={14}>14 days</option>
                    <option value={30}>30 days</option>
                    <option value={60}>60 days</option>
                    <option value={90}>90 days</option>
                  </select>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6 border border-amber-200">
                <h2 className="text-xl font-semibold text-amber-800 mb-2">Quick Actions</h2>
                <div className="space-y-2">
                  <Link 
                    href="/beers/add" 
                    className="block w-full py-2 px-4 bg-amber-600 text-white rounded-md text-center hover:bg-amber-700 transition text-sm"
                  >
                    Add New Beer
                  </Link>
                  <button 
                    onClick={() => {
                      refreshBeers();
                      getUpcomingExpiring(expiryDays);
                      toast.info('Dashboard refreshed');
                    }}
                    className="block w-full py-2 px-4 bg-amber-100 text-amber-800 border border-amber-300 rounded-md text-center hover:bg-amber-200 transition text-sm"
                  >
                    Refresh Data
                  </button>
                </div>
              </div>
            </div>
            
            {/* Upcoming Expiring Beers */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-amber-200 mb-8">
              <h2 className="text-2xl font-semibold text-amber-800 mb-4">
                Beers Expiring in the Next {expiryDays} Days
              </h2>
              
              {loading ? (
                <p className="text-amber-800">Loading...</p>
              ) : error ? (
                <p className="text-red-600">{error}</p>
              ) : upcomingExpiringBeers.length === 0 ? (
                <p className="text-gray-600">No beers are expiring in the next {expiryDays} days.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-amber-200">
                    <thead className="bg-amber-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                          Brand
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                          Product
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                          Type
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                          Expiry Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-amber-100">
                      {upcomingExpiringBeers.map((beer) => (
                        <tr key={beer.id} className="hover:bg-amber-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                            {beer.brandName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {beer.productName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {beer.type || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {formatDate(beer.expiryDate)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getExpiryClass(beer.expiryDate)}`}>
                              {getDaysUntilExpiry(beer.expiryDate)} days left
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            <div className="flex space-x-2">
                              <Link
                                href={`/beers/${beer.id}`}
                                className="text-amber-600 hover:text-amber-800"
                              >
                                Details
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
} 