import React, { useState } from "react";
import { PropheticStatusChart } from "./PropheticStatusChart";
import { PropheticTimelineChart } from "./PropheticTimelineChart";
import { SpatialProphecyMap } from "./SpatialProphecyMap";
import { DataTypesChart } from "./DataTypesChart";
import { CategoryPieChart } from "./CategoryPieChart";
import type { IslamicData } from "../../../types/Types";

interface ChartsDashboardProps {
  data: IslamicData[];
}

export const ChartsDashboard: React.FC<ChartsDashboardProps> = ({ data }) => {
  // Debug logging
  console.log("ChartsDashboard - Received data:", data);
  console.log("ChartsDashboard - Data length:", data.length);

  const [viewMode, setViewMode] = useState<"single" | "overview">("overview");
  const [activeChart, setActiveChart] = useState<string>("all");

  const charts = [
    {
      id: "sign-types",
      title: "Sign Types Distribution",
      component: DataTypesChart,
    },
    {
      id: "category-pie",
      title: "Category Distribution",
      component: CategoryPieChart,
    },
    {
      id: "status",
      title: "Status Distribution",
      component: PropheticStatusChart,
    },
    {
      id: "timeline",
      title: "Timeline",
      component: PropheticTimelineChart,
    },
    {
      id: "geographic",
      title: "Geographic Distribution",
      component: SpatialProphecyMap,
    },
  ];

  const handleChartClick = (chartId: string) => {
    setActiveChart(chartId);
    setViewMode("single");
  };

  const handleBackToOverview = () => {
    setViewMode("overview");
    setActiveChart("all");
  };

  if (viewMode === "single" && activeChart !== "all") {
    const selectedChart = charts.find((chart) => chart.id === activeChart);
    if (!selectedChart) return null;

    const ChartComponent = selectedChart.component;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-200">
            {selectedChart.title}
          </h2>
          <button
            onClick={handleBackToOverview}
            className="px-4 py-2 bg-stone-600 text-white rounded-lg hover:bg-stone-700 transition-colors"
          >
            Back to All Charts
          </button>
        </div>
        <ChartComponent data={data} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-200">
          Data Visualizations
        </h2>
        <div className="flex flex-wrap gap-2">
          {charts.map((chart) => (
            <button
              key={chart.id}
              onClick={() => handleChartClick(chart.id)}
              className="px-3 py-1 text-sm bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200 rounded-md hover:bg-stone-300 dark:hover:bg-stone-600 transition-colors"
            >
              {chart.title}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {charts.map((chart) => {
          const ChartComponent = chart.component;
          return (
            <div key={chart.id} className="w-full">
              <ChartComponent data={data} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
