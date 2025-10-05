import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNews } from '../../context/NewsContext';
import { ExternalLink, Bookmark, BookmarkCheck, Clock, MessageCircle, ChevronDown, ChevronUp, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Comments from './Comments';
import axios from 'axios';

const NewsCardWithComments = ({ article, isBookmarked = false, bookmarkId = null }) => {
  const { user } = useAuth();
  const { addBookmark, removeBookmark } = useNews();
  const [isBookmarking, setIsBookmarking] = useState(false);
  const [bookmarked, setBookmarked] = useState(isBookmarked);
  const [showComments, setShowComments] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_URL;


  useEffect(() => {
    let isMounted = true;
    const fetchLikes = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/likes/summary`, {
          params: { articleURL: article.url }
        });
        if (!isMounted) return;
        setLikeCount(res.data.likeCount || 0);
        // likedByUser is false in summary; we infer post-toggle
      } catch (e) {
        // ignore
      }
    };
    if (article?.url) fetchLikes();
    return () => { isMounted = false; };
  }, [article?.url]);

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

  const toggleComments = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowComments(!showComments);
  };

  const handleToggleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;
    try {
      const res = await axios.post(`${API_BASE_URL}/likes`, {
        articleURL: article.url,
        articleTitle: article.title
      });
      setLiked(res.data.liked);
      setLikeCount(res.data.likeCount || 0);
    } catch (e) {
      // ignore
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
    >
      {/* Main Card Content */}
      <div
        className="cursor-pointer group"
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
              className="absolute top-4 right-4 p-2 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 rounded-full transition-all duration-200 z-10"
            >
              {bookmarked ? (
                <BookmarkCheck className="h-5 w-5 text-yellow-500" />
              ) : (
                <Bookmark className="h-5 w-5 text-gray-600 dark:text-gray-300 hover:text-yellow-500" />
              )}
            </button>
          )}

          {/* Source */}
          <div className="absolute bottom-4 left-4 flex items-center space-x-2">
            <span className="px-2 py-1 bg-white/90 dark:bg-gray-800/90 rounded-md text-xs text-gray-800 dark:text-gray-200 font-medium">
              {article.source?.name || 'Unknown Source'}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {article.title}
          </h3>
          
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
            {article.description || 'No description available for this article.'}
          </p>

          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{formatDate(article.publishedAt)}</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleToggleLike}
                className={`flex items-center space-x-1 text-xs ${liked ? 'text-red-500' : 'text-gray-500 dark:text-gray-400 hover:text-red-500'}`}
              >
                <Heart className={`h-3 w-3 ${liked ? 'fill-current' : ''}`} />
                <span>{likeCount}</span>
              </button>
              <div className="flex items-center space-x-1 text-primary-600 dark:text-primary-400 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors">
                <span>Read more</span>
                <ExternalLink className="h-3 w-3" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comments Toggle Button */}
      <div className="px-6 pb-4">
        <button
          onClick={toggleComments}
          className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
        >
          <MessageCircle className="h-4 w-4" />
          <span>Comments</span>
          {showComments ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Comments Section */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-gray-200 dark:border-gray-700"
          >
            <div className="p-6">
              <Comments articleURL={article.url} articleTitle={article.title} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default NewsCardWithComments;

