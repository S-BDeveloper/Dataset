import React, { useState } from "react";
import { ResponsivePie } from "@nivo/pie";
import type { QuranicMiracle } from "../../types/Types";

interface PropheticStatusChartProps {
  data: QuranicMiracle[];
  isActive?: boolean;
}

// PropheticStatusChart displays the distribution of prophetic fulfillment statuses
export const PropheticStatusChart: React.FC<PropheticStatusChartProps> = ({
  data,
  isActive = false,
}) => {
  const [selectedView, setSelectedView] = useState<"status" | "category">(
    "status"
  );

  // Filter prophecies
  const prophecies = data.filter((miracle) => miracle.type === "prophecy");

  // Prepare data based on selected view
  const getChartData = () => {
    if (selectedView === "status") {
      const statusCounts = prophecies.reduce((acc, prophecy) => {
        const status = prophecy.fulfillmentStatus || "unknown";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return Object.entries(statusCounts).map(([status, count]) => ({
        id: getStatusLabel(status),
        label: getStatusLabel(status),
        value: count,
        color: getStatusColor(status),
      }));
    } else {
      const categoryCounts = prophecies.reduce((acc, prophecy) => {
        const category = prophecy.prophecyCategory || "unknown";
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return Object.entries(categoryCounts).map(([category, count]) => ({
        id: category.charAt(0).toUpperCase() + category.slice(1),
        label: category.charAt(0).toUpperCase() + category.slice(1),
        value: count,
        color: getCategoryColor(category),
      }));
    }
  };

  // Get color based on fulfillment status
  const getStatusColor = (status: string): string => {
    switch (status) {
      case "fulfilled":
        return "#10b981"; // Green
      case "in-progress":
        return "#f59e0b"; // Amber
      case "partially-fulfilled":
        return "#3b82f6"; // Blue
      case "pending":
        return "#6b7280"; // Gray
      default:
        return "#6b7280";
    }
  };

  // Get color based on prophecy category
  const getCategoryColor = (category: string): string => {
    const colors = {
      historical: "#ef4444", // Red
      scientific: "#3b82f6", // Blue
      social: "#8b5cf6", // Purple
      natural: "#10b981", // Green
      cosmological: "#f59e0b", // Amber
      technological: "#06b6d4", // Cyan
      unknown: "#6b7280", // Gray
    };
    return colors[category as keyof typeof colors] || colors.unknown;
  };

  // Get status label
  const getStatusLabel = (status: string): string => {
    switch (status) {
      case "fulfilled":
        return "Fulfilled";
      case "in-progress":
        return "In Progress";
      case "partially-fulfilled":
        return "Partially Fulfilled";
      case "pending":
        return "Pending";
      default:
        return "Unknown";
    }
  };

  // Calculate statistics
  const totalProphecies = prophecies.length;
  const fulfilledCount = prophecies.filter(
    (p) => p.fulfillmentStatus === "fulfilled"
  ).length;
  const inProgressCount = prophecies.filter(
    (p) => p.fulfillmentStatus === "in-progress"
  ).length;
  const pendingCount = prophecies.filter(
    (p) => p.fulfillmentStatus === "pending"
  ).length;
  const partiallyFulfilledCount = prophecies.filter(
    (p) => p.fulfillmentStatus === "partially-fulfilled"
  ).length;

  const fulfillmentRate =
    totalProphecies > 0
      ? (
          ((fulfilledCount + partiallyFulfilledCount) / totalProphecies) *
          100
        ).toFixed(1)
      : "0";

  const chartData = getChartData();

  return (
    <div className="w-full bg-white dark:bg-stone-800 rounded-2xl shadow-lg border border-stone-200 dark:border-stone-700 p-6 chart-container">
      <h3 className="text-lg font-bold text-green-700 dark:text-green-400 mb-6 text-center">
        Prophetic Status Distribution
      </h3>

      {/* View Toggle */}
      <div className="flex justify-center mb-6">
        <div className="flex bg-stone-100 dark:bg-stone-700 rounded-lg p-1">
          <button
            onClick={() => setSelectedView("status")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              selectedView === "status"
                ? "bg-green-600 text-white shadow-md"
                : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
            }`}
          >
            By Status
          </button>
          <button
            onClick={() => setSelectedView("category")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              selectedView === "category"
                ? "bg-green-600 text-white shadow-md"
                : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
            }`}
          >
            By Category
          </button>
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
          <div className="text-xl font-bold text-green-600 dark:text-green-400">
            {totalProphecies}
          </div>
          <div className="text-xs text-green-600 dark:text-green-400">
            Total
          </div>
        </div>
        <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
          <div className="text-xl font-bold text-green-600 dark:text-green-400">
            {fulfilledCount}
          </div>
          <div className="text-xs text-green-600 dark:text-green-400">
            Fulfilled
          </div>
        </div>
        <div className="text-center p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-700">
          <div className="text-xl font-bold text-amber-600 dark:text-amber-400">
            {inProgressCount}
          </div>
          <div className="text-xs text-amber-600 dark:text-amber-400">
            In Progress
          </div>
        </div>
        <div className="text-center p-2 bg-stone-50 dark:bg-stone-700 rounded-lg border border-stone-200 dark:border-stone-600">
          <div className="text-xl font-bold text-stone-600 dark:text-stone-400">
            {pendingCount}
          </div>
          <div className="text-xs text-stone-600 dark:text-stone-400">
            Pending
          </div>
        </div>
      </div>

      {/* Fulfillment Rate */}
      <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg border border-green-200 dark:border-green-700">
        <div className="text-center">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
            {fulfillmentRate}%
          </div>
          <div className="text-sm text-green-600 dark:text-green-400">
            Overall Fulfillment Rate
          </div>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="h-64">
        {chartData.length > 0 ? (
          <ResponsivePie
            data={chartData}
            margin={{ top: 10, right: 60, bottom: 10, left: 60 }}
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
            tooltip={({
              datum,
            }: {
              datum: { label: string; value: number; color: string };
            }) => (
              <div className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-600 rounded-lg p-3 shadow-lg">
                <div className="font-semibold text-stone-900 dark:text-stone-100">
                  {datum.label}
                </div>
                <div className="text-stone-600 dark:text-stone-400">
                  {datum.value} prophecies
                </div>
                <div className="text-xs text-stone-500 dark:text-stone-500">
                  {((datum.value / totalProphecies) * 100).toFixed(1)}% of total
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
