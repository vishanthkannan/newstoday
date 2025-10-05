import React from 'react';
import NewsCardWithComments from './NewsCardWithComments';
import LoadingSkeleton from './LoadingSkeleton';

const NewsGrid = ({ articles, loading, bookmarks = [] }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 12 }).map((_, index) => (
          <LoadingSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!articles || articles.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-gray-400 text-2xl">📰</span>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No articles found</h3>
          <p className="text-gray-400">Try adjusting your search criteria or check back later for new content.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {articles.map((article, index) => {
        const bookmark = bookmarks.find(b => b.articleURL === article.url);
        return (
          <NewsCardWithComments
            key={article.url || index}
            article={article}
            isBookmarked={!!bookmark}
            bookmarkId={bookmark?._id}
          />
        );
      })}
    </div>
  );
};

export default NewsGrid;