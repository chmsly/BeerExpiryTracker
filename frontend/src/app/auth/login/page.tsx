'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      toast.error('Please enter both username and password');
      return;
    }
    
    try {
      setIsSubmitting(true);
      const success = await login(username, password);
      
      if (success) {
        toast.success('Login successful!');
        router.push('/dashboard');
      } else {
        toast.error('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during login. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="bg-gradient-to-b from-amber-50 to-amber-100 py-12 min-h-[calc(100vh-64px-88px)]">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-amber-700 py-4">
            <h2 className="text-2xl font-bold text-center text-white">Log In</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Enter your username"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Enter your password"
                required
              />
            </div>
            
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                  isSubmitting ? 'bg-amber-400' : 'bg-amber-600 hover:bg-amber-700'
                } transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2`}
              >
                {isSubmitting ? 'Logging in...' : 'Log In'}
              </button>
            </div>
            
            <div className="text-center text-gray-600">
              Don't have an account?{' '}
              <Link href="/auth/register" className="text-amber-600 hover:text-amber-800">
                Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
} 