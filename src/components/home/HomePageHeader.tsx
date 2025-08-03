import React from "react";
import { useLanguage } from "../../hooks/useContext";
import kaabaImage from "../../assets/kaaba-5462226.png";

export const HomePageHeader: React.FC = () => {
  const { t } = useLanguage();

  return (
    <header
      className="mb-8 relative rounded-xl overflow-hidden"
      style={{
        backgroundImage: `url(${kaabaImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "200px",
      }}
    >
      {/* Semi-transparent overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40 dark:bg-black/60"></div>

      {/* Content */}
      <div className="relative z-10 p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-xl shadow-black/50 dark:text-neutral-300">
            {t("header.title")}
          </h1>
          <p className="text-lg text-white/95 dark:text-neutral-300/90 max-w-3xl leading-relaxed drop-shadow-lg shadow-black/40 font-medium">
            {t("header.description")}
          </p>
        </div>
      </div>
    </header>
  );
};
