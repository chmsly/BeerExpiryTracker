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
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-blue-400 mb-6">
            Beer Inventory Manager
          </h1>
          <p className="text-xl text-slate-300 mb-12">
            Streamline your store's beer inventory management and prevent product waste
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <h2 className="text-2xl font-semibold text-blue-400 mb-4">Inventory Control</h2>
              <p className="text-slate-300">
                Track stock levels, manage expiry dates, and optimize your beer inventory
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <h2 className="text-2xl font-semibold text-blue-400 mb-4">Smart Alerts</h2>
              <p className="text-slate-300">
                Get notified before products expire, helping you maintain product quality and reduce waste
              </p>
            </div>
          </div>
          
          <div className="space-x-4">
            <a
              href="/auth/login"
              className="inline-block px-8 py-3 bg-blue-500 text-white font-medium rounded-xl hover:bg-blue-600 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              Login
            </a>
            <a
              href="/auth/register"
              className="inline-block px-8 py-3 bg-transparent text-blue-400 font-medium rounded-xl border-2 border-blue-400 hover:bg-blue-400/10 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              Register
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
