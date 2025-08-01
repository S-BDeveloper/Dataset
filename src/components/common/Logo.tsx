import { Link } from "react-router-dom";
import bookImage from "../../assets/5179ed07851a80de976e57843ec0f946.png";

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({ className = "", showText = true }: LogoProps) {
  return (
    <Link
      to="/"
      className={`flex items-center space-x-2 hover:opacity-80 transition-opacity ${className}`}
    >
      {/* Knowledge from Darkness Icon */}
      <div className="relative">
        {/* Dark Circle Background */}
        <div className="w-12 h-12 bg-blue-900 dark:bg-blue-950 rounded-full flex items-center justify-center relative overflow-hidden">
          {/* Enhanced yellow illuminating glow effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-yellow-400/40 via-yellow-300/25 to-transparent rounded-full"></div>

          {/* Additional glow rings with more intensity */}
          <div className="absolute inset-0 border-2 border-yellow-400/50 rounded-full"></div>
          <div className="absolute inset-1 border border-yellow-300/40 rounded-full"></div>
          <div className="absolute inset-2 border border-yellow-200/30 rounded-full"></div>

          {/* Book image */}
          <img
            src={bookImage}
            alt="Quran Book"
            className="w-8 h-8 object-contain z-10 relative"
          />
        </div>
      </div>

      {/* App Name */}
      {showText && (
        <div className="flex flex-col">
          <span className="text-xl font-bold text-green-700 dark:text-green-400 leading-tight">
            Reflect
          </span>
          <span className="text-xs text-stone-500 dark:text-stone-400 leading-tight">
            & Implement
          </span>
        </div>
      )}
    </Link>
  );
}
