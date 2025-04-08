'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { useBeer } from '@/contexts/BeerContext';
import { useAuth } from '@/contexts/AuthContext';
import beerService, { BeerDTO } from '@/services/beer.service';
import Layout from '@/components/Layout';

export default function BeerDetailsPage() {
  const [beer, setBeer] = useState<BeerDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { deleteBeer } = useBeer();
  
  const beerId = params.id as string;

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
      toast.info('Please log in to view beer details');
    }
  }, [authLoading, isAuthenticated, router]);

  // Load beer details
  useEffect(() => {
    const fetchBeer = async () => {
      if (!isAuthenticated || !beerId) return;
      
      try {
        setLoading(true);
        setError(null);
        const data = await beerService.getBeerById(beerId);
        setBeer(data);
      } catch (err) {
        console.error('Error loading beer:', err);
        setError('Failed to load beer details');
        toast.error('Could not load beer details');
      } finally {
        setLoading(false);
      }
    };

    fetchBeer();
  }, [beerId, isAuthenticated]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
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

  // Get expiry status text and class
  const getExpiryStatus = (dateString: string) => {
    const days = getDaysUntilExpiry(dateString);
    
    if (days <= 0) {
      return {
        text: 'Expired',
        cssClass: 'bg-red-100 text-red-800 border-red-300'
      };
    } else if (days <= 7) {
      return {
        text: `Expiring soon (${days} days)`,
        cssClass: 'bg-red-100 text-red-800 border-red-300'
      };
    } else if (days <= 14) {
      return {
        text: `Expiring in ${days} days`,
        cssClass: 'bg-orange-100 text-orange-800 border-orange-300'
      };
    } else if (days <= 30) {
      return {
        text: `Expiring in ${days} days`,
        cssClass: 'bg-yellow-100 text-yellow-800 border-yellow-300'
      };
    } else {
      return {
        text: `Expires in ${days} days`,
        cssClass: 'bg-green-100 text-green-800 border-green-300'
      };
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!beer) return;
    
    try {
      const success = await deleteBeer(beer.id);
      if (success) {
        toast.success('Beer deleted successfully');
        router.push('/beers');
      } else {
        toast.error('Failed to delete beer');
      }
    } catch (error) {
      console.error('Error deleting beer:', error);
      toast.error('An error occurred while deleting the beer');
    }
  };

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="min-h-[calc(100vh-64px-88px)] flex items-center justify-center">
          <div className="text-amber-800 text-xl">Loading...</div>
        </div>
      </Layout>
    );
  }

  if (error || !beer) {
    return (
      <Layout>
        <div className="bg-gradient-to-b from-amber-50 to-amber-100 min-h-[calc(100vh-64px-88px)]">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center mb-6">
              <Link 
                href="/beers"
                className="mr-4 text-amber-600 hover:text-amber-800 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to Beers
              </Link>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 border border-amber-200 text-center">
              <h2 className="text-2xl font-semibold text-amber-800 mb-4">Beer Not Found</h2>
              <p className="text-gray-600 mb-6">
                The beer you are looking for doesn't exist or couldn't be loaded.
              </p>
              <Link
                href="/beers"
                className="bg-amber-600 text-white px-6 py-2 rounded-md hover:bg-amber-700 transition"
              >
                Go Back to Beer Collection
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const expiryStatus = getExpiryStatus(beer.expiryDate);

  return (
    <Layout>
      <div className="bg-gradient-to-b from-amber-50 to-amber-100 min-h-[calc(100vh-64px-88px)]">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-6">
            <Link 
              href="/beers"
              className="mr-4 text-amber-600 hover:text-amber-800 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Beers
            </Link>
            <h1 className="text-3xl font-bold text-amber-800">Beer Details</h1>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-amber-200">
            <div className="md:flex">
              <div className="md:w-1/3 bg-amber-100 flex items-center justify-center p-6">
                {beer.imageUrl ? (
                  <img
                    src={beer.imageUrl}
                    alt={`${beer.brandName} ${beer.productName}`}
                    className="max-h-72 max-w-full object-contain"
                  />
                ) : (
                  <div className="text-amber-400 text-8xl">🍺</div>
                )}
              </div>
              
              <div className="md:w-2/3 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-3xl font-bold text-amber-800">{beer.brandName}</h2>
                    <p className="text-xl text-gray-700">{beer.productName}</p>
                  </div>
                  
                  <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full border ${expiryStatus.cssClass}`}>
                    {expiryStatus.text}
                  </span>
                </div>
                
                <div className="mt-6 space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-amber-700">Type</h3>
                    <p className="text-gray-700">{beer.type || 'Not specified'}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-amber-700">Expiry Date</h3>
                    <p className="text-gray-700">{formatDate(beer.expiryDate)}</p>
                  </div>
                </div>
                
                <div className="mt-8 flex space-x-4">
                  <Link
                    href={`/beers/${beer.id}/edit`}
                    className="bg-amber-600 text-white px-6 py-2 rounded-md hover:bg-amber-700 transition"
                  >
                    Edit
                  </Link>
                  
                  {!confirmDelete ? (
                    <button
                      onClick={() => setConfirmDelete(true)}
                      className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleDelete}
                        className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setConfirmDelete(false)}
                        className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 