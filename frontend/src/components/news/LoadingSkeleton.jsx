import React from 'react';

const LoadingSkeleton = () => {
  return (
    <div className="bg-gradient-to-br from-dark-200/80 to-dark-300/80 rounded-xl overflow-hidden shadow-xl border border-gray-700/50">
      {/* Image skeleton */}
      <div className="h-48 shimmer"></div>
      
      {/* Content skeleton */}
      <div className="p-6 space-y-4">
        {/* Title skeleton */}
        <div className="space-y-2">
          <div className="h-4 shimmer rounded w-full"></div>
          <div className="h-4 shimmer rounded w-3/4"></div>
        </div>
        
        {/* Description skeleton */}
        <div className="space-y-2">
          <div className="h-3 shimmer rounded w-full"></div>
          <div className="h-3 shimmer rounded w-full"></div>
          <div className="h-3 shimmer rounded w-2/3"></div>
        </div>
        
        {/* Footer skeleton */}
        <div className="flex justify-between items-center">
          <div className="h-3 shimmer rounded w-20"></div>
          <div className="h-3 shimmer rounded w-16"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;