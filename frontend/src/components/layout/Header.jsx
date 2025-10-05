import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNews } from '../../context/NewsContext';
import { useTheme } from '../../context/ThemeContext';
import { Search, User, LogOut, Menu, X, Bookmark, Settings, Sun, Moon } from 'lucide-react';

const categories = [
  { id: 'all', label: 'All', value: 'all' },
  { id: 'technology', label: 'Technology', value: 'technology' },
  { id: 'business', label: 'Business', value: 'business' },
  { id: 'sports', label: 'Sports', value: 'sports' },
  { id: 'entertainment', label: 'Entertainment', value: 'entertainment' },
  { id: 'health', label: 'Health', value: 'health' },
  { id: 'science', label: 'Science', value: 'science' },
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

const Header = () => {
  const { user, logout } = useAuth();
  const { fetchNews } = useNews();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState('us');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const headerRef = useRef(null);
  const [headerTopOffset, setHeaderTopOffset] = useState(0);

  useEffect(() => {
    const setOffset = () => {
      if (headerRef.current) {
        // Use offsetHeight to get the computed header height in pixels
        setHeaderTopOffset(headerRef.current.offsetHeight || 0);
      }
    };

    setOffset();
    window.addEventListener('resize', setOffset);
    return () => window.removeEventListener('resize', setOffset);
  }, []);

  const handleCategoryChange = (categoryId, categoryValue) => {
    setActiveCategory(categoryId);
    if (location.pathname === '/') {
      const category = categoryValue === 'all' ? 'general' : categoryValue;
      // Reset search when switching categories so category filtering applies
      setSearchQuery('');
      fetchNews(category, selectedCountry, '');
    }
  };

  const handleCountryChange = (country) => {
    setSelectedCountry(country);
    if (location.pathname === '/') {
      const category = activeCategory === 'all' ? 'general' : activeCategory;
      fetchNews(category, country, searchQuery);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (location.pathname === '/') {
      const category = activeCategory === 'all' ? 'general' : activeCategory;
      fetchNews(category, selectedCountry, searchQuery);
    } else {
      navigate('/');
      setTimeout(() => {
        const category = activeCategory === 'all' ? 'general' : activeCategory;
        fetchNews(category, selectedCountry, searchQuery);
      }, 100);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setUserMenuOpen(false);
  };

  return (
  <header ref={headerRef} className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-dark-300/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700/50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group h-16">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-accent-500 rounded-xl flex items-center justify-center group-hover:animate-pulse-glow transition-all shadow-lg">
              <span className="font-bold text-white text-2xl">N</span>
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-bold text-2xl text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                NewsFlow
              </span>
              <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                News Aggregator
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8 h-16 overflow-x-auto">

            {/* Categories */}
            <nav className="flex items-center space-x-1">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id, category.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    activeCategory === category.id
                      ? 'bg-primary-600 text-white shadow-lg'
                      : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-white hover:bg-primary-50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </nav>

            {/* Country Selector */}
            <select
              value={selectedCountry}
              onChange={(e) => handleCountryChange(e.target.value)}
              className="bg-white dark:bg-gray-700/50 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 focus:border-primary-500 focus:outline-none shadow-sm"
            >
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>

            {/* Search */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search news..."
                className="bg-white dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 focus:border-primary-500 focus:outline-none w-40 md:w-64 shadow-sm"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
            </form>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4 h-16">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-white dark:bg-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-600/50 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-white transition-colors shadow-sm border border-gray-200 dark:border-gray-600"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 bg-white dark:bg-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-600/50 rounded-lg px-3 py-2 transition-colors shadow-sm border border-gray-200 dark:border-gray-600"
                >
                  <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-medium">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden sm:block text-sm text-gray-700 dark:text-gray-300 font-medium">{user.name}</span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-dark-200 rounded-lg shadow-xl border border-gray-700 py-2 z-50">
                    <Link
                      to="/dashboard"
                      className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <User className="h-4 w-4 mr-3" />
                      Dashboard
                    </Link>
                    <Link
                      to="/dashboard"
                      className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Bookmark className="h-4 w-4 mr-3" />
                      Bookmarks
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Settings className="h-4 w-4 mr-3" />
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2 flex-shrink-0">

                  <Link
                    to="/login"
                    className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-white px-3 py-2 rounded-md text-sm font-semibold transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-lg"
                  >
                    Sign Up
                  </Link>
                </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-gray-700 dark:text-gray-400 hover:text-primary-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors h-10 flex items-center justify-center"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 space-y-4 border-t border-gray-200 dark:border-gray-700/50">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search news..."
                className="w-full bg-white dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 focus:border-primary-500 focus:outline-none shadow-sm"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
            </form>

            {/* Mobile Categories */}
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    handleCategoryChange(category.id, category.value);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-3 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
                    activeCategory === category.id
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-white hover:bg-primary-50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>

            {/* Mobile Country Selector */}
            <select
              value={selectedCountry}
              onChange={(e) => handleCountryChange(e.target.value)}
              className="w-full bg-white dark:bg-gray-700/50 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 focus:border-primary-500 focus:outline-none shadow-sm"
            >
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
            {/* Mobile Auth Links */}
            {!user && (
              <div className="flex w-full space-x-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center bg-transparent text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-white px-3 py-2 rounded-md text-sm font-semibold transition-colors border border-gray-300 dark:border-gray-600"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 rounded-md text-sm font-semibold transition-colors shadow-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Click overlay to close menus */}
      {(userMenuOpen || mobileMenuOpen) && (
        <div
          // overlay starts below the header so header controls remain clickable
          className="fixed left-0 right-0 bottom-0 z-30"
          style={{ top: headerTopOffset }}
          onClick={() => {
            setUserMenuOpen(false);
            setMobileMenuOpen(false);
          }}
        />
      )}
    </header>
  );
};

export default Header;