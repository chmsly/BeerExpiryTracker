'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useBeer } from '@/contexts/BeerContext';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function BeersPage() {
  const { beers, loading, error, refreshBeers, searchBeers, deleteBeer } = useBeer();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' } | null>(null);
  
  useEffect(() => {
    refreshBeers();
  }, [refreshBeers]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchBeers(searchQuery);
  };
  
  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this beer?')) {
      setIsDeleting(true);
      try {
        const success = await deleteBeer(id);
        if (success) {
          refreshBeers();
        }
      } finally {
        setIsDeleting(false);
      }
    }
  };
  
  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    
    if (
      sortConfig && 
      sortConfig.key === key && 
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending';
    }
    
    setSortConfig({ key, direction });
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };
  
  const getExpiryStatus = (dateString: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const expiryDate = new Date(dateString);
    expiryDate.setHours(0, 0, 0, 0);
    
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { text: 'Expired', class: 'bg-red-100 text-red-800' };
    } else if (diffDays <= 7) {
      return { text: 'Soon', class: 'bg-orange-100 text-orange-800' };
    } else if (diffDays <= 30) {
      return { text: 'Upcoming', class: 'bg-yellow-100 text-yellow-800' };
    } else {
      return { text: 'Good', class: 'bg-green-100 text-green-800' };
    }
  };
  
  const sortedBeers = [...beers];
  
  if (sortConfig !== null) {
    sortedBeers.sort((a, b) => {
      const key = sortConfig.key as keyof typeof a;
      
      let aValue = a[key];
      let bValue = b[key];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (aValue === undefined || aValue === null) return sortConfig.direction === 'ascending' ? -1 : 1;
      if (bValue === undefined || bValue === null) return sortConfig.direction === 'ascending' ? 1 : -1;
      
      if (aValue < bValue) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }
  
  return (
    <ProtectedRoute>
      <Layout>
        <div className="bg-gradient-to-b from-amber-50 to-amber-100 min-h-[calc(100vh-64px-88px)]">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <h1 className="text-3xl font-bold text-amber-800 mb-4 md:mb-0">My Beer Collection</h1>
              
              <div className="flex space-x-2">
                <form onSubmit={handleSearch} className="flex">
                  <input
                    type="text"
                    placeholder="Search beers..."
                    className="px-4 py-2 border border-amber-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
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
                  className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md transition flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Beer
                </Link>
              </div>
            </div>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
                <div className="text-amber-800 text-xl mt-4">Loading beers...</div>
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
                  {searchQuery 
                    ? "No beers matched your search. Try a different query or clear the search."
                    : "You haven't added any beers to your collection yet."}
                </p>
                {searchQuery ? (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      refreshBeers();
                    }}
                    className="bg-amber-600 text-white px-6 py-2 rounded-md hover:bg-amber-700 transition"
                  >
                    Clear Search
                  </button>
                ) : (
                  <Link
                    href="/beers/add"
                    className="bg-amber-600 text-white px-6 py-2 rounded-md hover:bg-amber-700 transition"
                  >
                    Add Your First Beer
                  </Link>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md border border-amber-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-amber-200">
                    <thead className="bg-amber-50">
                      <tr>
                        <th 
                          scope="col" 
                          className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider cursor-pointer"
                          onClick={() => requestSort('name')}
                        >
                          Name
                          {sortConfig?.key === 'name' && (
                            <span className="ml-1">
                              {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                            </span>
                          )}
                        </th>
                        <th 
                          scope="col" 
                          className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider cursor-pointer"
                          onClick={() => requestSort('type')}
                        >
                          Type
                          {sortConfig?.key === 'type' && (
                            <span className="ml-1">
                              {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                            </span>
                          )}
                        </th>
                        <th 
                          scope="col" 
                          className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider cursor-pointer"
                          onClick={() => requestSort('brand')}
                        >
                          Brand
                          {sortConfig?.key === 'brand' && (
                            <span className="ml-1">
                              {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                            </span>
                          )}
                        </th>
                        <th 
                          scope="col" 
                          className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider cursor-pointer"
                          onClick={() => requestSort('expiryDate')}
                        >
                          Expiry Date
                          {sortConfig?.key === 'expiryDate' && (
                            <span className="ml-1">
                              {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                            </span>
                          )}
                        </th>
                        <th 
                          scope="col" 
                          className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider cursor-pointer"
                          onClick={() => requestSort('quantity')}
                        >
                          Quantity
                          {sortConfig?.key === 'quantity' && (
                            <span className="ml-1">
                              {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                            </span>
                          )}
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-amber-100">
                      {sortedBeers.map((beer) => {
                        const status = getExpiryStatus(beer.expiryDate);
                        return (
                          <tr key={beer.id} className="hover:bg-amber-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{beer.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-700">{beer.type || '-'}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-700">{beer.brand}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-700">{formatDate(beer.expiryDate)}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-700">{beer.quantity}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${status.class}`}>
                                {status.text}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                              <Link
                                href={`/beers/${beer.id}`}
                                className="text-amber-600 hover:text-amber-900"
                              >
                                View
                              </Link>
                              <Link
                                href={`/beers/edit/${beer.id}`}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                Edit
                              </Link>
                              <button
                                onClick={() => handleDelete(beer.id)}
                                disabled={isDeleting}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
} 