import React, { useEffect } from 'react';
import { useNews } from '../context/NewsContext';
import NewsGrid from '../components/news/NewsGrid';
import { motion } from 'framer-motion';

const Home = () => {
  const { articles, loading, fetchNews, bookmarks, fetchBookmarks } = useNews();

  useEffect(() => {
    fetchNews();
    fetchBookmarks();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary-100/50 to-accent-100/50 dark:from-primary-900/20 dark:to-accent-900/20"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <motion.h1 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 dark:from-white dark:via-gray-100 dark:to-gray-300 bg-clip-text text-transparent mb-6"
          >
            Stay Informed with
            <span className="block bg-gradient-to-r from-primary-600 to-accent-500 dark:from-primary-400 dark:to-accent-400 bg-clip-text text-transparent">
              Latest News
            </span>
          </motion.h1>
          <motion.p 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8"
          >
            Discover trending stories, breaking news, and in-depth coverage from trusted sources around the world.
          </motion.p>
        </div>
      </motion.section>

      {/* News Grid */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <NewsGrid 
              articles={articles} 
              loading={loading} 
              bookmarks={bookmarks}
            />
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;