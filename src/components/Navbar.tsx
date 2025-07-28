import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";
import { useFavorites } from "../hooks/useFavorites";
import DarkModeToggle from "./DarkModeToggle";
import { LanguageSelector } from "./LanguageSelector";
import { useLanguage } from "../hooks/useLanguage";
import { Logo } from "./Logo";

export default function Navbar() {
  const { user, login, logout } = useAuth();
  const { favorites } = useFavorites();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useLanguage();

  const handleLogin = () => {
    // Demo login with default credentials
    login("demo@example.com", "demopassword");
  };

  const handleLogout = () => {
    logout();
  };

  // NavLink component for consistent styling
  const NavLink = ({
    to,
    children,
    className = "",
  }: {
    to: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <Link
      to={to}
      className={`text-base font-medium transition-colors hover:text-green-700 dark:hover:text-green-400 ${className} ${
        location.pathname === to
          ? "text-green-700 dark:text-green-400"
          : "text-stone-600 dark:text-stone-400"
      }`}
      onClick={() => setIsMenuOpen(false)}
    >
      {children}
    </Link>
  );

  return (
    <nav className="bg-green-100/95 dark:bg-green-900/30 shadow-lg border-b border-green-300/70 dark:border-green-700/50 sticky top-0 z-40 w-full overflow-hidden">
      <div className="container mx-auto max-w-7xl px-2 sm:px-4 w-full overflow-hidden">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLink to="/">{t("nav.home")}</NavLink>
            <NavLink to="/favorites">
              {t("nav.favorites")}
              {favorites.length > 0 && (
                <span className="ml-1 inline-flex items-center justify-center px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                  {favorites.length}
                </span>
              )}
            </NavLink>
            <NavLink to="/submit-discovery">{t("nav.submit")}</NavLink>
            {user?.email === "admin@example.com" && (
              <NavLink to="/admin">{t("nav.admin")}</NavLink>
            )}
          </div>

          {/* Right side controls */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSelector />
            <DarkModeToggle />
            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-stone-600 dark:text-stone-400">
                  {user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
                >
                  {t("nav.logout")}
                </button>
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="px-4 py-2 text-sm font-medium text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
              >
                {t("nav.login")}
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <LanguageSelector />
            <DarkModeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-stone-200 dark:border-stone-700 w-full overflow-hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 w-full">
              <NavLink to="/" className="block px-3 py-2 rounded-md">
                {t("nav.home")}
              </NavLink>
              <NavLink to="/favorites" className="block px-3 py-2 rounded-md">
                {t("nav.favorites")}
                {favorites.length > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                    {favorites.length}
                  </span>
                )}
              </NavLink>
              <NavLink
                to="/submit-discovery"
                className="block px-3 py-2 rounded-md"
              >
                {t("nav.submit")}
              </NavLink>
              {user?.email === "admin@example.com" && (
                <NavLink to="/admin" className="block px-3 py-2 rounded-md">
                  {t("nav.admin")}
                </NavLink>
              )}
              {user ? (
                <div className="px-3 py-2">
                  <span className="text-sm text-stone-600 dark:text-stone-400 block">
                    {user.email}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="mt-2 text-sm font-medium text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
                  >
                    {t("nav.logout")}
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleLogin}
                  className="block w-full text-left px-3 py-2 text-sm font-medium text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
                >
                  {t("nav.login")}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
