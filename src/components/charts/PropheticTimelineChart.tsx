import React, { useState } from "react";
import { ResponsiveLine } from "@nivo/line";
import type { QuranicMiracle } from "../../types/Types";

interface PropheticTimelineChartProps {
  data: QuranicMiracle[];
  isActive?: boolean;
}

// PropheticTimelineChart displays an interactive timeline of prophetic fulfillments
export const PropheticTimelineChart: React.FC<PropheticTimelineChartProps> = ({
  data,
  isActive = false,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Filter prophecies and prepare timeline data
  const prophecies = data.filter((miracle) => miracle.type === "prophecy");

  const categories = [
    "all",
    ...Array.from(
      new Set(prophecies.map((p) => p.prophecyCategory).filter(Boolean))
    ),
  ];
  const statuses = [
    "all",
    "fulfilled",
    "in-progress",
    "pending",
    "partially-fulfilled",
  ];

  // Filter by selected category and status
  const filteredProphecies = prophecies.filter((prophecy) => {
    const categoryMatch =
      selectedCategory === "all" ||
      prophecy.prophecyCategory === selectedCategory;
    const statusMatch =
      selectedStatus === "all" || prophecy.fulfillmentStatus === selectedStatus;
    return categoryMatch && statusMatch && prophecy.yearRevealed;
  });

  // Prepare timeline data for Nivo
  const timelineData = [
    {
      id: "Prophecies",
      data: filteredProphecies
        .sort((a, b) => (a.yearRevealed || 0) - (b.yearRevealed || 0))
        .map((prophecy, index) => ({
          x: prophecy.yearRevealed || 0,
          y: index + 1,
          title: prophecy.title,
          status: prophecy.fulfillmentStatus,
          category: prophecy.prophecyCategory,
          yearFulfilled: prophecy.yearFulfilled,
          evidence: prophecy.fulfillmentEvidence,
        })),
    },
  ];

  // Get color based on fulfillment status
  const getStatusColor = (status?: string): string => {
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

  // Get status label
  const getStatusLabel = (status?: string): string => {
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

  return (
    <div className="w-full bg-white dark:bg-stone-800 rounded-2xl shadow-lg border border-stone-200 dark:border-stone-700 p-6 chart-container">
      <h3 className="text-lg font-bold text-green-700 dark:text-green-400 mb-6 text-center">
        Prophetic Fulfillment Timeline
      </h3>

      {/* Statistics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {totalProphecies}
          </div>
          <div className="text-xs text-green-600 dark:text-green-400">
            Total
          </div>
        </div>
        <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {fulfilledCount}
          </div>
          <div className="text-xs text-green-600 dark:text-green-400">
            Fulfilled
          </div>
        </div>
        <div className="text-center p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-700">
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
            {inProgressCount}
          </div>
          <div className="text-xs text-amber-600 dark:text-amber-400">
            In Progress
          </div>
        </div>
        <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {partiallyFulfilledCount}
          </div>
          <div className="text-xs text-blue-600 dark:text-blue-400">
            Partial
          </div>
        </div>
        <div className="text-center p-3 bg-stone-50 dark:bg-stone-700 rounded-lg border border-stone-200 dark:border-stone-600">
          <div className="text-2xl font-bold text-stone-600 dark:text-stone-400">
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

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
            Category:
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === "all"
                  ? "All Categories"
                  : (category || "").charAt(0).toUpperCase() +
                    (category || "").slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
            Status:
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status === "all"
                  ? "All Statuses"
                  : status?.charAt(0).toUpperCase() +
                    status?.slice(1).replace("-", " ")}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Timeline Chart */}
      <div className="h-80">
        {filteredProphecies.length > 0 ? (
          <ResponsiveLine
            data={timelineData}
            margin={{ top: 20, right: 30, bottom: 80, left: 60 }}
            xScale={{ type: "linear", min: "auto", max: "auto" }}
            yScale={{ type: "linear", min: 0, max: "auto" }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Year Revealed",
              legendPosition: "middle",
              legendOffset: 40,
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Prophecy Count",
              legendPosition: "middle",
              legendOffset: -40,
            }}
            pointSize={8}
            pointColor="#10b981"
            pointBorderWidth={2}
            pointBorderColor={{ from: "serieColor" }}
            pointLabelYOffset={-12}
            useMesh={true}
            theme={{
              axis: {
                ticks: {
                  text: {
                    fill: "#6b7280",
                    fontSize: 12,
                    fontWeight: 600,
                  },
                },
                legend: {
                  text: {
                    fill: "#166534",
                    fontSize: 14,
                    fontWeight: 700,
                  },
                },
              },
              grid: {
                line: {
                  stroke: "#e5e7eb",
                  strokeWidth: 1,
                },
              },
            }}
            tooltip={({ point }) => (
              <div className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-600 rounded-lg p-3 shadow-lg">
                <div className="font-semibold text-stone-900 dark:text-stone-100 mb-1">
                  Prophecy #{point.y}
                </div>
                <div className="text-sm text-stone-600 dark:text-stone-400">
                  Year Revealed: {point.data.x}
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
                No prophecies match the selected filters
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 justify-center">
        {["fulfilled", "in-progress", "partially-fulfilled", "pending"].map(
          (status) => (
            <div key={status} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: getStatusColor(status) }}
              ></div>
              <span className="text-sm text-stone-600 dark:text-stone-400">
                {getStatusLabel(status)}
              </span>
            </div>
          )
        )}
      </div>

      {/* Explanation - Only show when this chart is active */}
      {isActive && (
        <div className="mt-4 p-3 bg-stone-50 dark:bg-stone-700 rounded-lg border border-stone-200 dark:border-stone-600">
          <h4 className="text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">
            Understanding This Chart:
          </h4>
          <ul className="text-xs text-stone-600 dark:text-stone-400 space-y-1">
            <li>
              • <strong>Timeline:</strong> Shows when prophecies were revealed
              and their fulfillment status
            </li>
            <li>
              • <strong>Color Coding:</strong> Green = Fulfilled, Amber = In
              Progress, Blue = Partial, Gray = Pending
            </li>
            <li>
              • <strong>Filters:</strong> Explore prophecies by category and
              fulfillment status
            </li>
            <li>
              • <strong>Statistics:</strong> Track overall fulfillment rates and
              patterns
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
