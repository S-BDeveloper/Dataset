import React from "react";

interface HomePageTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const HomePageTabs: React.FC<HomePageTabsProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const tabs = [
    { id: "all", label: "Data", icon: "📖" },
    { id: "search", label: "Cross-Reference Search", icon: "🔍" },
    { id: "charts", label: "Charts & Analytics", icon: "📊" },
    { id: "quran", label: "Quran", icon: "📜" },
    { id: "hadith", label: "Hadith", icon: "📚" },
  ];

  return (
    <div className="border-b border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800">
      <div className="flex flex-wrap gap-2 p-4 sm:p-6 justify-center sm:justify-start">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
              activeTab === tab.id
                ? "bg-green-600 text-white shadow-lg shadow-green-600/25 border-2 border-green-500"
                : "text-stone-600 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 bg-stone-50 dark:bg-stone-700/50 border-2 border-transparent hover:border-stone-300 dark:hover:border-stone-600"
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
