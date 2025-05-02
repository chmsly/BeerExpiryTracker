'use client';

import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-mountain-blue to-white">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-6">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
} 