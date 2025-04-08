'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useAuth } from '@/contexts/AuthContext';
import Layout from './Layout';

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
  message?: string;
}

export default function ProtectedRoute({
  children,
  redirectTo = '/auth/login',
  message = 'Please log in to access this page'
}: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(redirectTo);
      toast.info(message);
    }
  }, [isAuthenticated, loading, router, redirectTo, message]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[calc(100vh-64px-88px)] flex items-center justify-center">
          <div className="text-amber-800 text-xl">Loading...</div>
        </div>
      </Layout>
    );
  }

  // Only render children if authenticated
  return isAuthenticated ? <>{children}</> : null;
} 