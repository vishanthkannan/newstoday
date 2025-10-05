import React, { useState, useEffect } from 'react';
import { Users, Star, BarChart3, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [commandEmail, setCommandEmail] = useState('');
  const [commandMsg, setCommandMsg] = useState('');

  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const { user } = useAuth();


  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    }
    // fetch stats when component mounts or tab changes
    fetchStats();
  }, [activeTab]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/users`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // public stats endpoint (safe to expose on production)
      const response = await axios.get(`${API_BASE_URL}/public/stats`);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats(null);
    }
  };

  const promoteByEmail = async () => {
    setCommandMsg('');
    if (!commandEmail) return setCommandMsg('Enter an email');
    try {
      // search user by email
      const searchRes = await axios.get(`${API_BASE_URL}/admin/users?search=${encodeURIComponent(commandEmail)}&limit=1`);
      const foundUsers = searchRes.data.users || searchRes.data || [];
      const userToPromote = Array.isArray(foundUsers) ? foundUsers[0] : foundUsers;
      if (!userToPromote || !userToPromote._id) {
        setCommandMsg('User not found');
        return;
      }

      await axios.put(`${API_BASE_URL}/admin/users/${userToPromote._id}/role`, { role: 'admin' });
      setCommandMsg('User promoted to admin');
      fetchUsers();
      fetchStats();
    } catch (err) {
      console.error(err);
      setCommandMsg(err.response?.data?.message || 'Promotion failed');
    }
  };

  const exportUsersCSV = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/admin/users?limit=1000`);
      const list = res.data.users || res.data || [];
      const rows = [
        ['id', 'name', 'email', 'role', 'country', 'preferredCategories'].join(','),
        ...list.map(u => [u._id, `"${u.name}"`, u.email, u.role, u.country || '', `"${(u.preferredCategories||[]).join('|')}"`].join(','))
      ].join('\n');

      const blob = new Blob([rows], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'users.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed', err);
      setCommandMsg('Export failed');
    }
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-400">
            Manage users and platform settings
          </p>
        </motion.div>

        {/* Summary and Commands */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="bg-dark-200/50 p-4 rounded-lg">
              <p className="text-sm text-gray-400">Total Users</p>
              <p className="text-2xl font-bold text-white">{stats ? stats.totalUsers : '-'}</p>
            </div>
            <div className="bg-dark-200/50 p-4 rounded-lg">
              <p className="text-sm text-gray-400">Admin Users</p>
              <p className="text-2xl font-bold text-white">{stats ? stats.adminUsers : '-'}</p>
            </div>
            <div className="bg-dark-200/50 p-4 rounded-lg">
              <p className="text-sm text-gray-400">Regular Users</p>
              <p className="text-2xl font-bold text-white">{stats ? stats.regularUsers : '-'}</p>
            </div>
          </div>

          <div className="bg-dark-200/50 p-4 rounded-lg w-full md:w-auto">
            <p className="text-sm text-gray-400 mb-2">Commands</p>
            {!user || user.role !== 'admin' ? (
              <p className="text-sm text-gray-400">Admin commands hidden. Log in as an admin to run commands.</p>
            ) : (
              <>
                <div className="flex gap-2 items-center">
                  <input
                    value={commandEmail}
                    onChange={(e) => setCommandEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="px-3 py-2 rounded-md bg-white/5 text-sm text-white w-full md:w-64"
                  />
                  <button onClick={promoteByEmail} className="px-3 py-2 bg-primary-600 rounded-md text-sm font-semibold">Promote</button>
                  <button onClick={exportUsersCSV} className="px-3 py-2 bg-gray-700 rounded-md text-sm">Export</button>
                </div>
                {commandMsg && <p className="text-sm text-gray-400 mt-2">{commandMsg}</p>}
              </>
            )}
          </div>
        </div>

        {/* Tabs */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex space-x-1 mb-8 bg-dark-200/50 p-1 rounded-lg w-fit"
        >
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'users'
                ? 'bg-primary-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Users</span>
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'analytics'
                ? 'bg-primary-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            <span>Analytics</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'settings'
                ? 'bg-primary-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </button>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {activeTab === 'users' && (
            <div className="bg-gradient-to-br from-dark-200/80 to-dark-300/80 rounded-xl border border-gray-700/50 overflow-hidden">
              <div className="p-6 border-b border-gray-700/50">
                <h2 className="text-xl font-semibold text-white">Registered Users</h2>
                <p className="text-gray-400 mt-1">Manage user accounts and preferences</p>
              </div>
              
              {loading ? (
                <div className="p-8 text-center">
                  <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-gray-400 mt-2">Loading users...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-dark-300/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Preferred Categories
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Country
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700/50">
                      {users.map((user, index) => (
                        <tr key={user._id} className="hover:bg-gray-700/20 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center mr-3">
                                <span className="text-white text-sm font-medium">
                                  {user.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="text-sm font-medium text-white">{user.name}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.role === 'admin' 
                                ? 'bg-accent-400/20 text-accent-400' 
                                : 'bg-gray-700/50 text-gray-300'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-300">
                            <div className="flex flex-wrap gap-1">
                              {user.preferredCategories?.slice(0, 3).map((category) => (
                                <span
                                  key={category}
                                  className="inline-flex px-2 py-1 text-xs bg-primary-600/20 text-primary-400 rounded"
                                >
                                  {category}
                                </span>
                              ))}
                              {user.preferredCategories?.length > 3 && (
                                <span className="text-xs text-gray-400">
                                  +{user.preferredCategories.length - 3} more
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {user.country?.toUpperCase()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {users.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-400">No users found</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-dark-200/80 to-dark-300/80 rounded-xl p-6 border border-gray-700/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Users</p>
                    <p className="text-2xl font-bold text-white">{users.length}</p>
                  </div>
                  <Users className="h-8 w-8 text-primary-500" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-dark-200/80 to-dark-300/80 rounded-xl p-6 border border-gray-700/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Admin Users</p>
                    <p className="text-2xl font-bold text-white">
                      {users.filter(u => u.role === 'admin').length}
                    </p>
                  </div>
                  <Star className="h-8 w-8 text-accent-400" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-dark-200/80 to-dark-300/80 rounded-xl p-6 border border-gray-700/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Regular Users</p>
                    <p className="text-2xl font-bold text-white">
                      {users.filter(u => u.role === 'user').length}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-gray-400" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-gradient-to-br from-dark-200/80 to-dark-300/80 rounded-xl p-6 border border-gray-700/50">
              <h2 className="text-xl font-semibold text-white mb-4">Platform Settings</h2>
              <p className="text-gray-400">Admin settings and configuration options will be available here.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Admin;