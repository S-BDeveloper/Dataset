import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";
import Button from "./Button";
import DarkModeToggle from "./DarkModeToggle";

// Navbar provides navigation links and authentication buttons
const Navbar: React.FC = () => {
  const { logout, login } = useAuth();
  const navigate = useNavigate();

  // Demo login handler (use your own demo credentials)
  const handleDemoLogin = async () => {
    await login("demo@example.com", "demopassword");
    navigate("/");
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="bg-green-700 dark:bg-green-800 text-white px-6 py-4 flex items-center justify-between shadow-lg rounded-b-2xl border-b-2 border-green-800/10 dark:border-green-700/20 transition-colors duration-300">
      <Link
        to="/"
        className="font-bold text-2xl sm:text-3xl tracking-tight focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded-lg px-2 py-1 transition"
        data-cy="home-link"
      >
        Quranic Signs & Guidance
      </Link>
      <div className="flex gap-6 items-center">
        {/* Dark Mode Toggle */}
        <div className="flex items-center">
          <DarkModeToggle />
        </div>

        <Link
          to="/favorites"
          data-cy="favorites-link"
          className="hover:underline focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded-lg px-2 py-1 transition flex items-center gap-1"
        >
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
          Saved Signs
        </Link>
        <Link
          to="/admin"
          data-cy="admin-link"
          className="hover:underline focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded-lg px-2 py-1 transition flex items-center gap-1"
        >
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
          Content Review
        </Link>
        <Link to="/login" data-cy="login-btn">
          <Button className="!px-3 !py-1.5" variant="primary">
            Login
          </Button>
        </Link>
        <Link to="/signup" data-cy="signup-btn">
          <Button className="!px-3 !py-1.5" variant="primary">
            Sign Up
          </Button>
        </Link>
        <Button
          className="!px-3 !py-1.5"
          variant="secondary"
          data-cy="demo-login-btn"
          onClick={handleDemoLogin}
        >
          Demo Login
        </Button>
        <Button
          className="!px-3 !py-1.5"
          variant="danger"
          data-cy="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
