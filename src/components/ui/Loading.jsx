import React from 'react';

const Loading = ({ variant = 'default' }) => {
  if (variant === 'table') {
    return (
      <div className="animate-pulse">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex space-x-4 p-4">
              <div className="w-12 h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4"></div>
                <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2"></div>
              </div>
              <div className="w-20 h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'cards') {
    return (
      <div className="animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg"></div>
                <div className="w-16 h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2"></div>
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-12">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-gray-200 rounded-full animate-spin"></div>
        <div className="absolute top-0 w-12 h-12 border-4 border-primary-500 rounded-full animate-spin border-t-transparent"></div>
      </div>
    </div>
  );
};

export default Loading;