const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  articleTitle: {
    type: String,
    required: [true, 'Article title is required'],
    maxlength: [500, 'Title cannot be more than 500 characters']
  },
  articleURL: {
    type: String,
    required: [true, 'Article URL is required'],
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Please enter a valid URL'
    }
  },
  imageURL: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Please enter a valid image URL'
    }
  },
  publishedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate bookmarks
bookmarkSchema.index({ userId: 1, articleURL: 1 }, { unique: true });

module.exports = mongoose.model('Bookmark', bookmarkSchema);