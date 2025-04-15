'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';

interface SettingsForm {
  notificationsEnabled: boolean;
  emailNotifications: boolean;
  expiryWarningDays: number;
  theme: 'light' | 'dark' | 'system';
}

export default function SettingsPage() {
  const { currentUser } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('notifications'); // 'notifications', 'appearance', 'advanced'
  const [settings, setSettings] = useState<SettingsForm>({
    notificationsEnabled: true,
    emailNotifications: false,
    expiryWarningDays: 7,
    theme: 'light',
  });

  // This would be replaced with actual API call to load user settings
  useEffect(() => {
    // Simulate loading settings from localStorage or API
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Error parsing saved settings:', error);
      }
    }
  }, []);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: name === 'expiryWarningDays' ? parseInt(value) : value
    }));
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    
    // Simulating API call to save settings
    setTimeout(() => {
      // Save to localStorage for demo purposes
      localStorage.setItem('userSettings', JSON.stringify(settings));
      
      toast.success('Settings saved successfully');
      setLoading(false);
    }, 500);
  };

  // Function to get expiry status class based on days remaining
  const getExpiryStatusClass = (daysRemaining: number) => {
    if (daysRemaining <= 7) {
      return 'bg-red-100 text-red-800 border-red-300';
    } else if (daysRemaining <= 14) {
      return 'bg-orange-100 text-orange-800 border-orange-300';
    } else if (daysRemaining <= 30) {
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    } else {
      return 'bg-green-100 text-green-800 border-green-300';
    }
  };

  // Get example dates based on warning threshold
  const getExampleDates = () => {
    const today = new Date();
    const examples = [];
    
    // Warning threshold date
    const warningDate = new Date(today);
    warningDate.setDate(today.getDate() + settings.expiryWarningDays);
    examples.push({
      date: warningDate,
      label: `Warning Threshold (${settings.expiryWarningDays} days)`,
      status: getExpiryStatusClass(settings.expiryWarningDays)
    });
    
    // Critical date (3 days)
    const criticalDate = new Date(today);
    criticalDate.setDate(today.getDate() + 3);
    examples.push({
      date: criticalDate,
      label: '3 days until expiry',
      status: getExpiryStatusClass(3)
    });
    
    // Expired date
    const expiredDate = new Date(today);
    expiredDate.setDate(today.getDate() - 1);
    examples.push({
      date: expiredDate,
      label: 'Expired',
      status: 'bg-red-100 text-red-800 border-red-300'
    });
    
    return examples;
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="bg-gradient-to-b from-amber-50 to-amber-100 min-h-[calc(100vh-64px-88px)]">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-amber-800 mb-6">Settings</h1>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-amber-200">
              <div className="md:flex">
                {/* Sidebar/Tabs */}
                <div className="md:w-1/4 border-r border-amber-200">
                  <div className="md:flex md:flex-col p-2">
                    <button
                      onClick={() => setActiveTab('notifications')}
                      className={`px-4 py-3 mb-1 md:mb-2 rounded-md text-left ${
                        activeTab === 'notifications'
                          ? 'bg-amber-100 text-amber-800 font-medium'
                          : 'text-gray-600 hover:bg-amber-50'
                      }`}
                    >
                      Notifications
                    </button>
                    <button
                      onClick={() => setActiveTab('appearance')}
                      className={`px-4 py-3 mb-1 md:mb-2 rounded-md text-left ${
                        activeTab === 'appearance'
                          ? 'bg-amber-100 text-amber-800 font-medium'
                          : 'text-gray-600 hover:bg-amber-50'
                      }`}
                    >
                      Appearance
                    </button>
                    <button
                      onClick={() => setActiveTab('advanced')}
                      className={`px-4 py-3 mb-1 md:mb-2 rounded-md text-left ${
                        activeTab === 'advanced'
                          ? 'bg-amber-100 text-amber-800 font-medium'
                          : 'text-gray-600 hover:bg-amber-50'
                      }`}
                    >
                      Advanced
                    </button>
                  </div>
                </div>
                
                {/* Content Area */}
                <div className="md:w-3/4 p-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Notifications Settings */}
                    {activeTab === 'notifications' && (
                      <div>
                        <h2 className="text-xl font-semibold text-amber-800 mb-4">Notification Preferences</h2>
                        
                        <div className="space-y-4">
                          <div className="flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                id="notificationsEnabled"
                                name="notificationsEnabled"
                                type="checkbox"
                                checked={settings.notificationsEnabled}
                                onChange={handleCheckboxChange}
                                className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="notificationsEnabled" className="font-medium text-gray-700">
                                Enable notifications
                              </label>
                              <p className="text-gray-500">
                                Receive alerts when beers are about to expire
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                id="emailNotifications"
                                name="emailNotifications"
                                type="checkbox"
                                checked={settings.emailNotifications}
                                onChange={handleCheckboxChange}
                                disabled={!settings.notificationsEnabled}
                                className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500 disabled:opacity-50"
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="emailNotifications" className={`font-medium ${settings.notificationsEnabled ? 'text-gray-700' : 'text-gray-400'}`}>
                                Send email notifications
                              </label>
                              <p className={settings.notificationsEnabled ? 'text-gray-500' : 'text-gray-400'}>
                                Also receive notifications via email
                              </p>
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <label htmlFor="expiryWarningDays" className="block text-sm font-medium text-gray-700 mb-1">
                              Expiry warning threshold
                            </label>
                            <select
                              id="expiryWarningDays"
                              name="expiryWarningDays"
                              value={settings.expiryWarningDays}
                              onChange={handleSelectChange}
                              disabled={!settings.notificationsEnabled}
                              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
                            >
                              <option value={3}>3 days before expiry</option>
                              <option value={7}>7 days before expiry</option>
                              <option value={14}>14 days before expiry</option>
                              <option value={30}>30 days before expiry</option>
                            </select>
                            <p className={`text-xs mt-1 ${settings.notificationsEnabled ? 'text-gray-500' : 'text-gray-400'}`}>
                              You'll be notified when beers are about to expire within this timeframe
                            </p>
                          </div>
                          
                          {/* Expiry warning preview */}
                          {settings.notificationsEnabled && (
                            <div className="mt-6 border border-gray-200 rounded-md p-4 bg-gray-50">
                              <h3 className="text-sm font-medium text-gray-700 mb-3">Preview of expiry status indicators:</h3>
                              <div className="space-y-3">
                                {getExampleDates().map((example, index) => (
                                  <div key={index} className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">{example.label}</span>
                                    <div className="flex items-center">
                                      <span className="text-sm text-gray-600 mr-2">{formatDate(example.date)}</span>
                                      <span className={`px-3 py-1 text-xs font-medium rounded-full border ${example.status}`}>
                                        {index === 2 ? 'Expired' : `${index === 0 ? settings.expiryWarningDays : 3} days left`}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Appearance Settings */}
                    {activeTab === 'appearance' && (
                      <div>
                        <h2 className="text-xl font-semibold text-amber-800 mb-4">Appearance</h2>
                        
                        <div className="space-y-4">
                          <fieldset>
                            <legend className="text-sm font-medium text-gray-700 mb-2">Theme</legend>
                            <div className="space-y-2">
                              <div className="flex items-center">
                                <input
                                  id="light"
                                  name="theme"
                                  type="radio"
                                  value="light"
                                  checked={settings.theme === 'light'}
                                  onChange={handleRadioChange}
                                  className="w-4 h-4 text-amber-600 border-gray-300 focus:ring-amber-500"
                                />
                                <label htmlFor="light" className="ml-3 text-sm font-medium text-gray-700">
                                  Light
                                </label>
                              </div>
                              <div className="flex items-center">
                                <input
                                  id="dark"
                                  name="theme"
                                  type="radio"
                                  value="dark"
                                  checked={settings.theme === 'dark'}
                                  onChange={handleRadioChange}
                                  className="w-4 h-4 text-amber-600 border-gray-300 focus:ring-amber-500"
                                />
                                <label htmlFor="dark" className="ml-3 text-sm font-medium text-gray-700">
                                  Dark
                                </label>
                              </div>
                              <div className="flex items-center">
                                <input
                                  id="system"
                                  name="theme"
                                  type="radio"
                                  value="system"
                                  checked={settings.theme === 'system'}
                                  onChange={handleRadioChange}
                                  className="w-4 h-4 text-amber-600 border-gray-300 focus:ring-amber-500"
                                />
                                <label htmlFor="system" className="ml-3 text-sm font-medium text-gray-700">
                                  System (follows your device settings)
                                </label>
                              </div>
                            </div>
                          </fieldset>
                          
                          <div className="mt-2 p-4 rounded-md bg-gray-50 border border-gray-200">
                            <p className="text-xs text-gray-500 italic">
                              Note: Theme settings are a work in progress and will be fully implemented in a future update.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Advanced Settings */}
                    {activeTab === 'advanced' && (
                      <div>
                        <h2 className="text-xl font-semibold text-amber-800 mb-4">Advanced Settings</h2>
                        
                        <div className="space-y-4">
                          <div className="p-4 rounded-md bg-red-50 border border-red-200">
                            <h3 className="text-md font-medium text-red-800">Danger Zone</h3>
                            <p className="text-sm text-red-700 mt-1">
                              These actions cannot be undone. Please be certain.
                            </p>
                            
                            <div className="mt-4">
                              <button
                                type="button"
                                onClick={() => toast.info('This feature will be available in a future update')}
                                className="px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                              >
                                Delete All Data
                              </button>
                            </div>
                          </div>
                          
                          <div className="mt-6">
                            <h3 className="text-md font-medium text-gray-700">Export Data</h3>
                            <p className="text-sm text-gray-600 mt-1">
                              Download a copy of your beer collection data.
                            </p>
                            
                            <div className="mt-2">
                              <button
                                type="button"
                                onClick={() => toast.info('This feature will be available in a future update')}
                                className="px-4 py-2 bg-gray-100 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                              >
                                Export to CSV
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="pt-5 border-t border-gray-200">
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={loading}
                          className="bg-amber-600 text-white px-6 py-2 rounded-md hover:bg-amber-700 transition disabled:opacity-50"
                        >
                          {loading ? 'Saving...' : 'Save Settings'}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
} 