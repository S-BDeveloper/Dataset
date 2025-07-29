import React, { useState } from "react";
import { SignTypesChart } from "./SignTypesChart";
import { PropheticStatusChart } from "./PropheticStatusChart";
import { PropheticTimelineChart } from "./PropheticTimelineChart";
import { SpatialProphecyMap } from "./SpatialProphecyMap";
import type { QuranicMiracle } from "../../../types/Types";
import Masonry from "react-masonry-css";
import "./ChartsDashboard.css";

interface ChartsDashboardProps {
  data: QuranicMiracle[];
}

// ChartsDashboard displays a collection of interactive charts
export const ChartsDashboard: React.FC<ChartsDashboardProps> = ({ data }) => {
  const [activeChart, setActiveChart] = useState<string>("all");

  const charts = [
    {
      id: "types",
      name: "Sign Types Distribution",
      description:
        "Visualization of different types of Quranic signs and miracles",
      component: (
        <SignTypesChart data={data} isActive={activeChart === "types"} />
      ),
    },
    {
      id: "prophetic-status",
      name: "Prophetic Fulfillment Status",
      description: "Pie chart showing the fulfillment status of prophecies",
      component: (
        <PropheticStatusChart
          data={data}
          isActive={activeChart === "prophetic-status"}
        />
      ),
    },
    {
      id: "prophecy",
      name: "Prophetic Timeline",
      description:
        "Timeline showing when prophecies were revealed and fulfilled",
      component: (
        <PropheticTimelineChart
          data={data}
          isActive={activeChart === "prophecy"}
        />
      ),
    },
    {
      id: "spatial",
      name: "Geographic Prophecy Map",
      description:
        "Spatial distribution of prophecies across different regions",
      component: (
        <SpatialProphecyMap data={data} isActive={activeChart === "spatial"} />
      ),
    },
  ];

  const filteredCharts =
    activeChart === "all"
      ? charts
      : charts.filter((chart) => chart.id === activeChart);

  // Masonry breakpoints for responsive layout
  const breakpointColumns = {
    default: 2,
    1400: 2,
    1024: 2,
    768: 1,
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-stone-900 dark:text-stone-100 mb-2">
          Charts & Analytics
        </h2>
        <p className="text-stone-600 dark:text-stone-400 text-lg">
          Interactive visualizations of Quranic signs and prophetic data
        </p>
      </div>

      {/* Chart Navigation */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-3 justify-center items-center">
          <button
            onClick={() => setActiveChart("all")}
            className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${
              activeChart === "all"
                ? "bg-green-600 text-white shadow-lg shadow-green-600/25"
                : "bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-600 border border-stone-200 dark:border-stone-600"
            }`}
          >
            📊 All Charts
          </button>
          {charts.map((chart) => (
            <button
              key={chart.id}
              onClick={() => setActiveChart(chart.id)}
              className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${
                activeChart === chart.id
                  ? "bg-green-600 text-white shadow-lg shadow-green-600/25"
                  : "bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-600 border border-stone-200 dark:border-stone-600"
              }`}
            >
              {chart.name}
            </button>
          ))}
        </div>
      </div>

      {/* Charts Layout */}
      {activeChart === "all" ? (
        // Masonry layout for "All Charts" view
        <div className="w-full">
          <Masonry
            breakpointCols={breakpointColumns}
            className="flex w-full"
            columnClassName="bg-clip-padding pr-6"
          >
            {filteredCharts.map((chart) => (
              <div key={chart.id} className="mb-8">
                <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-700 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100 mb-2">
                        {chart.name}
                      </h3>
                      <p className="text-sm text-stone-600 dark:text-stone-400">
                        {chart.description}
                      </p>
                    </div>
                    <div className="min-h-[400px] w-full overflow-visible">
                      {chart.component}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Masonry>
        </div>
      ) : (
        // Single chart view for individual selections
        <div className="w-full">
          <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-700 overflow-hidden">
            <div className="p-8">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-3">
                  {filteredCharts[0]?.name}
                </h3>
                <p className="text-stone-600 dark:text-stone-400 text-lg">
                  {filteredCharts[0]?.description}
                </p>
              </div>
              <div className="min-h-[500px] w-full overflow-visible">
                {filteredCharts[0]?.component}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Section */}
      {activeChart === "all" && (
        <div className="mt-12 text-center">
          <div className="bg-stone-50 dark:bg-stone-800/50 rounded-xl p-6 border border-stone-200 dark:border-stone-700">
            <h4 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-2">
              📈 Chart Insights
            </h4>
            <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">
              Explore different aspects of Quranic signs through these
              interactive visualizations. Each chart provides unique insights
              into the patterns and distributions of miraculous signs.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
