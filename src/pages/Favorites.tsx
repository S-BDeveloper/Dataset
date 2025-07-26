import React from "react";
import { FactCard } from "../components/FactCard";
import { useFavorites } from "../hooks/useFavorites";
import Breadcrumb from "../components/Breadcrumb";

// Favorites page displays the user's favorited facts
const Favorites: React.FC = () => {
  const { favorites, removeFavorite } = useFavorites();

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <Breadcrumb />
      <h1 className="text-3xl font-bold text-green-700 dark:text-green-400 mb-6">
        Saved Signs
      </h1>
      {favorites.length === 0 ? (
        <div className="bg-white dark:bg-stone-800 rounded-2xl shadow border border-stone-200 dark:border-stone-700 p-8 text-center text-green-700 dark:text-green-400">
          You have no saved signs yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {favorites.map((fact) => (
            <FactCard
              key={fact.Fact + fact.Source}
              fact={fact}
              isFavorite={true}
              onFavorite={() => removeFavorite(fact)}
            />
          ))}
        </div>
      )}
    </main>
  );
};

export default Favorites;
