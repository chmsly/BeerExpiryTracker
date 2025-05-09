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
          <h1 className="text-5xl font-bold text-amber-400 mb-6">
            Beer Expiry Tracker
          </h1>
          <p className="text-xl text-slate-300 mb-12">
            Keep track of your beer collection and never miss an expiry date again
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <h2 className="text-2xl font-semibold text-amber-400 mb-4">Track Your Collection</h2>
              <p className="text-slate-300">
                Easily manage your beer inventory and monitor expiry dates
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <h2 className="text-2xl font-semibold text-amber-400 mb-4">Get Notifications</h2>
              <p className="text-slate-300">
                Receive alerts when your beers are approaching their expiry date
              </p>
            </div>
          </div>
          
          <div className="space-x-4">
            <a
              href="/auth/login"
              className="inline-block px-8 py-3 bg-amber-500 text-white font-medium rounded-xl hover:bg-amber-600 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              Login
            </a>
            <a
              href="/auth/register"
              className="inline-block px-8 py-3 bg-transparent text-amber-400 font-medium rounded-xl border-2 border-amber-400 hover:bg-amber-400/10 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              Register
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
