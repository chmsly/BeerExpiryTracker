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
        <div className="bg-white min-h-[calc(100vh-64px-88px)]">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
                {currentUser && (
                  <p className="text-gray-600">
                    Welcome back, <span className="font-medium">{currentUser.username}</span>
                  </p>
                )}
              </div>
              <Link
                href="/beers/add"
                className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition flex items-center"
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Quick Actions</h2>
                <div className="space-y-3">
                  <Link
                    href="/beers"
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    View All Beers
                  </Link>
                  <Link
                    href="/beers/add"
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add New Beer
                  </Link>
                  <Link
                    href="/profile"
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    Manage Profile
                  </Link>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Beers Expiring Soon</h2>
                {loading ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                  </div>
                ) : expiringSoon.length > 0 ? (
                  <ul className="space-y-2">
                    {expiringSoon.slice(0, 5).map((beer) => (
                      <li key={beer.id} className="border-b border-gray-100 pb-2 last:border-0">
                        <Link href={`/beers/${beer.id}`} className="hover:text-blue-600">
                          <span className="font-medium">{beer.productName}</span>
                          <div className="text-sm text-gray-600">
                            Expires: {new Date(beer.expiryDate).toLocaleDateString()}
                          </div>
                        </Link>
                      </li>
                    ))}
                    {expiringSoon.length > 5 && (
                      <li className="text-center mt-2">
                        <Link href="/beers" className="text-blue-600 hover:text-blue-800 text-sm">
                          View all expiring beers →
                        </Link>
                      </li>
                    )}
                  </ul>
                ) : (
                  <p className="text-gray-600 py-2">No beers expiring soon!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
} 