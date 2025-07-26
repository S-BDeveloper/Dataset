import React from "react";

interface PaginationButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isActive?: boolean;
  children: React.ReactNode;
  ariaLabel?: string;
}

// PaginationButton provides accessible pagination controls
const PaginationButton: React.FC<PaginationButtonProps> = ({
  onClick,
  disabled = false,
  isActive = false,
  children,
  ariaLabel,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-3 py-1 rounded-lg font-semibold text-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-green-400 border ${
        isActive
          ? "bg-green-700 text-white border-green-700 shadow-md"
          : disabled
          ? "bg-stone-100 dark:bg-stone-700 text-stone-400 dark:text-stone-500 border-stone-200 dark:border-stone-600 cursor-not-allowed"
          : "bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-300 dark:border-stone-600 hover:bg-stone-50 dark:hover:bg-stone-700 hover:border-stone-400 dark:hover:border-stone-500"
      }`}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
};

export default PaginationButton;
