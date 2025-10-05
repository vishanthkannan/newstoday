import React, { createContext, useContext, useState, useRef } from 'react';
import axios from 'axios';

const NewsContext = createContext();

export const useNews = () => {
  const context = useContext(NewsContext);
  if (!context) {
    throw new Error('useNews must be used within a NewsProvider');
  }
  return context;
};

export const NewsProvider = ({ children }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);
  const latestRequestId = useRef(0);
  const controllerRef = useRef(null);

const API_BASE_URL = import.meta.env.VITE_API_URL;

  const fetchNews = async (category = 'general', country = 'us', query = '') => {
    // cancel any previous in-flight request
    if (controllerRef.current) {
      try { controllerRef.current.abort(); } catch {}
    }
    const controller = new AbortController();
    controllerRef.current = controller;

    const reqId = ++latestRequestId.current;
    setLoading(true);
    try {
      let url = `${API_BASE_URL}/news`;
      const params = new URLSearchParams();
      
      // Do not append category for 'all' or 'general' to let backend default properly
      if (category && category !== 'all' && category !== 'general') {
        params.append('category', category);
      }
      if (country) params.append('country', country);
      if (query) params.append('q', query);
      
      if (params.toString()) url += `?${params.toString()}`;
      
      const response = await axios.get(url, { signal: controller.signal });
      if (reqId === latestRequestId.current) {
        setArticles(response.data.articles || []);
      }
    } catch (error) {
      // Ignore aborted requests
      if (error.name === 'CanceledError' || error.code === 'ERR_CANCELED') return;
      console.error('Error fetching news:', error);
      if (reqId === latestRequestId.current) {
        setArticles([]);
      }
    } finally {
      if (reqId === latestRequestId.current) {
        setLoading(false);
      }
    }
  };

  const addBookmark = async (article) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/bookmarks`, {
        articleTitle: article.title,
        articleURL: article.url,
        imageURL: article.image,
        publishedAt: article.publishedAt,
      });
      
      setBookmarks(prev => [...prev, response.data]);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to bookmark' 
      };
    }
  };

  const removeBookmark = async (bookmarkId) => {
    try {
      await axios.delete(`${API_BASE_URL}/bookmarks/${bookmarkId}`);
      setBookmarks(prev => prev.filter(b => b._id !== bookmarkId));
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to remove bookmark' 
      };
    }
  };

  const fetchBookmarks = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/bookmarks`);
      setBookmarks(response.data);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    }
  };

  const value = {
    articles,
    loading,
    bookmarks,
    fetchNews,
    addBookmark,
    removeBookmark,
    fetchBookmarks,
  };

  return (
    <NewsContext.Provider value={value}>
      {children}
    </NewsContext.Provider>
  );
};