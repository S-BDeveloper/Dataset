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
          <h1
            className="text-3xl md:text-4xl font-bold transform hover:scale-101 transition-transform duration-300 header-title"
            style={{
              color: "#F4E4BC", // Warm cream for light mode
              textShadow: `
                0 0 3px rgba(244, 228, 188, 0.4),
                0 0 6px rgba(244, 228, 188, 0.2),
                0 1px 2px rgba(0, 0, 0, 0.4),
                0 2px 4px rgba(0, 0, 0, 0.2),
                1px 1px 0px rgba(255, 215, 0, 0.1)
              `,
              filter: "drop-shadow(0 0 4px rgba(244, 228, 188, 0.1))",
              transform: "perspective(1000px) rotateX(1deg)",
              transformStyle: "preserve-3d",
            }}
          >
            {t("header.title")}
          </h1>
          <p
            className="text-lg max-w-3xl leading-relaxed font-medium transform hover:scale-101 transition-transform duration-300 header-description"
            style={{
              color: "#E8D5B7", // Softer beige for light mode
              textShadow: `
                0 0 2px rgba(232, 213, 183, 0.3),
                0 0 4px rgba(232, 213, 183, 0.2),
                0 1px 1px rgba(0, 0, 0, 0.3),
                0 1px 2px rgba(0, 0, 0, 0.2),
                1px 1px 0px rgba(255, 215, 0, 0.1)
              `,
              filter: "drop-shadow(0 0 3px rgba(232, 213, 183, 0.1))",
              transform: "perspective(1000px) rotateX(0.5deg)",
              transformStyle: "preserve-3d",
            }}
          >
            {t("header.description")}
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
              text-shadow: 
                0 0 3px rgba(212, 175, 55, 0.4),
                0 0 6px rgba(212, 175, 55, 0.2),
                0 1px 2px rgba(0, 0, 0, 0.4),
                0 2px 4px rgba(0, 0, 0, 0.2),
                1px 1px 0px rgba(255, 215, 0, 0.15) !important;
              filter: drop-shadow(0 0 4px rgba(212, 175, 55, 0.1)) !important;
            }
            .dark .header-description {
              color: #D4AF37 !important;
              text-shadow: 
                0 0 2px rgba(192, 192, 192, 0.3),
                0 0 4px rgba(192, 192, 192, 0.2),
                0 1px 1px rgba(0, 0, 0, 0.3),
                0 1px 2px rgba(0, 0, 0, 0.2),
                1px 1px 0px rgba(255, 215, 0, 0.1) !important;
              filter: drop-shadow(0 0 3px rgba(192, 192, 192, 0.1)) !important;
            }
          }
        `,
        }}
      />
    </header>
  );
};
