// Settings page for user preferences and account management

'use client';

import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useUser, useStoreActions } from '@/lib/store';
import { useNotification } from '@/components/ui/NotificationToast';
import { 
  Cog6ToothIcon, 
  BellIcon, 
  ShieldCheckIcon,
  GlobeAltIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

export default function SettingsPage() {
  const { isConnected } = useAccount();
  const user = useUser();
  const { updateUserPreferences } = useStoreActions();
  const { showSuccess, showError } = useNotification();
  
  const [preferences, setPreferences] = useState({
    notifications: {
      email: false,
      telegram: false,
      discord: false,
      push: true,
    },
    defaultChain: 1,
    gasPreferences: {
      auto: true,
      custom: 500000,
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user?.preferences) {
      setPreferences(user.preferences);
    }
  }, [user]);

  const handlePreferenceChange = (key: string, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleNotificationChange = (type: string, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: value,
      },
    }));
  };

  const handleGasPreferenceChange = (key: string, value: any) => {
    setPreferences(prev => ({
      ...prev,
      gasPreferences: {
        ...prev.gasPreferences,
        [key]: value,
      },
    }));
  };

  const savePreferences = async () => {
    setIsLoading(true);
    try {
      await updateUserPreferences(preferences);
      showSuccess('Settings saved successfully');
    } catch (error) {
      showError('Failed to save settings');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Cog6ToothIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">Connect Wallet</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Please connect your wallet to access settings.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="mt-2 text-gray-300">
            Manage your account preferences and security settings
          </p>
        </div>

        <div className="space-y-8">
          {/* Notification Preferences */}
          <div className="bg-white/5 backdrop-blur-md rounded-lg p-6 border border-white/10">
            <div className="flex items-center space-x-3 mb-6">
              <BellIcon className="h-6 w-6 text-purple-400" />
              <h2 className="text-xl font-semibold text-white">Notification Preferences</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-300">Push Notifications</label>
                  <p className="text-xs text-gray-400">Receive notifications in your browser</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.notifications.push}
                  onChange={(e) => handleNotificationChange('push', e.target.checked)}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-300">Email Notifications</label>
                  <p className="text-xs text-gray-400">Receive alerts via email</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.notifications.email}
                  onChange={(e) => handleNotificationChange('email', e.target.checked)}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-300">Telegram Notifications</label>
                  <p className="text-xs text-gray-400">Receive alerts via Telegram</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.notifications.telegram}
                  onChange={(e) => handleNotificationChange('telegram', e.target.checked)}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-300">Discord Notifications</label>
                  <p className="text-xs text-gray-400">Receive alerts via Discord</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.notifications.discord}
                  onChange={(e) => handleNotificationChange('discord', e.target.checked)}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
              </div>
            </div>
          </div>

          {/* Network Preferences */}
          <div className="bg-white/5 backdrop-blur-md rounded-lg p-6 border border-white/10">
            <div className="flex items-center space-x-3 mb-6">
              <GlobeAltIcon className="h-6 w-6 text-purple-400" />
              <h2 className="text-xl font-semibold text-white">Network Preferences</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Default Network
                </label>
                <select
                  value={preferences.defaultChain}
                  onChange={(e) => handlePreferenceChange('defaultChain', parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value={1}>Ethereum Mainnet</option>
                  <option value={137}>Polygon</option>
                  <option value={42161}>Arbitrum One</option>
                  <option value={8453}>Base</option>
                </select>
              </div>
            </div>
          </div>

          {/* Gas Preferences */}
          <div className="bg-white/5 backdrop-blur-md rounded-lg p-6 border border-white/10">
            <div className="flex items-center space-x-3 mb-6">
              <CurrencyDollarIcon className="h-6 w-6 text-purple-400" />
              <h2 className="text-xl font-semibold text-white">Gas Preferences</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-300">Auto Gas Estimation</label>
                  <p className="text-xs text-gray-400">Automatically estimate optimal gas settings</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.gasPreferences.auto}
                  onChange={(e) => handleGasPreferenceChange('auto', e.target.checked)}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
              </div>
              
              {!preferences.gasPreferences.auto && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Custom Gas Limit
                  </label>
                  <input
                    type="number"
                    value={preferences.gasPreferences.custom}
                    onChange={(e) => handleGasPreferenceChange('custom', parseInt(e.target.value))}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="500000"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white/5 backdrop-blur-md rounded-lg p-6 border border-white/10">
            <div className="flex items-center space-x-3 mb-6">
              <ShieldCheckIcon className="h-6 w-6 text-purple-400" />
              <h2 className="text-xl font-semibold text-white">Security Settings</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-300">Session Timeout</label>
                  <p className="text-xs text-gray-400">Automatically log out after inactivity</p>
                </div>
                <select className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                  <option value="1h">1 Hour</option>
                  <option value="4h">4 Hours</option>
                  <option value="24h">24 Hours</option>
                  <option value="7d">7 Days</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-300">Two-Factor Authentication</label>
                  <p className="text-xs text-gray-400">Add an extra layer of security</p>
                </div>
                <button className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 transition-colors">
                  Enable 2FA
                </button>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={savePreferences}
              disabled={isLoading}
              className="px-6 py-3 bg-purple-600 text-white font-medium rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}