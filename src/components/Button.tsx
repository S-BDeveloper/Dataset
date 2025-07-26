import React from "react";

export type ButtonVariant = "primary" | "secondary" | "danger";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
  loading?: boolean;
}

const baseClasses =
  "inline-flex items-center justify-center font-bold rounded-lg shadow transition-all duration-150 focus:outline-none focus:ring-2 px-4 py-2 text-base gap-2";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-green-700 text-white hover:bg-green-800 focus:ring-green-400 border border-green-700",
  secondary:
    "bg-yellow-400 text-green-900 hover:bg-yellow-300 focus:ring-yellow-400 border border-yellow-400",
  danger:
    "bg-red-600 text-white hover:bg-red-700 focus:ring-red-400 border border-red-600",
};

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  fullWidth = false,
  loading = false,
  className = "",
  children,
  ...props
}) => {
  return (
    <button
      className={[
        baseClasses,
        variantClasses[variant],
        fullWidth ? "w-full" : "",
        loading ? "opacity-60 cursor-not-allowed" : "",
        className,
      ].join(" ")}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && (
        <span className="w-4 h-4 mr-2 border-2 border-t-2 border-t-white border-white/40 rounded-full animate-spin"></span>
      )}
      {children}
    </button>
  );
};

export default Button;
