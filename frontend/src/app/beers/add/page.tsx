'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { toast } from 'react-toastify';
import { useBeer } from '@/contexts/BeerContext';
import { BeerCreateRequest } from '@/services/beer.service';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function AddBeerPage() {
  const router = useRouter();
  const { addBeer } = useBeer();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<BeerCreateRequest>({
    name: '',
    type: '',
    brand: '',
    quantity: 1,
    expiryDate: new Date().toISOString().split('T')[0],
    notes: ''
  });
  
  const [expiryDate, setExpiryDate] = useState<Date | null>(new Date());
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numberValue = parseInt(value, 10);
    
    if (!isNaN(numberValue) && numberValue > 0) {
      setFormData(prev => ({
        ...prev,
        [name]: numberValue
      }));
    }
  };
  
  const handleDateChange = (date: Date | null) => {
    setExpiryDate(date);
    if (date) {
      setFormData(prev => ({
        ...prev,
        expiryDate: date.toISOString().split('T')[0]
      }));
    }
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.brand || !formData.expiryDate) {
      setError('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const newBeer = await addBeer(formData);
      if (newBeer) {
        toast.success('Beer added successfully');
        router.push('/beers');
      } else {
        setError('Failed to add beer. Please try again.');
      }
    } catch (err) {
      setError('An error occurred while adding the beer');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <ProtectedRoute>
      <Layout>
        <div className="bg-gradient-to-b from-amber-50 to-amber-100 min-h-[calc(100vh-64px-88px)]">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md border border-amber-200">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-amber-800">Add New Beer</h1>
                <Link 
                  href="/beers" 
                  className="text-amber-600 hover:text-amber-800 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to List
                </Link>
              </div>
              
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-6">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
                      Brand <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="brand"
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                      Type
                    </label>
                    <select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="">Select Type</option>
                      <option value="Lager">Lager</option>
                      <option value="IPA">IPA</option>
                      <option value="Stout">Stout</option>
                      <option value="Porter">Porter</option>
                      <option value="Ale">Ale</option>
                      <option value="Wheat">Wheat</option>
                      <option value="Pilsner">Pilsner</option>
                      <option value="Sour">Sour</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity
                    </label>
                    <input
                      id="quantity"
                      type="number"
                      name="quantity"
                      min="1"
                      value={formData.quantity}
                      onChange={handleNumberChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Date <span className="text-red-500">*</span>
                    </label>
                    <DatePicker
                      id="expiryDate"
                      selected={expiryDate}
                      onChange={handleDateChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                      dateFormat="yyyy-MM-dd"
                      minDate={new Date()}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Additional information about this beer..."
                  />
                </div>
                
                <div className="flex justify-end space-x-4">
                  <Link 
                    href="/beers"
                    className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition disabled:bg-amber-400"
                  >
                    {isSubmitting ? 'Adding...' : 'Add Beer'}
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