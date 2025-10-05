const mongoose = require('mongoose');

const articleLikeSchema = new mongoose.Schema(
  {
    articleURL: {
      type: String,
      required: true,
      index: true,
    },
    articleTitle: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

// Ensure each user can like an article only once
articleLikeSchema.index({ articleURL: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('ArticleLike', articleLikeSchema);


