'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';

interface Beer {
  id: string;
  name: string;
  brewery: string;
  style: string;
  expiryDate: string;
  daysUntilExpiry: number;
}

export default function HomePage() {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBeer, setEditingBeer] = useState<Beer | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    brewery: '',
    style: '',
    expiryDate: '',
  });

  // Development mode flag
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Mock data for development
  const beers: Beer[] = isDevelopment ? [
    {
      id: '1',
      name: 'Test Beer 1',
      brewery: 'Test Brewery',
      style: 'IPA',
      expiryDate: '2024-12-31',
      daysUntilExpiry: 30,
    },
    {
      id: '2',
      name: 'Test Beer 2',
      brewery: 'Test Brewery',
      style: 'Stout',
      expiryDate: '2024-06-30',
      daysUntilExpiry: 5,
    },
  ] : [];

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/auth/login');
  };

  const handleEdit = (beer: Beer) => {
    setEditingBeer(beer);
    setFormData({
      name: beer.name,
      brewery: beer.brewery,
      style: beer.style,
      expiryDate: beer.expiryDate,
    });
    setShowAddModal(true);
  };

  const handleDelete = async (id: string) => {
    // TODO: Implement delete functionality
    console.log('Delete beer:', id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement add/edit functionality
    console.log('Form submitted:', formData);
    setShowAddModal(false);
    setEditingBeer(null);
    setFormData({
      name: '',
      brewery: '',
      style: '',
      expiryDate: '',
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Beer Expiry Tracker</h1>
            <p className="text-gray-600 mt-1">Track your beer collection and never miss an expiry date</p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Beer
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>

        {isDevelopment && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-md">
            <div className="text-sm text-gray-600">
              <strong className="text-blue-600">Development Mode:</strong>
              <p className="mt-2">
                Using test data. In production, this would show your actual beer collection.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {beers.map((beer) => (
            <div
              key={beer.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-gray-900">{beer.name}</h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  beer.daysUntilExpiry <= 7
                    ? 'bg-red-100 text-red-800'
                    : beer.daysUntilExpiry <= 30
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {beer.daysUntilExpiry} days left
                </span>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <p>Brewery: {beer.brewery}</p>
                <p>Style: {beer.style}</p>
                <p>Expiry: {new Date(beer.expiryDate).toLocaleDateString()}</p>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={() => handleEdit(beer)}
                  className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(beer.id)}
                  className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {editingBeer ? 'Edit Beer' : 'Add New Beer'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Beer Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label htmlFor="brewery" className="block text-sm font-medium text-gray-700 mb-1">
                  Brewery
                </label>
                <input
                  id="brewery"
                  type="text"
                  value={formData.brewery}
                  onChange={(e) => setFormData({ ...formData, brewery: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label htmlFor="style" className="block text-sm font-medium text-gray-700 mb-1">
                  Style
                </label>
                <input
                  id="style"
                  type="text"
                  value={formData.style}
                  onChange={(e) => setFormData({ ...formData, style: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date
                </label>
                <input
                  id="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  {editingBeer ? 'Save Changes' : 'Add Beer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
