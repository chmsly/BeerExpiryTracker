'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { useBeer } from '@/contexts/BeerContext';
import { useAuth } from '@/contexts/AuthContext';
import { BeerDTO } from '@/services/beer.service';
import Layout from '@/components/Layout';

export default function BeersPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { beers, loading, error, refreshBeers, deleteBeer, searchBeers } = useBeer();
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
      toast.info('Please log in to view your beers');
    }
  }, [authLoading, isAuthenticated, router]);

  // Load beers on mount
  useEffect(() => {
    if (isAuthenticated) {
      refreshBeers();
    }
  }, [isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps

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
    if (days <= 7) return 'bg-red-100 text-red-800';
    if (days <= 14) return 'bg-orange-100 text-orange-800';
    if (days <= 30) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  // Handler for search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchBeers(searchQuery);
  };

  // Handler for delete beer
  const handleDeleteBeer = async (id: string) => {
    try {
      const success = await deleteBeer(id);
      if (success) {
        toast.success('Beer deleted successfully');
        setConfirmDelete(null);
      } else {
        toast.error('Failed to delete beer');
      }
    } catch (error) {
      console.error('Error deleting beer:', error);
      toast.error('An error occurred while deleting the beer');
    }
  };

  if (authLoading) {
    return (
      <Layout>
        <div className="min-h-[calc(100vh-64px-88px)] flex items-center justify-center">
          <div className="text-amber-800 text-xl">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gradient-to-b from-amber-50 to-amber-100 min-h-[calc(100vh-64px-88px)]">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h1 className="text-3xl font-bold text-amber-800 mb-4 md:mb-0">My Beer Collection</h1>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <form onSubmit={handleSearch} className="flex">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search beers..."
                  className="px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button
                  type="submit"
                  className="bg-amber-600 text-white px-4 py-2 rounded-r-md hover:bg-amber-700 transition"
                >
                  Search
                </button>
              </form>
              
              <Link 
                href="/beers/add" 
                className="bg-amber-600 text-white px-6 py-2 rounded-md hover:bg-amber-700 transition text-center"
              >
                Add Beer
              </Link>
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="text-amber-800 text-xl">Loading beers...</div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-red-600">{error}</div>
              <button
                onClick={() => refreshBeers()}
                className="mt-4 bg-amber-600 text-white px-6 py-2 rounded-md hover:bg-amber-700 transition"
              >
                Try Again
              </button>
            </div>
          ) : beers.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md border border-amber-200">
              <h2 className="text-2xl font-semibold text-amber-800 mb-4">No Beers Found</h2>
              <p className="text-gray-600 mb-6">
                You haven't added any beers to your collection yet.
              </p>
              <Link
                href="/beers/add"
                className="bg-amber-600 text-white px-6 py-2 rounded-md hover:bg-amber-700 transition"
              >
                Add Your First Beer
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {beers.map((beer) => (
                <div key={beer.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-amber-200">
                  <div className="h-48 bg-amber-100 flex items-center justify-center">
                    {beer.imageUrl ? (
                      <img
                        src={beer.imageUrl}
                        alt={`${beer.brandName} ${beer.productName}`}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <div className="text-amber-400 text-4xl">🍺</div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-xl font-semibold text-amber-800">{beer.brandName}</h2>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getExpiryClass(beer.expiryDate)}`}>
                        {getDaysUntilExpiry(beer.expiryDate)} days
                      </span>
                    </div>
                    
                    <p className="text-gray-700 text-lg mb-2">{beer.productName}</p>
                    <p className="text-gray-600 text-sm mb-2">Type: {beer.type || 'Not specified'}</p>
                    <p className="text-gray-600 text-sm mb-4">Expires: {formatDate(beer.expiryDate)}</p>
                    
                    <div className="flex justify-between pt-2 border-t border-amber-100">
                      <Link
                        href={`/beers/${beer.id}`}
                        className="text-amber-600 hover:text-amber-800"
                      >
                        Details
                      </Link>
                      
                      <div className="flex space-x-4">
                        <Link
                          href={`/beers/${beer.id}/edit`}
                          className="text-amber-600 hover:text-amber-800"
                        >
                          Edit
                        </Link>
                        
                        {confirmDelete === beer.id ? (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleDeleteBeer(beer.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setConfirmDelete(null)}
                              className="text-gray-600 hover:text-gray-800"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDelete(beer.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
} 