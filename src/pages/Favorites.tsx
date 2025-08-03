import React from "react";
import { useFavorites } from "../hooks/useFavorites";
import Breadcrumb from "../components/common/Breadcrumb";
import { DataCard } from "../components/features/datacard/DataCard";
import { useAuth } from "../hooks/useContext";

// Favorites page displays the user's favorited Islamic data
const Favorites: React.FC = () => {
  const { favorites, removeFavorite, loading } = useFavorites();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-900 flex items-center justify-center">
        <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-lg p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
            Sign In Required
          </h2>
          <p className="text-stone-600 dark:text-stone-400 mb-6">
            Please sign in to view your saved favorites.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto mb-4"></div>
          <p className="text-stone-600 dark:text-stone-400">
            Loading favorites...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900 transition-colors duration-300">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <Breadcrumb />

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-green-700 dark:text-green-400 mb-4">
            My Saved Favorites
          </h1>
          <p className="text-lg text-stone-600 dark:text-stone-400 max-w-2xl leading-relaxed">
            Your personally saved Islamic knowledge. These data have been saved
            for quick access and reference.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-stone-800 rounded-xl p-4 shadow-lg border border-stone-200 dark:border-stone-700">
            <div className="text-3xl font-bold text-green-700 dark:text-green-400">
              {favorites.length}
            </div>
            <div className="text-base text-stone-600 dark:text-stone-400 font-medium">
              Total Saved
            </div>
          </div>
          <div className="bg-white dark:bg-stone-800 rounded-xl p-4 shadow-lg border border-stone-200 dark:border-stone-700">
            <div className="text-3xl font-bold text-blue-700 dark:text-blue-400">
              {
                Array.from(
                  new Set(
                    favorites.map((f) => ("type" in f ? f.type : "quran"))
                  )
                ).length
              }
            </div>
            <div className="text-base text-stone-600 dark:text-stone-400 font-medium">
              Categories
            </div>
          </div>
          <div className="bg-white dark:bg-stone-800 rounded-xl p-4 shadow-lg border border-stone-200 dark:border-stone-700">
            <div className="text-3xl font-bold text-purple-700 dark:text-purple-400">
              {
                favorites.filter(
                  (f) =>
                    "fulfillmentStatus" in f &&
                    f.fulfillmentStatus === "fulfilled"
                ).length
              }
            </div>
            <div className="text-base text-stone-600 dark:text-stone-400 font-medium">
              Fulfilled
            </div>
          </div>
        </div>

        {/* Favorites List */}
        {favorites.length === 0 ? (
          <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-lg border border-stone-200 dark:border-stone-700 p-12 text-center">
            <div className="max-w-md mx-auto">
              <svg
                className="w-16 h-16 text-stone-400 dark:text-stone-500 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-stone-700 dark:text-stone-300 mb-2">
                No favorites yet
              </h3>
              <p className="text-stone-500 dark:text-stone-400 mb-6">
                Start exploring Islamic knowledge to save your favorites for
                quick access.
              </p>
              <a
                href="/"
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Explore data
              </a>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((item) => {
              // Only render IslamicData items with DataCard
              if ("title" in item && "type" in item) {
                return (
                  <DataCard
                    key={item.title + item.type}
                    card={item}
                    isFavorite={true}
                    onFavorite={() => removeFavorite(item)}
                  />
                );
              }
              return null; // Skip Quran and Hadith items for now
            })}
          </div>
        )}

        {/* Quick Actions */}
        {favorites.length > 0 && (
          <div className="mt-8 bg-white dark:bg-stone-800 rounded-xl p-6 shadow-lg border border-stone-200 dark:border-stone-700">
            <h3 className="text-lg font-semibold text-stone-700 dark:text-stone-300 mb-4">
              Quick Actions
            </h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  // Export favorites as JSON
                  const dataStr = JSON.stringify(favorites, null, 2);
                  const dataUri =
                    "data:application/json;charset=utf-8," +
                    encodeURIComponent(dataStr);
                  const exportFileDefaultName = "my-favorites.json";
                  const linkElement = document.createElement("a");
                  linkElement.setAttribute("href", dataUri);
                  linkElement.setAttribute("download", exportFileDefaultName);
                  linkElement.click();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Export Favorites
              </button>
              <button
                onClick={() => {
                  if (
                    confirm(
                      "Are you sure you want to clear all favorites? This action cannot be undone."
                    )
                  ) {
                    favorites.forEach((miracle) => removeFavorite(miracle));
                  }
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                Clear All
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
