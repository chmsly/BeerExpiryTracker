'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useBeer } from '@/contexts/BeerContext';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { BeerDTO } from '@/services/beer.service';

export default function DashboardPage() {
  const { currentUser } = useAuth();
  const { refreshBeers, getExpiringSoon, loading } = useBeer();
  const [expiringSoon, setExpiringSoon] = useState<BeerDTO[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        refreshBeers();
        const soonToExpire = await getExpiringSoon(7);
        setExpiringSoon(soonToExpire);
      } catch (err) {
        setError('Failed to load dashboard data');
      }
    };

    loadData();
  }, [refreshBeers, getExpiringSoon]);

  return (
    <ProtectedRoute>
      <Layout>
        <div className="bg-gradient-to-b from-amber-50 to-amber-100 min-h-[calc(100vh-64px-88px)]">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-amber-800 mb-2">Dashboard</h1>
                {currentUser && (
                  <p className="text-gray-600">
                    Welcome back, <span className="font-medium">{currentUser.username}</span>
                  </p>
                )}
              </div>
              <Link
                href="/beers/add"
                className="mt-4 md:mt-0 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md transition flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add New Beer
              </Link>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-6">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6 border border-amber-200">
                <h2 className="text-xl font-semibold text-amber-800 mb-2">Quick Actions</h2>
                <div className="space-y-3">
                  <Link
                    href="/beers"
                    className="flex items-center text-amber-700 hover:text-amber-900"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    View All Beers
                  </Link>
                  <Link
                    href="/beers/add"
                    className="flex items-center text-amber-700 hover:text-amber-900"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add New Beer
                  </Link>
                  <Link
                    href="/profile"
                    className="flex items-center text-amber-700 hover:text-amber-900"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    Manage Profile
                  </Link>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 border border-amber-200">
                <h2 className="text-xl font-semibold text-amber-800 mb-2">Beers Expiring Soon</h2>
                {loading ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-600"></div>
                  </div>
                ) : expiringSoon.length > 0 ? (
                  <ul className="space-y-2">
                    {expiringSoon.slice(0, 5).map((beer) => (
                      <li key={beer.id} className="border-b border-gray-100 pb-2 last:border-0">
                        <Link href={`/beers/${beer.id}`} className="hover:text-amber-700">
                          <span className="font-medium">{beer.name}</span>
                          <div className="text-sm text-gray-600">
                            Expires: {new Date(beer.expiryDate).toLocaleDateString()}
                          </div>
                        </Link>
                      </li>
                    ))}
                    {expiringSoon.length > 5 && (
                      <li className="text-center mt-2">
                        <Link href="/beers" className="text-amber-600 hover:text-amber-800 text-sm">
                          View all expiring beers →
                        </Link>
                      </li>
                    )}
                  </ul>
                ) : (
                  <p className="text-gray-600 py-2">No beers expiring soon!</p>
                )}
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 border border-amber-200">
                <h2 className="text-xl font-semibold text-amber-800 mb-2">Tips & Insights</h2>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-600 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Most beers are best consumed fresh for optimal flavor.
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-600 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Store your beer in a cool, dark place for the longest shelf life.
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-600 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Check your inventory weekly to ensure nothing expires unexpectedly.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
} 