import React, { useState } from "react";
import { SignTypesChart } from "./SignTypesChart";
import { WordPairsChart } from "./WordPairsChart";
import { CorrelationScatterPlot } from "./CorrelationScatterPlot";
import type { QuranicMiracle } from "../../types/Types";

interface ChartsDashboardProps {
  data: QuranicMiracle[];
}

// ChartsDashboard displays a collection of interactive charts
export const ChartsDashboard: React.FC<ChartsDashboardProps> = ({ data }) => {
  const [activeChart, setActiveChart] = useState<string>("all");

  const charts = [
    {
      id: "types",
      name: "Sign Types",
      component: (
        <SignTypesChart data={data} isActive={activeChart === "types"} />
      ),
    },
    {
      id: "pairs",
      name: "Word Pairs",
      component: (
        <WordPairsChart data={data} isActive={activeChart === "pairs"} />
      ),
    },
    {
      id: "correlation",
      name: "Correlation Analysis",
      component: (
        <CorrelationScatterPlot
          data={data}
          isActive={activeChart === "correlation"}
        />
      ),
    },
  ];

  const filteredCharts =
    activeChart === "all"
      ? charts
      : charts.filter((chart) => chart.id === activeChart);

  return (
    <div className="space-y-6">
      {/* Chart Navigation */}
      <div className="flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => setActiveChart("all")}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
            activeChart === "all"
              ? "bg-green-700 text-white shadow-md"
              : "bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-600"
          }`}
        >
          All Charts
        </button>
        {charts.map((chart) => (
          <button
            key={chart.id}
            onClick={() => setActiveChart(chart.id)}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
              activeChart === chart.id
                ? "bg-green-700 text-white shadow-md"
                : "bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-600"
            }`}
          >
            {chart.name}
          </button>
        ))}
      </div>

      {/* Charts Grid */}
      <div
        className={`grid gap-6 ${
          activeChart === "all" ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
        }`}
      >
        {filteredCharts.map((chart) => (
          <div key={chart.id} className="w-full">
            {chart.component}
          </div>
        ))}
      </div>

      {/* Chart Information - Only show when "All Charts" is selected */}
      {activeChart === "all" && (
        <div className="bg-stone-50 dark:bg-stone-700 rounded-xl p-4 border border-stone-200 dark:border-stone-600">
          <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2">
            Chart Features
          </h4>
          <ul className="text-sm text-stone-600 dark:text-stone-400 space-y-1">
            <li>
              • <strong>Interactive:</strong> Hover over chart elements to see
              detailed information
            </li>
            <li>
              • <strong>Responsive:</strong> Charts adapt to different screen
              sizes
            </li>
            <li>
              • <strong>Accessible:</strong> Screen reader friendly with proper
              ARIA labels
            </li>
            <li>
              • <strong>Dark Mode:</strong> All charts support light and dark
              themes
            </li>
            <li>
              • <strong>Export Ready:</strong> Charts can be saved as images
              (coming soon)
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
