import React from "react";
import { ResponsivePie } from "@nivo/pie";
import type { QuranicMiracle } from "../../types/Types";

interface CategoryPieChartProps {
  data: QuranicMiracle[];
}

// CategoryPieChart displays an interactive pie chart of category distribution
export const CategoryPieChart: React.FC<CategoryPieChartProps> = ({ data }) => {
  // Process data to count signs by category
  const categoryCounts = data.reduce((acc, miracle) => {
    // Use type as category if no specific category field
    const category = miracle.type || "Unknown";
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Convert to chart data format
  const chartData = Object.entries(categoryCounts).map(([category, value]) => ({
    id: category.charAt(0).toUpperCase() + category.slice(1),
    label: category.charAt(0).toUpperCase() + category.slice(1),
    value,
    color: getCategoryColor(category),
  }));

  // Custom colors for different categories
  function getCategoryColor(category: string): string {
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
    return colors[category as keyof typeof colors] || colors.unknown;
  }

  // Calculate total for percentage display
  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div
      className="w-full h-96 bg-white dark:bg-stone-800 rounded-2xl shadow-lg border border-stone-200 dark:border-stone-700 p-6"
      aria-label="Interactive pie chart showing category distribution"
    >
      <h3 className="text-lg font-bold text-green-700 dark:text-green-400 mb-4 text-center">
        Category Distribution
      </h3>
      <div className="text-sm text-stone-600 dark:text-stone-400 text-center mb-4">
        Total: {total} signs
      </div>
      <ResponsivePie
        data={chartData}
        margin={{ top: 20, right: 40, bottom: 80, left: 40 }}
        innerRadius={0.5}
        padAngle={1.5}
        cornerRadius={4}
        colors={({ data }) => data.color}
        borderWidth={1}
        borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor="#6b7280"
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: "color" }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor="#ffffff"
        theme={{
          labels: {
            text: {
              fontWeight: 700,
              fontSize: 12,
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
        legends={[
          {
            anchor: "bottom",
            direction: "row",
            justify: false,
            translateX: 0,
            translateY: 60,
            itemsSpacing: 0,
            itemWidth: 100,
            itemHeight: 18,
            itemTextColor: "#6b7280",
            itemDirection: "left-to-right",
            itemOpacity: 0.85,
            symbolSize: 18,
            symbolShape: "circle",
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
        role="img"
        arcLabel={(d) => `${d.label} (${d.value})`}
        tooltip={({ datum }) => {
          const percentage = ((datum.value / total) * 100).toFixed(1);
          return (
            <div className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-600 rounded-lg p-3 shadow-lg">
              <div className="font-semibold text-stone-900 dark:text-stone-100">
                {datum.label}
              </div>
              <div className="text-stone-600 dark:text-stone-400">
                {datum.value} signs ({percentage}%)
              </div>
            </div>
          );
        }}
      />
    </div>
  );
};
