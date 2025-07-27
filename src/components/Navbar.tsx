import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";
import { useFavorites } from "../hooks/useFavorites";
import Button from "./Button";
import DarkModeToggle from "./DarkModeToggle";

// Navbar provides navigation links and authentication buttons
const Navbar: React.FC = () => {
  const { user, logout, login } = useAuth();
  const { favorites } = useFavorites();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // NavLink component for consistent styling
  const NavLink: React.FC<{
    to: string;
    label: string;
    icon: React.ReactNode;
    variant?: "primary" | "secondary";
  }> = ({ to, label, icon, variant }) => {
    const baseClasses =
      "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors";

    const variantClasses =
      variant === "primary"
        ? "bg-green-600 text-white hover:bg-green-700"
        : variant === "secondary"
        ? "bg-stone-600 text-white hover:bg-stone-700"
        : isActive(to)
        ? "text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30"
        : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-50 dark:hover:bg-stone-700";

    return (
      <Link to={to} className={`${baseClasses} ${variantClasses}`}>
        {icon}
        <span>{label}</span>
      </Link>
    );
  };

  // Demo login handler (use your own demo credentials)
  const handleDemoLogin = async () => {
    await login("demo@example.com", "demopassword");
    navigate("/");
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    {
      to: "/",
      label: "Home",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      to: "/favorites",
      label: "Saved Signs",
      icon: (
        <div className="relative">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
          </svg>
          {favorites.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {favorites.length > 99 ? "99+" : favorites.length}
            </span>
          )}
        </div>
      ),
    },
  ];

  const actionLinks: Array<{
    to: string;
    label: string;
    icon: React.ReactNode;
    variant?: "primary" | "secondary";
  }> = [
    {
      to: "/submit-discovery",
      label: "Submit Discovery",
      icon: (
        <svg
          className="w-2 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 22 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      ),
      variant: "primary",
    },
  ];

  // Add admin link if user is admin
  if (user?.email === "admin@example.com") {
    actionLinks.push({
      to: "/admin",
      label: "Content Review",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      variant: "secondary",
    });
  }

  return (
    <nav className="bg-white dark:bg-stone-800 shadow-lg border-b border-stone-200 dark:border-stone-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand */}
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center space-x-2 text-xl font-bold text-green-700 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 transition-colors"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              <span>Islamic Signs and Guidance</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Main Navigation Links */}
            <div className="flex items-center space-x-6">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  label={link.label}
                  icon={link.icon}
                />
              ))}
            </div>

            {/* Action Links */}
            <div className="flex items-center space-x-4">
              {actionLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  label={link.label}
                  icon={link.icon}
                  variant={link.variant}
                />
              ))}
            </div>

            {/* Authentication */}
            <div className="flex items-center space-x-4">
              <DarkModeToggle />
              {user ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-stone-600 dark:text-stone-400">
                    {user.email}
                  </span>
                  <Button onClick={handleLogout} variant="secondary">
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Button onClick={handleDemoLogin} variant="secondary">
                    Demo Login
                  </Button>
                  <Button
                    onClick={() => login("demo@example.com", "demopassword")}
                    variant="primary"
                  >
                    Sign In
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 focus:outline-none focus:text-stone-900 dark:focus:text-stone-100"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-stone-200 dark:border-stone-700">
              {/* Main Navigation Links */}
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(link.to)
                      ? "text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30"
                      : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-50 dark:hover:bg-stone-700"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              ))}

              {/* Action Links */}
              {actionLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    link.variant === "primary"
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : link.variant === "secondary"
                      ? "bg-stone-600 text-white hover:bg-stone-700"
                      : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-50 dark:hover:bg-stone-700"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              ))}

              {/* Authentication */}
              <div className="pt-4 border-t border-stone-200 dark:border-stone-700">
                <div className="flex items-center justify-between px-3 py-2">
                  <DarkModeToggle />
                  {user ? (
                    <div className="flex flex-col space-y-2">
                      <span className="text-sm text-stone-600 dark:text-stone-400">
                        {user.email}
                      </span>
                      <Button onClick={handleLogout} variant="secondary">
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <div className="flex space-x-2">
                      <Button onClick={handleDemoLogin} variant="secondary">
                        Demo
                      </Button>
                      <Button onClick={() => login("", "")} variant="primary">
                        Sign In
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
