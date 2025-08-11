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
      <div className="absolute inset-0 bg-black/60 dark:bg-black/60"></div>

      {/* Content */}
      <div className="relative z-10 p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
          <h1
            className="text-3xl md:text-4xl font-bold header-title"
            style={{
              color: "#F5F5DC", // Lighter cream for better contrast in light mode
              textShadow: "0 2px 4px rgba(0, 0, 0, 0.8)",
            }}
          >
            {t("header.title")}
          </h1>
        </div>

        {/* Subtitle */}
        <div className="mt-4">
          <p
            className="text-lg md:text-xl font-medium header-subtitle"
            style={{
              color: "#F5F5DC", // Lighter cream for better contrast in light mode
              textShadow: "0 2px 4px rgba(0, 0, 0, 0.8)",
            }}
          >
            Access comprehensive Islamic Knowledge through Quranic verses, and
            Hadith collections.
          </p>
        </div>
      </div>

      {/* Dark mode styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
           @media (prefers-color-scheme: dark) {
             .dark .header-title {
               color: #D4AF37 !important;
               text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8) !important;
             }
             
             .dark .header-subtitle {
               color: #D4AF37 !important;
               text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8) !important;
             }
           }
         `,
        }}
      />
    </header>
  );
};
