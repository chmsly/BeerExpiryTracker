'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-toastify';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const isDevelopment = process.env.NODE_ENV === 'development';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await login({ email, password });
      
      if (success) {
        toast.success('Login successful!');
        router.push('/dashboard');
      } else {
        if (isDevelopment) {
          toast.error('Login failed. In development mode, use test@example.com / password');
        } else {
          toast.error('Invalid email or password. Please try again.');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="max-w-md w-full p-8 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20">
        <h1 className="text-3xl font-bold text-center text-amber-400 mb-8">Welcome Back</h1>
        
        {isDevelopment && (
          <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
            <div className="text-sm text-amber-200">
              <strong className="text-amber-400">Development Mode:</strong>
              <div className="mt-2 space-y-1">
                <div className="flex items-center">
                  <span className="font-medium mr-2">Email:</span>
                  <code className="bg-slate-800/50 px-3 py-1 rounded text-amber-200">test@example.com</code>
                </div>
                <div className="flex items-center">
                  <span className="font-medium mr-2">Password:</span>
                  <code className="bg-slate-800/50 px-3 py-1 rounded text-amber-200">password</code>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-amber-200 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white placeholder-slate-400 transition-all"
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-amber-200 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white placeholder-slate-400 transition-all"
              placeholder="Enter your password"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-xl text-white font-medium transition-all duration-200 ${
              isLoading
                ? 'bg-amber-500/50 cursor-not-allowed'
                : 'bg-amber-500 hover:bg-amber-600 hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </div>
            ) : 'Login'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-slate-300">
            Don't have an account?{' '}
            <Link href="/auth/register" className="text-amber-400 hover:text-amber-300 font-medium transition-colors">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 