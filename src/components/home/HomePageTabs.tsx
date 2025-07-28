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
    { id: "all", label: "All Signs" },
    { id: "search", label: "Cross-Reference Search" },
    { id: "charts", label: "Charts & Graphs" },
    { id: "quran", label: "Quran" },
    { id: "hadith", label: "Hadith" },
  ];

  return (
    <div className="border-b border-stone-200 dark:border-stone-700">
      <div className="flex flex-wrap gap-1 p-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                : "text-stone-600 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};
