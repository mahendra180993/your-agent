// src/components/AdminPanel/Dashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api.js';
import ClientManagement from './ClientManagement.jsx';
import ChatHistory from './ChatHistory.jsx';
import Settings from './Settings.jsx';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    setIsAuthenticated(true);
    fetchStats();
  }, [navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchStats();
    }
  }, [isAuthenticated]);

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/stats');
      setStats(response.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              AI Chatbot Admin
            </h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'dashboard', label: 'Dashboard' },
              { id: 'clients', label: 'Clients' },
              { id: 'chats', label: 'Chat History' },
              { id: 'settings', label: 'Settings' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <div>
            <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
              Dashboard Overview
            </h2>
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Total Messages
                  </h3>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                    {stats.totalMessages}
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Total Sessions
                  </h3>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                    {stats.totalSessions}
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Active Sessions
                  </h3>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                    {stats.activeSessions}
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Messages (7 days)
                  </h3>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                    {stats.recentMessages}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'clients' && <ClientManagement />}
        {activeTab === 'chats' && <ChatHistory />}
        {activeTab === 'settings' && <Settings />}
      </main>
    </div>
  );
}
