'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4 text-center">
            Beer Inventory Manager
          </h1>
          <p className="text-lg text-slate-600 mb-8 text-center">
            Streamline your store's beer inventory management
          </p>
          
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
              <h2 className="text-xl font-semibold text-slate-800 mb-2">Inventory Control</h2>
              <p className="text-slate-600">
                Track stock levels and manage expiry dates
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
              <h2 className="text-xl font-semibold text-slate-800 mb-2">Smart Alerts</h2>
              <p className="text-slate-600">
                Get notified before products expire
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/auth/login"
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors text-center"
            >
              Login
            </a>
            <a
              href="/auth/register"
              className="px-6 py-2 bg-white text-blue-600 font-medium rounded-md border border-blue-600 hover:bg-blue-50 transition-colors text-center"
            >
              Register
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
