import React, { useState } from "react";
import { ResponsivePie } from "@nivo/pie";
import type { IslamicData } from "../../../types/Types";

interface PropheticStatusChartProps {
  data: IslamicData[];
  isActive?: boolean;
}

interface ChartDataItem {
  id: string;
  label: string;
  value: number;
  color: string;
}

export const PropheticStatusChart: React.FC<PropheticStatusChartProps> = ({
  data,
  isActive = false,
}) => {
  const [viewMode, setViewMode] = useState<"status" | "category">("status");

  const getChartData = (): ChartDataItem[] => {
    if (viewMode === "status") {
      const statusCounts: Record<string, number> = {};
      data.forEach((prophecy) => {
        const status = prophecy.fulfillmentStatus || "unknown";
        statusCounts[status] = (statusCounts[status] || 0) + 1;
      });

      return Object.entries(statusCounts).map(([status, count]) => ({
        id: status,
        label: getStatusLabel(status),
        value: count,
        color: getStatusColor(status),
      }));
    } else {
      const categoryCounts: Record<string, number> = {};
      data.forEach((prophecy) => {
        const category = prophecy.prophecyCategory || "unknown";
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      });

      return Object.entries(categoryCounts).map(([category, count]) => ({
        id: category,
        label: category.charAt(0).toUpperCase() + category.slice(1),
        value: count,
        color: getCategoryColor(category),
      }));
    }
  };

  const getStatusColor = (status: string): string => {
    const colors = {
      fulfilled: "#10b981", // Green
      "in-progress": "#f59e0b", // Amber
      "partially-fulfilled": "#3b82f6", // Blue
      pending: "#6b7280", // Gray
      unknown: "#6b7280", // Gray
    };
    return colors[status as keyof typeof colors] || colors.unknown;
  };

  const getStatusLabel = (status: string): string => {
    const labels = {
      fulfilled: "Fulfilled",
      "in-progress": "In Progress",
      "partially-fulfilled": "Partially Fulfilled",
      pending: "Pending",
      unknown: "Unknown",
    };
    return labels[status as keyof typeof labels] || "Unknown";
  };

  const getCategoryColor = (category: string): string => {
    const colors = {
      historical: "#ef4444", // Red
      scientific: "#10b981", // Green
      social: "#3b82f6", // Blue
      political: "#8b5cf6", // Purple
      environmental: "#f59e0b", // Amber
      unknown: "#6b7280", // Gray
    };
    return colors[category as keyof typeof colors] || colors.unknown;
  };

  const chartData = getChartData();

  return (
    <div
      className="w-full bg-white dark:bg-stone-800 rounded-2xl shadow-lg border border-stone-200 dark:border-stone-700 p-6 chart-container"
      aria-label="Interactive pie chart showing prophetic fulfillment status"
    >
      <h3 className="text-lg font-bold text-green-700 dark:text-green-400 mb-6 text-center">
        Prophetic Fulfillment Status
      </h3>

      {/* View Mode Toggle */}
      <div className="flex justify-center mb-6">
        <div className="flex bg-stone-100 dark:bg-stone-700 rounded-lg p-1">
          <button
            onClick={() => setViewMode("status")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === "status"
                ? "bg-green-600 text-white shadow-sm"
                : "text-stone-600 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200"
            }`}
          >
            By Status
          </button>
          <button
            onClick={() => setViewMode("category")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === "category"
                ? "bg-green-600 text-white shadow-sm"
                : "text-stone-600 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200"
            }`}
          >
            By Category
          </button>
        </div>
      </div>

      <div className="w-full h-full min-h-[400px] min-w-[200px] nivo-chart">
        <ResponsivePie
          data={chartData}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          innerRadius={0.5}
          padAngle={0.7}
          cornerRadius={3}
          activeOuterRadiusOffset={8}
          borderWidth={1}
          borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor="#333333"
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: "color" }}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
          legends={[
            {
              anchor: "bottom",
              direction: "row",
              justify: false,
              translateX: 0,
              translateY: 56,
              itemsSpacing: 0,
              itemWidth: 100,
              itemHeight: 18,
              itemTextColor: "#999",
              itemDirection: "left-to-right",
              itemOpacity: 1,
              symbolSize: 18,
              symbolShape: "circle",
            },
          ]}
          tooltip={({ datum }) => (
            <div className="bg-white dark:bg-stone-800 p-3 rounded-lg shadow-lg border border-stone-200 dark:border-stone-700 dark:text-stone-100">
              <div className="font-semibold text-stone-900 dark:text-stone-100">
                {datum.label}
              </div>
              <div className="text-stone-600 dark:text-stone-100">
                {datum.value} signs
              </div>
            </div>
          )}
        />
      </div>

      {/* Explanation - Only show when this chart is active */}
      {isActive && (
        <div className="mt-4 p-3 bg-stone-50 dark:bg-stone-700 rounded-lg border border-stone-200 dark:border-stone-600">
          <h4 className="text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">
            Understanding This Chart:
          </h4>
          <ul className="text-xs text-stone-600 dark:text-stone-400 space-y-1">
            <li>
              • <strong>Fulfillment Status:</strong> Shows how many prophecies
              have been fulfilled vs. pending
            </li>
            <li>
              • <strong>Category View:</strong> Switch to see prophecies by
              category (historical, scientific, etc.)
            </li>
            <li>
              • <strong>Color Coded:</strong> Each status/category has a
              distinct color for easy identification
            </li>
            <li>
              • <strong>Interactive:</strong> Hover over segments for detailed
              information
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
