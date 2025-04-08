'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { useBeer } from '@/contexts/BeerContext';
import { useAuth } from '@/contexts/AuthContext';
import { BeerFormData } from '@/services/beer.service';
import Layout from '@/components/Layout';
import BeerForm from '@/components/BeerForm';

export default function AddBeerPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { addBeer } = useBeer();

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
      toast.info('Please log in to add beers');
    }
  }, [authLoading, isAuthenticated, router]);

  // Handle form submission
  const handleSubmit = async (formData: BeerFormData) => {
    try {
      setIsSubmitting(true);
      const newBeer = await addBeer(formData);
      
      if (newBeer) {
        toast.success('Beer added successfully!');
        router.push('/beers');
      } else {
        toast.error('Failed to add beer');
      }
    } catch (error) {
      console.error('Error adding beer:', error);
      toast.error('An error occurred while adding the beer');
    } finally {
      setIsSubmitting(false);
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
            <h1 className="text-3xl font-bold text-amber-800">Add New Beer</h1>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 border border-amber-200">
            <BeerForm 
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
} 