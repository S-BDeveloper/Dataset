import React from "react";
import type { IslamicData, QuranAyah, HadithEntry } from "../../types/Types";
import type { FavoriteItem } from "../../hooks/useFavorites";

interface HomePageStatsProps {
  cards: IslamicData[];
  quranData: QuranAyah[];
  hadithData: HadithEntry[];
  favorites: FavoriteItem[];
}

export const HomePageStats: React.FC<HomePageStatsProps> = ({
  cards,
  quranData,
  hadithData,
  favorites,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-white dark:bg-stone-800 rounded-xl p-4 shadow-lg border border-stone-200 dark:border-stone-700">
        <div className="text-2xl font-bold text-green-700 dark:text-green-400">
          {cards.length}
        </div>
        <div className="text-sm text-stone-600 dark:text-stone-400">
          Authentic Islamic Data
        </div>
      </div>
      <div className="bg-white dark:bg-stone-800 rounded-xl p-4 shadow-lg border border-stone-200 dark:border-stone-700">
        <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">
          {quranData.length}
        </div>
        <div className="text-sm text-stone-600 dark:text-stone-400">
          Quran Verses
        </div>
      </div>
      <div className="bg-white dark:bg-stone-800 rounded-xl p-4 shadow-lg border border-stone-200 dark:border-stone-700">
        <div className="text-2xl font-bold text-purple-700 dark:text-purple-400">
          {hadithData.length}
        </div>
        <div className="text-sm text-stone-600 dark:text-stone-400">
          Hadiths
        </div>
      </div>
      <div className="bg-white dark:bg-stone-800 rounded-xl p-4 shadow-lg border border-stone-200 dark:border-stone-700">
        <div className="text-2xl font-bold text-orange-700 dark:text-orange-400">
          {favorites.length}
        </div>
        <div className="text-sm text-stone-600 dark:text-stone-400">
          Favorites
        </div>
      </div>
    </div>
  );
};
