const express = require('express');
const User = require('../models/User');
const Bookmark = require('../models/Bookmark');

const router = express.Router();

// @route   GET /api/public/stats
// @desc    Public stats summary (safe, limited information)
// @access  Public
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const regularUsers = await User.countDocuments({ role: 'user' });
    const totalBookmarks = await Bookmark.countDocuments();

    res.json({
      totalUsers,
      adminUsers,
      regularUsers,
      totalBookmarks,
    });
  } catch (error) {
    console.error('Public stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
