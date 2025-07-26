import React from "react";

interface LoadingSkeletonProps {
  count?: number;
}

// LoadingSkeleton displays a visual placeholder during data loading
const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ count = 8 }) => {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      aria-label="Loading skeletons"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-stone-100 animate-pulse rounded-2xl h-36 w-full shadow border border-stone-200"
          aria-label="Loading..."
        />
      ))}
    </div>
  );
};

export default LoadingSkeleton;
