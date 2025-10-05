const express = require('express');
const Bookmark = require('../models/Bookmark');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/bookmarks
// @desc    Get user bookmarks
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    
    res.json(bookmarks);
  } catch (error) {
    console.error('Get bookmarks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/bookmarks
// @desc    Add bookmark
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { articleTitle, articleURL, imageURL, publishedAt } = req.body;

    // Check if bookmark already exists
    const existingBookmark = await Bookmark.findOne({
      userId: req.user._id,
      articleURL
    });

    if (existingBookmark) {
      return res.status(400).json({ message: 'Article already bookmarked' });
    }

    const bookmark = new Bookmark({
      userId: req.user._id,
      articleTitle,
      articleURL,
      imageURL,
      publishedAt: publishedAt || new Date()
    });

    await bookmark.save();
    res.status(201).json(bookmark);
  } catch (error) {
    console.error('Add bookmark error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join('. ') });
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Article already bookmarked' });
    }
    res.status(500).json({ message: 'Server error during bookmark creation' });
  }
});

// @route   DELETE /api/bookmarks/:id
// @desc    Remove bookmark
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const bookmark = await Bookmark.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!bookmark) {
      return res.status(404).json({ message: 'Bookmark not found' });
    }

    res.json({ message: 'Bookmark removed successfully' });
  } catch (error) {
    console.error('Remove bookmark error:', error);
    res.status(500).json({ message: 'Server error during bookmark removal' });
  }
});

// @route   DELETE /api/bookmarks/url
// @desc    Remove bookmark by URL
// @access  Private
router.delete('/url', auth, async (req, res) => {
  try {
    const { articleURL } = req.body;

    if (!articleURL) {
      return res.status(400).json({ message: 'Article URL is required' });
    }

    const bookmark = await Bookmark.findOneAndDelete({
      userId: req.user._id,
      articleURL
    });

    if (!bookmark) {
      return res.status(404).json({ message: 'Bookmark not found' });
    }

    res.json({ message: 'Bookmark removed successfully' });
  } catch (error) {
    console.error('Remove bookmark by URL error:', error);
    res.status(500).json({ message: 'Server error during bookmark removal' });
  }
});

module.exports = router;