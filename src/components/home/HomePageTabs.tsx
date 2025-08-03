import React from "react";
import { useLanguage } from "../../hooks/useContext";

interface HomePageTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onTabChange?: (tabId: string) => void; // New prop for handling tab changes with scroll
}

export const HomePageTabs: React.FC<HomePageTabsProps> = ({
  activeTab,
  setActiveTab,
  onTabChange,
}) => {
  const { t } = useLanguage();

  const tabs = [
    { id: "all", label: t("tabs.data"), icon: "📖" },
    { id: "search", label: t("tabs.search"), icon: "🔍" },
    { id: "charts", label: t("tabs.charts"), icon: "📊" },
    { id: "quran", label: t("tabs.quran"), icon: "📜" },
    { id: "hadith", label: t("tabs.hadith"), icon: "📚" },
  ];

  // Handle tab click with scroll functionality
  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    // Call the scroll function if provided
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  return (
    <div className="border-b border-neutral-200 dark:border-stone-700 bg-stone-200 dark:bg-stone-700 rounded-t-2xl">
      <div className="flex flex-wrap gap-2 p-4 sm:p-6 justify-center sm:justify-start">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
              activeTab === tab.id
                ? "bg-green-600 text-white shadow-lg shadow-green-600/25 border-2 border-green-500"
                : "text-stone-600 dark:text-stone-900 hover:text-stone-800 dark:hover:text-stone-500 bg-stone-50 dark:bg-neutral-50/90 border-2 border-transparent hover:border-stone-300 dark:hover:border-stone-600"
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};
