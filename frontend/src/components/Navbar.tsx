'use client';

import { useState, Fragment } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, Transition } from '@headlessui/react';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, currentUser, logout } = useAuth();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="bg-amber-800">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-white text-xl font-bold">🍺 BeerExpiryTracker</span>
            </Link>
            
            {/* Desktop menu */}
            <div className="hidden md:ml-6 md:flex md:space-x-4">
              {isAuthenticated && (
                <>
                  <Link 
                    href="/dashboard" 
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      isActive('/dashboard') 
                        ? 'bg-amber-900 text-white' 
                        : 'text-amber-100 hover:bg-amber-700'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    href="/beers" 
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      isActive('/beers') || pathname.startsWith('/beers/') 
                        ? 'bg-amber-900 text-white' 
                        : 'text-amber-100 hover:bg-amber-700'
                    }`}
                  >
                    My Beers
                  </Link>
                  <Link 
                    href="/statistics" 
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      isActive('/statistics')
                        ? 'bg-amber-900 text-white' 
                        : 'text-amber-100 hover:bg-amber-700'
                    }`}
                  >
                    Statistics
                  </Link>
                </>
              )}
            </div>
          </div>
          
          {/* Desktop auth buttons */}
          <div className="hidden md:ml-6 md:flex md:items-center">
            {isAuthenticated ? (
              <Menu as="div" className="relative ml-3">
                <div>
                  <Menu.Button className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-amber-100">
                    <span className="bg-amber-700 rounded-full p-2 text-amber-100 hover:bg-amber-600">
                      {currentUser?.username ? currentUser.username.charAt(0).toUpperCase() : 'U'}
                    </span>
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white py-1 focus:outline-none z-10">
                    {currentUser && (
                      <div className="px-4 py-2 border-b">
                        <p className="text-sm font-medium text-gray-700">{currentUser.username}</p>
                        <p className="text-xs text-gray-500">{currentUser.email}</p>
                      </div>
                    )}
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          href="/profile"
                          className={`block px-4 py-2 text-sm ${
                            active ? 'bg-amber-100 text-amber-800' : 'text-gray-700'
                          }`}
                        >
                          My Profile
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          href="/settings"
                          className={`block px-4 py-2 text-sm ${
                            active ? 'bg-amber-100 text-amber-800' : 'text-gray-700'
                          }`}
                        >
                          Settings
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={logout}
                          className={`block px-4 py-2 text-sm w-full text-left ${
                            active ? 'bg-amber-100 text-amber-800' : 'text-gray-700'
                          }`}
                        >
                          Sign out
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            ) : (
              <div className="flex space-x-2">
                <Link
                  href="/auth/login"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/auth/login') 
                      ? 'bg-amber-900 text-white' 
                      : 'text-amber-100 hover:bg-amber-700'
                  }`}
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/auth/register') 
                      ? 'bg-amber-900 text-white' 
                      : 'text-amber-100 hover:bg-amber-700'
                  }`}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-amber-100 hover:text-white hover:bg-amber-700 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon for menu (hamburger or X) */}
              {isMobileMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          {isAuthenticated ? (
            <>
              <Link 
                href="/dashboard" 
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/dashboard') 
                    ? 'bg-amber-900 text-white' 
                    : 'text-amber-100 hover:bg-amber-700'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link 
                href="/beers" 
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/beers') || pathname.startsWith('/beers/') 
                    ? 'bg-amber-900 text-white' 
                    : 'text-amber-100 hover:bg-amber-700'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                My Beers
              </Link>
              <Link 
                href="/statistics" 
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/statistics')
                    ? 'bg-amber-900 text-white' 
                    : 'text-amber-100 hover:bg-amber-700'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Statistics
              </Link>
              <Link 
                href="/profile" 
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/profile') 
                    ? 'bg-amber-900 text-white' 
                    : 'text-amber-100 hover:bg-amber-700'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                My Profile
              </Link>
              <Link 
                href="/settings" 
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/settings') 
                    ? 'bg-amber-900 text-white' 
                    : 'text-amber-100 hover:bg-amber-700'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Settings
              </Link>
              <button
                onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-amber-100 hover:bg-amber-700"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link 
                href="/auth/login" 
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/auth/login') 
                    ? 'bg-amber-900 text-white' 
                    : 'text-amber-100 hover:bg-amber-700'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link 
                href="/auth/register" 
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/auth/register') 
                    ? 'bg-amber-900 text-white' 
                    : 'text-amber-100 hover:bg-amber-700'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
} 