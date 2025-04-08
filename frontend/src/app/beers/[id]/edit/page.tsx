'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { toast } from 'react-toastify';
import { useBeer } from '@/contexts/BeerContext';
import beerService, { BeerDTO } from '@/services/beer.service';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function EditBeerPage() {
  const [beer, setBeer] = useState<BeerDTO | null>(null);
  const [formData, setFormData] = useState({
    brandName: '',
    productName: '',
    type: '',
    expiryDate: new Date(),
    imageUrl: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const params = useParams();
  const router = useRouter();
  const { updateBeer } = useBeer();
  
  const beerId = params.id as string;

  // Load beer details
  useEffect(() => {
    const fetchBeer = async () => {
      if (!beerId) return;
      
      try {
        setLoading(true);
        setError(null);
        const data = await beerService.getBeerById(beerId);
        setBeer(data);
        setFormData({
          brandName: data.brandName,
          productName: data.productName,
          type: data.type || '',
          expiryDate: new Date(data.expiryDate),
          imageUrl: data.imageUrl || ''
        });
      } catch (err) {
        console.error('Error loading beer:', err);
        setError('Failed to load beer details');
        toast.error('Could not load beer details');
      } finally {
        setLoading(false);
      }
    };

    fetchBeer();
  }, [beerId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setFormData(prev => ({
        ...prev,
        expiryDate: date
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!beer) return;
    
    try {
      setSubmitting(true);
      const updatedBeer = {
        ...beer,
        ...formData
      };
      
      const success = await updateBeer(beer.id, formData);
      if (success) {
        toast.success('Beer updated successfully');
        router.push(`/beers/${beer.id}`);
      } else {
        toast.error('Failed to update beer');
      }
    } catch (error) {
      console.error('Error updating beer:', error);
      toast.error('An error occurred while updating the beer');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <Layout>
        {loading ? (
          <div className="min-h-[calc(100vh-64px-88px)] flex items-center justify-center">
            <div className="text-amber-800 text-xl">Loading...</div>
          </div>
        ) : error || !beer ? (
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
        ) : (
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
              
              <div className="bg-white rounded-lg shadow-md overflow-hidden border border-amber-200 p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="brandName" className="block text-sm font-medium text-gray-700 mb-1">
                        Brand Name*
                      </label>
                      <input
                        type="text"
                        id="brandName"
                        name="brandName"
                        value={formData.brandName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">
                        Product Name*
                      </label>
                      <input
                        type="text"
                        id="productName"
                        name="productName"
                        value={formData.productName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                        Type
                      </label>
                      <input
                        type="text"
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="e.g. IPA, Stout, Lager"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Expiry Date*
                      </label>
                      <DatePicker
                        selected={formData.expiryDate}
                        onChange={handleDateChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                        dateFormat="MMMM d, yyyy"
                        minDate={new Date()}
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                        Image URL
                      </label>
                      <input
                        type="url"
                        id="imageUrl"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="https://example.com/beer-image.jpg"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-4 mt-8">
                    <Link
                      href={`/beers/${beer.id}`}
                      className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
                    >
                      Cancel
                    </Link>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="bg-amber-600 text-white px-6 py-2 rounded-md hover:bg-amber-700 transition disabled:opacity-50"
                    >
                      {submitting ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </Layout>
    </ProtectedRoute>
  );
} 