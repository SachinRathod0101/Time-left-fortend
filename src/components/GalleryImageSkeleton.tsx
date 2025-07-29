import React from 'react';

const GalleryImageSkeleton: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-lg shadow-lg h-72 bg-gray-300">
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-gray-400/30 to-transparent"></div>
    </div>
  );
};

export default GalleryImageSkeleton;