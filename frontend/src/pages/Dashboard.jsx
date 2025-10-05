import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNews } from '../context/NewsContext';
import NewsGrid from '../components/news/NewsGrid';
import { Settings, User, Bookmark, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const categories = [
  { id: 'general', label: 'General' },
  { id: 'technology', label: 'Technology' },
  { id: 'business', label: 'Business' },
  { id: 'sports', label: 'Sports' },
  { id: 'entertainment', label: 'Entertainment' },
  { id: 'health', label: 'Health' },
  { id: 'science', label: 'Science' },
];

const countries = [
  { code: 'us', name: 'United States' },
  { code: 'gb', name: 'United Kingdom' },
  { code: 'ca', name: 'Canada' },
  { code: 'au', name: 'Australia' },
  { code: 'in', name: 'India' },
  { code: 'de', name: 'Germany' },
  { code: 'fr', name: 'France' },
  { code: 'jp', name: 'Japan' },
];

const Dashboard = () => {
  const { user, updatePreferences } = useAuth();
  const { articles, loading, bookmarks, fetchNews, fetchBookmarks } = useNews();
  
  const [activeTab, setActiveTab] = useState('feed');
  const [preferences, setPreferences] = useState({
    preferredCategories: user?.preferredCategories || ['general'],
    country: user?.country || 'us',
  });

  useEffect(() => {
    fetchBookmarks();
    if (user?.preferredCategories?.length > 0) {
      fetchNews(user.preferredCategories[0], user.country);
    } else {
      fetchNews();
    }
  }, [user]);

  const handlePreferencesUpdate = async () => {
    const result = await updatePreferences(preferences);
    if (result.success) {
      fetchNews(preferences.preferredCategories[0], preferences.country);
    }
  };

  const toggleCategory = (categoryId) => {
    const newCategories = preferences.preferredCategories.includes(categoryId)
      ? preferences.preferredCategories.filter(c => c !== categoryId)
      : [...preferences.preferredCategories, categoryId];
    
    setPreferences({
      ...preferences,
      preferredCategories: newCategories.length > 0 ? newCategories : ['general'],
    });
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
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-400">
            Your personalized news dashboard
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex space-x-1 mb-8 bg-dark-200/50 p-1 rounded-lg w-fit"
        >
          <button
            onClick={() => setActiveTab('feed')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'feed'
                ? 'bg-primary-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            <Globe className="h-4 w-4" />
            <span>Your Feed</span>
          </button>
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'bookmarks'
                ? 'bg-primary-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            <Bookmark className="h-4 w-4" />
            <span>Bookmarks</span>
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
            <span>Preferences</span>
          </button>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {activeTab === 'feed' && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-white mb-2">Your Personalized News Feed</h2>
                <p className="text-gray-400">
                  Based on you preferred categories: {preferences.preferredCategories.join(', ')}
                </p>
              </div>
              <NewsGrid articles={articles} loading={loading} bookmarks={bookmarks} />
            </div>
          )}

          {activeTab === 'bookmarks' && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-white mb-2">Your Bookmarks</h2>
                <p className="text-gray-400">Articles you've saved for later reading</p>
              </div>
              {bookmarks.length > 0 ? (
                <NewsGrid 
                  articles={bookmarks.map(bookmark => ({
                    title: bookmark.articleTitle,
                    url: bookmark.articleURL,
                    image: bookmark.imageURL,
                    publishedAt: bookmark.publishedAt,
                    description: '',
                  }))} 
                  loading={false} 
                  bookmarks={bookmarks}
                />
              ) : (
                <div className="text-center py-20">
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Bookmark className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">No bookmarks yet</h3>
                  <p className="text-gray-400">Start bookmarking articles to read them later!</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-2xl">
              <div className="bg-gradient-to-br from-dark-200/80 to-dark-300/80 rounded-xl p-6 border border-gray-700/50">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  User Preferences
                </h2>

                {/* Categories */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-300 mb-4">
                    Preferred Categories
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => toggleCategory(category.id)}
                        className={`p-3 rounded-lg text-sm font-medium transition-all ${
                          preferences.preferredCategories.includes(category.id)
                            ? 'bg-primary-600 text-white shadow-lg'
                            : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white'
                        }`}
                      >
                        {category.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Country */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Country
                  </label>
                  <select
                    value={preferences.country}
                    onChange={(e) => setPreferences({ ...preferences, country: e.target.value })}
                    className="w-full bg-gray-700/50 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-primary-500 focus:outline-none"
                  >
                    {countries.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Save Button */}
                <button
                  onClick={handlePreferencesUpdate}
                  className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;