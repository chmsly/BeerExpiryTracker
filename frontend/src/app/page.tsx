'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <Layout>
      <div className="bg-gradient-to-b from-amber-50 to-amber-100 min-h-[calc(100vh-64px-88px)]">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md border border-amber-200">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-amber-800 mb-4">Welcome to Beer Expiry Tracker</h1>
              <p className="text-xl text-gray-600">
                The easy way to keep track of your beer collection and never let a good beer go to waste.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="p-6 bg-amber-50 rounded-lg border border-amber-200">
                <h2 className="text-2xl font-bold text-amber-700 mb-3">
                  <span className="mr-2">🍺</span> Track Your Collection
                </h2>
                <p className="text-gray-700 mb-4">
                  Add your beers to your personal inventory and keep track of their expiration dates, types, and more.
                </p>
              </div>
              
              <div className="p-6 bg-amber-50 rounded-lg border border-amber-200">
                <h2 className="text-2xl font-bold text-amber-700 mb-3">
                  <span className="mr-2">⏰</span> Never Miss an Expiry Date
                </h2>
                <p className="text-gray-700 mb-4">
                  Receive notifications about upcoming expiry dates so you can enjoy your beers at their best.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col items-center justify-center space-y-4">
              <h2 className="text-2xl font-semibold text-amber-800 mb-2">Get Started Today</h2>
              <div className="flex space-x-4">
                <Link
                  href="/auth/login"
                  className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-md font-medium transition"
                >
                  Log In
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-white hover:bg-amber-50 text-amber-700 border border-amber-600 px-6 py-3 rounded-md font-medium transition"
                >
                  Register
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
