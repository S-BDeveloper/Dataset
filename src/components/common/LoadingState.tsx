import React from "react";

interface LoadingStateProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = "Loading data from API...",
  size = "md",
}) => {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-xl",
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] space-y-4">
      <div
        className={`animate-spin rounded-full border-b-2 border-green-600 ${sizeClasses[size]}`}
      ></div>
      <p
        className={`text-stone-600 dark:text-stone-400 font-medium ${textSizes[size]}`}
      >
        {message}
      </p>
      <p className="text-stone-500 dark:text-stone-500 text-sm">
        This may take a few seconds on first load
      </p>
    </div>
  );
};

export const DataLoadingState: React.FC = () => (
  <LoadingState message="Loading Quranic data from API..." size="lg" />
);

export const SearchLoadingState: React.FC = () => (
  <LoadingState
    message="Searching across Quran, Hadith, and Authentic data..."
    size="md"
  />
);
