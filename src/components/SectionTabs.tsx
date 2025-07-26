import React from "react";

interface SectionTabsProps {
  tabs: string[];
  activeTab: number;
  onTabChange: (tab: number) => void;
  children: React.ReactNode[];
}

// SectionTabs provides accessible tabbed navigation for sections
const SectionTabs: React.FC<SectionTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  children,
}) => {
  return (
    <div>
      <div
        className="flex gap-2 mb-4 border-b-2 border-stone-200 dark:border-stone-700"
        role="tablist"
        aria-label="Section Tabs"
      >
        {tabs.map((tab, i) => (
          <button
            key={tab}
            className={`px-6 py-2 rounded-t-2xl font-bold text-base shadow-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-green-400 border-b-4 ${
              i === activeTab
                ? "border-green-700 dark:border-green-500 text-green-700 dark:text-green-400 bg-white dark:bg-stone-800 shadow-md"
                : "border-transparent text-stone-500 dark:text-stone-400 bg-stone-50 dark:bg-stone-700 hover:text-green-700 dark:hover:text-green-400 hover:bg-stone-100 dark:hover:bg-stone-600"
            }`}
            onClick={() => onTabChange(i)}
            aria-selected={i === activeTab}
            aria-controls={`tabpanel-${i}`}
            id={`tab-${i}`}
            role="tab"
            tabIndex={i === activeTab ? 0 : -1}
          >
            {tab}
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        id={`tabpanel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
        className="bg-white dark:bg-stone-800 rounded-b-2xl shadow p-6"
      >
        {children[activeTab]}
      </div>
    </div>
  );
};

export default SectionTabs;
