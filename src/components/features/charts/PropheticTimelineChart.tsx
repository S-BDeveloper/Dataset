import React, { useState } from "react";
import { ResponsiveLine } from "@nivo/line";
import type { IslamicData } from "../../../types/Types";

interface PropheticTimelineChartProps {
  data: IslamicData[];
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
  const prophecies = data.filter((data) => data.type === "prophecy");

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

  return (
    <div
      className="w-full bg-white dark:bg-stone-800 rounded-2xl shadow-lg border border-stone-200 dark:border-stone-700 p-6 chart-container"
      aria-label="Interactive timeline chart showing prophetic revelations and fulfillments"
    >
      <h3 className="text-lg font-bold text-green-700 dark:text-green-400 mb-6 text-center">
        Prophetic Timeline
      </h3>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-stone-50 dark:bg-stone-700 rounded-lg">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {totalProphecies}
          </div>
          <div className="text-sm text-stone-600 dark:text-stone-400">
            Total Prophecies
          </div>
        </div>
        <div className="text-center p-3 bg-stone-50 dark:bg-stone-700 rounded-lg">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {fulfilledCount}
          </div>
          <div className="text-sm text-stone-600 dark:text-stone-400">
            Fulfilled
          </div>
        </div>
        <div className="text-center p-3 bg-stone-50 dark:bg-stone-700 rounded-lg">
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
            {inProgressCount}
          </div>
          <div className="text-sm text-stone-600 dark:text-stone-400">
            In Progress
          </div>
        </div>
        <div className="text-center p-3 bg-stone-50 dark:bg-stone-700 rounded-lg">
          <div className="text-2xl font-bold text-stone-600 dark:text-stone-400">
            {pendingCount}
          </div>
          <div className="text-sm text-stone-600 dark:text-stone-400">
            Pending
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
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
                    (category || "").slice(1).replace("-", " ")}
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
      <div className="w-full h-full min-h-[400px] min-w-[200px] nivo-chart">
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

      {/* Explanation - Only show when this chart is active */}
      {isActive && (
        <div className="mt-4 p-3 bg-stone-50 dark:bg-stone-700 rounded-lg border border-stone-200 dark:border-stone-600">
          <h4 className="text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">
            Understanding This Timeline:
          </h4>
          <ul className="text-xs text-stone-600 dark:text-stone-400 space-y-1">
            <li>
              • <strong>Chronological Order:</strong> Shows prophecies in order
              of when they were revealed
            </li>
            <li>
              • <strong>Filtering:</strong> Use category and status filters to
              focus on specific types of prophecies
            </li>
            <li>
              • <strong>Patterns:</strong> Reveals temporal patterns in
              prophetic revelations
            </li>
            <li>
              • <strong>Statistics:</strong> Quick overview of fulfillment rates
              and progress
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
