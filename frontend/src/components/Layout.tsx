import React, { ReactNode } from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <footer className="bg-amber-800 text-amber-100 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold">Beer Expiry Tracker</h3>
              <p className="text-sm mt-1">Keep track of your beer collection and expiration dates</p>
            </div>
            <div className="text-sm">
              &copy; {new Date().getFullYear()} Beer Expiry Tracker. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 