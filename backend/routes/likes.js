const express = require('express');
const ArticleLike = require('../models/ArticleLike');
const { auth } = require('../middleware/auth');

const router = express.Router();

// GET like summary for an article
// /api/likes/summary?articleURL=...
router.get('/summary', async (req, res) => {
  try {
    const { articleURL } = req.query;
    if (!articleURL) return res.status(400).json({ message: 'articleURL is required' });

    const count = await ArticleLike.countDocuments({ articleURL });

    let likedByUser = false;
    if (req.headers.authorization) {
      try {
        // best-effort: if auth middleware not used, infer from token header isn't trivial here
        // clients should call /me or use POST/DELETE to know state; keep likedByUser false when unauthenticated
      } catch {}
    }

    res.json({ likeCount: count, likedByUser });
  } catch (e) {
    console.error('Like summary error:', e);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST toggle like (idempotent upsert)
// body: { articleURL, articleTitle }
router.post('/', auth, async (req, res) => {
  try {
    const { articleURL, articleTitle } = req.body;
    if (!articleURL || !articleTitle) {
      return res.status(400).json({ message: 'articleURL and articleTitle are required' });
    }

    const existing = await ArticleLike.findOne({ articleURL, user: req.user._id });
    if (existing) {
      // unlike
      await ArticleLike.deleteOne({ _id: existing._id });
      const likeCount = await ArticleLike.countDocuments({ articleURL });
      return res.json({ message: 'Unliked', liked: false, likeCount });
    }

    await ArticleLike.create({ articleURL, articleTitle, user: req.user._id });
    const likeCount = await ArticleLike.countDocuments({ articleURL });
    return res.status(201).json({ message: 'Liked', liked: true, likeCount });
  } catch (e) {
    if (e.code === 11000) {
      // unique index race, treat as liked
      const likeCount = await ArticleLike.countDocuments({ articleURL: req.body.articleURL });
      return res.json({ message: 'Already liked', liked: true, likeCount });
    }
    console.error('Toggle like error:', e);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


