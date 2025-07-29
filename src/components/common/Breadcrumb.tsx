import React from "react";
import { Link, useLocation } from "react-router-dom";

interface BreadcrumbProps {
  items?: Array<{
    label: string;
    path?: string;
  }>;
}

// Breadcrumb component provides clear navigation context
const Breadcrumb: React.FC<BreadcrumbProps> = ({ items = [] }) => {
  const location = useLocation();

  // Default breadcrumbs based on current path
  const getDefaultBreadcrumbs = () => {
    const path = location.pathname;

    if (path === "/") {
      return [{ label: "Home" }];
    } else if (path === "/favorites") {
      return [{ label: "Home", path: "/" }, { label: "Saved Signs" }];
    } else if (path === "/admin") {
      return [{ label: "Home", path: "/" }, { label: "Content Review" }];
    } else if (path === "/profile") {
      return [{ label: "Home", path: "/" }, { label: "My Profile" }];
    }

    return [{ label: "Home", path: "/" }];
  };

  const breadcrumbs = items.length > 0 ? items : getDefaultBreadcrumbs();

  return (
    <nav
      className="flex items-center space-x-2 text-sm text-stone-600 mb-4"
      aria-label="Breadcrumb"
    >
      {breadcrumbs.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <svg
              className="w-4 h-4 text-stone-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          )}
          {item.path ? (
            <Link
              to={item.path}
              className="hover:text-green-700 hover:underline transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-green-700 font-medium">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
