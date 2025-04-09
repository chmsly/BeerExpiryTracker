'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { UserData } from '@/services/auth.service';

interface ProfileForm {
  username: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ProfilePage() {
  const { currentUser, updateUser } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('info'); // 'info' or 'password'
  const [form, setForm] = useState<ProfileForm>({
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Initialize form with user data
  useEffect(() => {
    if (currentUser) {
      setForm(prev => ({
        ...prev,
        username: currentUser.username || '',
        email: currentUser.email || '',
      }));
    }
  }, [currentUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) return;
    
    try {
      setLoading(true);
      
      // For now, we'll just update the local user info
      // In a real app, you would call an API to update the user's information
      const updatedUser: UserData = {
        ...currentUser,
        email: form.email
      };
      
      const success = await updateUser(updatedUser);
      
      if (success) {
        toast.success('Profile information updated successfully');
      } else {
        toast.error('Failed to update profile information');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('An error occurred while updating profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) return;
    
    // Validate passwords
    if (form.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    
    if (form.newPassword !== form.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    try {
      setLoading(true);
      
      // In a real app, this would call an API endpoint to change the password
      // For now, we'll just show a success message
      toast.success('Password updated successfully');
      
      // Reset the password fields
      setForm(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error('An error occurred while updating password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="bg-gradient-to-b from-amber-50 to-amber-100 min-h-[calc(100vh-64px-88px)]">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-amber-800 mb-6">My Profile</h1>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-amber-200">
              <div className="border-b border-amber-200">
                <div className="flex">
                  <button
                    onClick={() => setActiveTab('info')}
                    className={`px-6 py-3 font-medium ${
                      activeTab === 'info'
                        ? 'bg-amber-100 text-amber-800 border-b-2 border-amber-600'
                        : 'text-gray-600 hover:text-amber-800 hover:bg-amber-50'
                    }`}
                  >
                    Account Information
                  </button>
                  <button
                    onClick={() => setActiveTab('password')}
                    className={`px-6 py-3 font-medium ${
                      activeTab === 'password'
                        ? 'bg-amber-100 text-amber-800 border-b-2 border-amber-600'
                        : 'text-gray-600 hover:text-amber-800 hover:bg-amber-50'
                    }`}
                  >
                    Change Password
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                {activeTab === 'info' ? (
                  <form onSubmit={handleInfoSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                        Username
                      </label>
                      <input
                        type="text"
                        id="username"
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                        disabled // Username cannot be changed after registration
                      />
                      <p className="text-xs text-gray-500 mt-1">Username cannot be changed.</p>
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    
                    <div className="flex justify-end pt-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-amber-600 text-white px-6 py-2 rounded-md hover:bg-amber-700 transition disabled:opacity-50"
                      >
                        {loading ? 'Saving...' : 'Update Profile'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handlePasswordSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={form.currentPassword}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={form.newPassword}
                        onChange={handleChange}
                        required
                        minLength={6}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters.</p>
                    </div>
                    
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    
                    <div className="flex justify-end pt-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-amber-600 text-white px-6 py-2 rounded-md hover:bg-amber-700 transition disabled:opacity-50"
                      >
                        {loading ? 'Updating...' : 'Change Password'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
} 