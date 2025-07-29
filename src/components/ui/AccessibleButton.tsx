import React from "react";

// Backward compatibility types
export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

interface AccessibleButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  "aria-describedby"?: string;
  "aria-expanded"?: boolean;
  "aria-pressed"?: boolean;
}

export const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  iconPosition = "left",
  fullWidth = false,
  disabled,
  className = "",
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses = {
    primary: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
    secondary:
      "bg-stone-600 text-white hover:bg-stone-700 focus:ring-stone-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    ghost:
      "text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 focus:ring-stone-500",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const widthClass = fullWidth ? "w-full" : "";

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`;

  const isDisabled = disabled || loading;

  return (
    <button
      className={classes}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-busy={loading}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}

      {!loading && icon && iconPosition === "left" && (
        <span className="mr-2" aria-hidden="true">
          {icon}
        </span>
      )}

      <span>{children}</span>

      {!loading && icon && iconPosition === "right" && (
        <span className="ml-2" aria-hidden="true">
          {icon}
        </span>
      )}
    </button>
  );
};

// Backward compatibility export
const Button: React.FC<AccessibleButtonProps> = (props) => {
  return <AccessibleButton {...props} />;
};

export default Button;
