const express = require('express');
const axios = require('axios');
const { URL } = require('url');

const router = express.Router();

// GNews API configuration
const GNEWS_API_KEY = process.env.GNEWS_API_KEY;
const GNEWS_BASE_URL = 'gnews.io';

// Helper function to make HTTPS requests using axios
const makeGNewsRequest = async (path) => {
  try {
    const response = await axios.get(`https://${GNEWS_BASE_URL}${path}`, {
      timeout: 30000, // 30 seconds timeout
      headers: {
        'User-Agent': 'NewsFlow/1.0'
      },
      family: 4, // Force IPv4 to avoid IPv6 issues
      validateStatus: function (status) {
        return status < 500; // Resolve only if the status code is less than 500
      }
    });
    return response.data;
  } catch (error) {
    console.error('Axios request error:', error.message);
    throw error;
  }
};

// @route   GET /api/news
// @desc    Get news articles
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { 
      category = 'general', 
      country = 'us', 
      q, 
      lang = 'en',
      max = 20 
    } = req.query;

    // Build API path
    let apiPath = `/api/v4/top-headlines?apikey=${GNEWS_API_KEY}&lang=${lang}&max=${max}`;
    
    // Add parameters based on query
    if (q) {
      // Use search endpoint for queries
      apiPath = `/api/v4/search?apikey=${GNEWS_API_KEY}&q=${encodeURIComponent(q)}&lang=${lang}&max=${max}`;
      if (country) apiPath += `&country=${country}`;
    } else {
      // Use top-headlines endpoint for categories
      if (category && category !== 'general') apiPath += `&category=${category}`;
      if (country) apiPath += `&country=${country}`;
    }

    console.log('GNews API Request:', apiPath);

    const data = await makeGNewsRequest(apiPath);

    if (data.errors) {
      console.error('GNews API Error:', data.errors);
      return res.status(400).json({ 
        message: 'News API error', 
        errors: data.errors 
      });
    }

    // Transform the data to match our frontend expectations
    const transformedArticles = data.articles ? data.articles.map(article => ({
      title: article.title,
      description: article.description,
      url: article.url,
      image: article.image,
      publishedAt: article.publishedAt,
      source: {
        name: article.source?.name || 'Unknown'
      }
    })) : [];

    res.json({
      status: 'success',
      totalArticles: data.totalArticles || transformedArticles.length,
      articles: transformedArticles
    });

  } catch (error) {
    console.error('News fetch error:', error);
    
    // Return fallback data in case of API failure
    const fallbackArticles = [
      {
        title: "Stay Updated with Latest News",
        description: "We're working to bring you the latest news. Please try again in a moment.",
        url: "#",
        image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=200&fit=crop",
        publishedAt: new Date().toISOString(),
        source: { name: "NewsFlow" }
      }
    ];

    res.json({
      status: 'fallback',
      totalArticles: 1,
      articles: fallbackArticles,
      message: 'Using fallback data due to API unavailability'
    });
  }
});

// @route   GET /api/news/search
// @desc    Search news articles
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const { 
      q, 
      country = 'us', 
      lang = 'en',
      max = 20,
      from,
      to
    } = req.query;

    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    let apiPath = `/api/v4/search?apikey=${GNEWS_API_KEY}&q=${encodeURIComponent(q)}&lang=${lang}&max=${max}`;
    
    if (country) apiPath += `&country=${country}`;
    if (from) apiPath += `&from=${from}`;
    if (to) apiPath += `&to=${to}`;

    const data = await makeGNewsRequest(apiPath);

    if (data.errors) {
      return res.status(400).json({ 
        message: 'News search error', 
        errors: data.errors 
      });
    }

    const transformedArticles = data.articles ? data.articles.map(article => ({
      title: article.title,
      description: article.description,
      url: article.url,
      image: article.image,
      publishedAt: article.publishedAt,
      source: {
        name: article.source?.name || 'Unknown'
      }
    })) : [];

    res.json({
      status: 'success',
      totalArticles: data.totalArticles || transformedArticles.length,
      articles: transformedArticles
    });

  } catch (error) {
    console.error('News search error:', error);
    res.status(500).json({ message: 'Server error during news search' });
  }
});

module.exports = router;