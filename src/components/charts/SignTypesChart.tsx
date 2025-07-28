import React from "react";
import { ResponsiveBar } from "@nivo/bar";
import type { QuranicMiracle } from "../../types/Types";

interface SignTypesChartProps {
  data: QuranicMiracle[];
  isActive?: boolean;
}

// SignTypesChart displays an interactive bar chart of signs by type
export const SignTypesChart: React.FC<SignTypesChartProps> = ({
  data,
  isActive = false,
}) => {
  // Process data to count signs by type
  const typeCounts = data.reduce((acc, miracle) => {
    const type = miracle.type || "Unknown";
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Convert to chart data format
  const chartData = Object.entries(typeCounts).map(([type, count]) => ({
    type: type.charAt(0).toUpperCase() + type.slice(1), // Capitalize first letter
    count,
    color: getTypeColor(type), // Custom colors for each type
  }));

  // Custom colors for different sign types
  function getTypeColor(type: string): string {
    const colors = {
      pair: "#10b981", // Green
      numerical: "#3b82f6", // Blue
      structural: "#8b5cf6", // Purple
      linguistic: "#f59e0b", // Amber
      prophecy: "#ef4444", // Red
      middle: "#06b6d4", // Cyan
      scientific: "#84cc16", // Lime
      unknown: "#6b7280", // Gray
    };
    return colors[type as keyof typeof colors] || colors.unknown;
  }

  return (
    <div
      className="w-full bg-white dark:bg-stone-800 rounded-2xl shadow-lg border border-stone-200 dark:border-stone-700 p-6 chart-container"
      aria-label="Interactive bar chart showing distribution of sign types"
    >
      <h3 className="text-lg font-bold text-green-700 dark:text-green-400 mb-6 text-center">
        Signs by Type Distribution
      </h3>
      <div className="h-80 nivo-chart">
        <ResponsiveBar
          data={chartData}
          keys={["count"]}
          indexBy="type"
          margin={{ top: 20, right: 30, bottom: 80, left: 60 }}
          padding={0.3}
          colors={({ data }) => data.color}
          borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -45,
            legend: "Sign Type",
            legendPosition: "middle",
            legendOffset: 60,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Number of Signs",
            legendPosition: "middle",
            legendOffset: -40,
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
          legends={[
            {
              dataFrom: "keys",
              anchor: "bottom",
              direction: "row",
              justify: false,
              translateX: 0,
              translateY: 70,
              itemsSpacing: 2,
              itemWidth: 100,
              itemHeight: 20,
              itemDirection: "left-to-right",
              itemOpacity: 0.85,
              symbolSize: 20,
              effects: [
                {
                  on: "hover",
                  style: {
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]}
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
            legends: {
              text: {
                fill: "#6b7280",
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
          role="img"
          barAriaLabel={(e) => `${e.data.type}: ${e.data.count} signs`}
          tooltip={({ data }) => (
            <div className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-600 rounded-lg p-3 shadow-lg">
              <div className="font-semibold text-stone-900 dark:text-stone-100">
                {data.type}
              </div>
              <div className="text-stone-600 dark:text-stone-400">
                {data.count} signs
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
              • <strong>Distribution:</strong> Shows how Quranic miracles are
              categorized by type
            </li>
            <li>
              • <strong>Color Coding:</strong> Each miracle type has its own
              distinct color
            </li>
            <li>
              • <strong>Hover for Details:</strong> See exact counts for each
              type
            </li>
            <li>
              • <strong>Patterns:</strong> Reveals which types of miracles are
              most common
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
