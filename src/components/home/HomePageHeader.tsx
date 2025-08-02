import React from "react";
import { useLanguage } from "../../hooks/useContext";

export const HomePageHeader: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="mb-8">
      <h1 className="text-3xl md:text-4xl font-bold text-green-700 dark:text-green-400 mb-4">
        {t("header.title")}
      </h1>
      <p className="text-lg text-stone-600 dark:text-stone-400 max-w-3xl leading-relaxed">
        {t("header.description")}
      </p>
    </div>
  );
};
