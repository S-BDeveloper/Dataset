import React from "react";
import { useLanguage } from "../../hooks/useContext";

interface LoadingStateProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = "Loading data from API...",
  size = "md",
}) => {
  const { t } = useLanguage();

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-stone-300 border-t-green-600`}
      ></div>
      <p className="text-stone-600 dark:text-stone-400 text-center">
        {message}
      </p>
      <p className="text-xs text-stone-500 dark:text-stone-500 text-center">
        {t("loading.mayTakeTime")}
      </p>
    </div>
  );
};

export const DataLoadingState: React.FC = () => {
  const { t } = useLanguage();
  return <LoadingState message={t("loading.quranic")} size="lg" />;
};

export const SearchLoadingState: React.FC = () => {
  const { t } = useLanguage();
  return <LoadingState message={t("loading.search")} size="lg" />;
};
