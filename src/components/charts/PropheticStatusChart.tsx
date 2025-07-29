import React, { useState } from "react";
import { ResponsivePie } from "@nivo/pie";
import type { QuranicMiracle } from "../../types/Types";

interface PropheticStatusChartProps {
  data: QuranicMiracle[];
  isActive?: boolean;
}

export const PropheticStatusChart: React.FC<PropheticStatusChartProps> = ({
  data,
  isActive = false,
}) => {
  const [viewMode, setViewMode] = useState<"status" | "category">("status");

  const getChartData = () => {
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
    const colors: Record<string, string> = {
      fulfilled: "#10b981", // Green
      "in-progress": "#f59e0b", // Amber
      pending: "#3b82f6", // Blue
      "partially-fulfilled": "#8b5cf6", // Purple
      unknown: "#6b7280", // Gray
    };
    return colors[status] || colors.unknown;
  };

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      historical: "#ef4444", // Red
      scientific: "#3b82f6", // Blue
      social: "#10b981", // Green
      natural: "#f59e0b", // Amber
      cosmological: "#8b5cf6", // Purple
      technological: "#06b6d4", // Cyan
      unknown: "#6b7280", // Gray
    };
    return colors[category] || colors.unknown;
  };

  const getStatusLabel = (status: string): string => {
    const labels: Record<string, string> = {
      fulfilled: "Fulfilled",
      "in-progress": "In Progress",
      pending: "Pending",
      "partially-fulfilled": "Partially Fulfilled",
      unknown: "Unknown",
    };
    return labels[status] || "Unknown";
  };

  const chartData = getChartData();

  return (
    <div className="h-full">
      {/* Chart Controls */}
      <div className="mb-4 flex justify-center">
        <div className="flex rounded-lg bg-stone-100 dark:bg-stone-700 p-1">
          <button
            onClick={() => setViewMode("status")}
            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
              viewMode === "status"
                ? "bg-white dark:bg-stone-600 text-stone-900 dark:text-stone-100 shadow-sm"
                : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
            }`}
          >
            Status
          </button>
          <button
            onClick={() => setViewMode("category")}
            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
              viewMode === "category"
                ? "bg-white dark:bg-stone-600 text-stone-900 dark:text-stone-100 shadow-sm"
                : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
            }`}
          >
            Category
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        {chartData.length > 0 ? (
          <ResponsivePie
            data={chartData}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            innerRadius={0.5}
            padAngle={0.7}
            cornerRadius={3}
            activeOuterRadiusOffset={8}
            colors={{ datum: "data.color" }}
            borderWidth={1}
            borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
            arcLinkLabelsSkipAngle={10}
            arcLinkLabelsTextColor="#6b7280"
            arcLinkLabelsThickness={2}
            arcLinkLabelsColor={{ from: "color" }}
            arcLabelsSkipAngle={10}
            arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
            theme={{
              labels: {
                text: {
                  fontSize: 12,
                  fontWeight: 600,
                },
              },
              tooltip: {
                container: {
                  background: "#ffffff",
                  color: "#333333",
                  fontSize: 12,
                  borderRadius: 8,
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  border: "1px solid #e5e7eb",
                },
              },
            }}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            tooltip={({ datum }: any) => (
              <div className="bg-white dark:bg-stone-800 p-3 rounded-lg shadow-lg border border-stone-200 dark:border-stone-700">
                <div className="font-semibold text-stone-900 dark:text-stone-100">
                  {datum.label}
                </div>
                <div className="text-stone-600 dark:text-stone-400">
                  {datum.value} signs
                </div>
              </div>
            )}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-stone-500 dark:text-stone-400">
            <div className="text-center">
              <div className="text-lg font-semibold mb-2">
                No Prophecies Found
              </div>
              <div className="text-sm">
                No prophetic data available for visualization
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 justify-center">
        {chartData.map((item) => (
          <div key={item.id} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            ></div>
            <span className="text-sm text-stone-600 dark:text-stone-400">
              {item.label} ({item.value})
            </span>
          </div>
        ))}
      </div>

      {/* Explanation - Only show when this chart is active */}
      {isActive && (
        <div className="mt-4 p-3 bg-stone-50 dark:bg-stone-700 rounded-lg border border-stone-200 dark:border-stone-600">
          <h4 className="text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">
            Understanding This Chart:
          </h4>
          <ul className="text-xs text-stone-600 dark:text-stone-400 space-y-1">
            <li>
              • <strong>Status View:</strong> Shows distribution of fulfillment
              statuses (Fulfilled, In Progress, etc.)
            </li>
            <li>
              • <strong>Category View:</strong> Shows distribution by prophecy
              type (Historical, Scientific, etc.)
            </li>
            <li>
              • <strong>Interactive:</strong> Toggle between different views to
              explore patterns
            </li>
            <li>
              • <strong>Statistics:</strong> Track fulfillment rates and
              category distributions
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
