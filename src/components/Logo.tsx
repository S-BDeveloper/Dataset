import { Link } from "react-router-dom";

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
        {/* Black Circle (Darkness) */}
        <svg
          className="w-8 h-8 text-stone-900 dark:text-stone-100"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <circle cx="12" cy="12" r="10" />
        </svg>

        {/* Light Bulb with Illumination Effect */}
        <svg
          className="absolute -top-1 -right-1 w-6 h-6 text-yellow-400 dark:text-yellow-300"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          {/* Light Rays - Illumination Effect */}
          <path
            d="M12 2 L14 4 L16 2 L18 4 L20 2"
            stroke="currentColor"
            strokeWidth="0.5"
            fill="none"
            opacity="0.6"
          />
          <path
            d="M12 2 L10 4 L8 2 L6 4 L4 2"
            stroke="currentColor"
            strokeWidth="0.5"
            fill="none"
            opacity="0.6"
          />
          <path
            d="M12 2 L13 5 L14 8"
            stroke="currentColor"
            strokeWidth="0.5"
            fill="none"
            opacity="0.6"
          />
          <path
            d="M12 2 L11 5 L10 8"
            stroke="currentColor"
            strokeWidth="0.5"
            fill="none"
            opacity="0.6"
          />

          {/* Bulb Glass */}
          <path d="M8 6 Q12 4 16 6 Q16 12 16 14 Q12 16 8 14 Q8 12 8 6 Z" />

          {/* Base/Screw */}
          <rect x="9" y="14" width="6" height="3" rx="1" />

          {/* Filament */}
          <path
            d="M10 8 Q12 6 14 8"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
          />
          <path
            d="M10 9 Q12 7 14 9"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
          />

          {/* Inner Glow */}
          <path
            d="M9 7 Q12 5 15 7 Q15 13 15 15 Q12 17 9 15 Q9 13 9 7 Z"
            className="opacity-30"
          />
        </svg>
      </div>

      {/* App Name */}
      {showText && (
        <div className="flex flex-col">
          <span className="text-xl font-bold text-green-700 dark:text-green-400 leading-tight">
            Islamic Signs
          </span>
          <span className="text-xs text-stone-500 dark:text-stone-400 leading-tight">
            & Guidance
          </span>
        </div>
      )}
    </Link>
  );
}
