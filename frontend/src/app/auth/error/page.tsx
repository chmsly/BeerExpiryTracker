'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string>('Authentication error');
  
  useEffect(() => {
    const message = searchParams.get('error');
    if (message) {
      setErrorMessage(decodeURIComponent(message));
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
          <div className="mb-4 p-4 bg-red-50 rounded-md border border-red-200">
            <p className="text-red-700">{errorMessage}</p>
          </div>
          <p className="mb-6 text-gray-600">
            There was a problem with your authentication. Please try again or contact support if the issue persists.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/auth/login"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Back to Login
            </Link>
            <Link
              href="/"
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 