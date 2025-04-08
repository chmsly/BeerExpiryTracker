'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { useBeer } from '@/contexts/BeerContext';
import { useAuth } from '@/contexts/AuthContext';
import beerService, { BeerDTO, BeerFormData } from '@/services/beer.service';
import Layout from '@/components/Layout';
import BeerForm from '@/components/BeerForm';

export default function EditBeerPage() {
  const [beer, setBeer] = useState<BeerDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { updateBeer } = useBeer();
  
  const beerId = params.id as string;

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
      toast.info('Please log in to edit beer details');
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

  // Handle form submission
  const handleSubmit = async (formData: BeerFormData) => {
    if (!beer) return;
    
    try {
      setIsSubmitting(true);
      const updatedBeer = await updateBeer(beer.id, formData);
      
      if (updatedBeer) {
        toast.success('Beer updated successfully!');
        router.push(`/beers/${beer.id}`);
      } else {
        toast.error('Failed to update beer');
      }
    } catch (error) {
      console.error('Error updating beer:', error);
      toast.error('An error occurred while updating the beer');
    } finally {
      setIsSubmitting(false);
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
                The beer you are trying to edit doesn't exist or couldn't be loaded.
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

  return (
    <Layout>
      <div className="bg-gradient-to-b from-amber-50 to-amber-100 min-h-[calc(100vh-64px-88px)]">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-6">
            <Link 
              href={`/beers/${beer.id}`}
              className="mr-4 text-amber-600 hover:text-amber-800 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Details
            </Link>
            <h1 className="text-3xl font-bold text-amber-800">Edit Beer</h1>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 border border-amber-200">
            <BeerForm 
              initialData={beer}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
} 