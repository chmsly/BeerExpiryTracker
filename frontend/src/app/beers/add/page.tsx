'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { toast } from 'react-toastify';
import { useBeer } from '@/contexts/BeerContext';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function AddBeerPage() {
  const [formData, setFormData] = useState({
    brandName: '',
    productName: '',
    type: '',
    expiryDate: new Date(),
    imageUrl: ''
  });
  const [submitting, setSubmitting] = useState(false);
  
  const router = useRouter();
  const { addBeer } = useBeer();

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
    
    try {
      setSubmitting(true);
      const success = await addBeer(formData);
      
      if (success) {
        toast.success('Beer added successfully');
        router.push('/beers');
      } else {
        toast.error('Failed to add beer');
      }
    } catch (error) {
      console.error('Error adding beer:', error);
      toast.error('An error occurred while adding the beer');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
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
                    href="/beers"
                    className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-amber-600 text-white px-6 py-2 rounded-md hover:bg-amber-700 transition disabled:opacity-50"
                  >
                    {submitting ? 'Adding...' : 'Add Beer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
} 