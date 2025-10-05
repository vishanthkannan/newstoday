import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNews } from '../../context/NewsContext';
import { ExternalLink, Bookmark, BookmarkCheck, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const NewsCard = ({ article, isBookmarked = false, bookmarkId = null }) => {
  const { user } = useAuth();
  const { addBookmark, removeBookmark } = useNews();
  const [isBookmarking, setIsBookmarking] = useState(false);
  const [bookmarked, setBookmarked] = useState(isBookmarked);

  const handleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) return;
    
    setIsBookmarking(true);
    
    try {
      if (bookmarked) {
        const result = await removeBookmark(bookmarkId);
        if (result.success) {
          setBookmarked(false);
        }
      } else {
        const result = await addBookmark(article);
        if (result.success) {
          setBookmarked(true);
        }
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    } finally {
      setIsBookmarking(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleCardClick = () => {
    window.open(article.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-gradient-to-br from-dark-200/80 to-dark-300/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl border border-gray-700/50 hover:border-primary-500/50 transition-all duration-300 cursor-pointer group"
      onClick={handleCardClick}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        {article.image ? (
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.target.src = `https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=200&fit=crop&crop=top`;
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
            <span className="text-gray-400 text-sm">No image available</span>
          </div>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Bookmark Button */}
        {user && (
          <button
            onClick={handleBookmark}
            disabled={isBookmarking}
            className="absolute top-4 right-4 p-2 bg-dark-200/80 hover:bg-dark-200 rounded-full transition-all duration-200 z-10"
          >
            {bookmarked ? (
              <BookmarkCheck className="h-5 w-5 text-accent-400" />
            ) : (
              <Bookmark className="h-5 w-5 text-gray-300 hover:text-accent-400" />
            )}
          </button>
        )}

        {/* Source */}
        <div className="absolute bottom-4 left-4 flex items-center space-x-2">
          <span className="px-2 py-1 bg-dark-200/80 rounded-md text-xs text-gray-300 font-medium">
            {article.source?.name || 'Unknown Source'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-white mb-3 line-clamp-2 group-hover:text-primary-400 transition-colors">
          {article.title}
        </h3>
        
        <p className="text-gray-400 text-sm mb-4 line-clamp-3">
          {article.description || 'No description available for this article.'}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>{formatDate(article.publishedAt)}</span>
          </div>
          
          <div className="flex items-center space-x-1 text-primary-400 group-hover:text-primary-300 transition-colors">
            <span>Read more more</span>
            <ExternalLink className="h-3 w-3" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NewsCard;