import React from "react";

export const HomePageHeader: React.FC = () => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl md:text-4xl font-bold text-green-700 dark:text-green-400 mb-4">
        Authentic Islamic Knowledge
      </h1>
      <p className="text-lg text-stone-600 dark:text-stone-400 max-w-3xl leading-relaxed">
        Discover the miraculous signs of Allah through Quranic verses,
        Sahih Bukhari's hadith collection, and scientific discoveries. Explore
        cross-references between different Islamic sources to deepen your
        understanding.
      </p>
    </div>
  );
};
