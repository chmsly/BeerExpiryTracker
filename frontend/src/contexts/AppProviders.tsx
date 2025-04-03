import React, { ReactNode } from 'react';
import { AuthProvider } from './AuthContext';
import { BeerProvider } from './BeerContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <AuthProvider>
      <BeerProvider>
        {children}
        <ToastContainer position="top-right" autoClose={3000} />
      </BeerProvider>
    </AuthProvider>
  );
}; 