import React from "react";
import type { IslamicFact } from "../types/Types";
import { ResponsiveBar } from "@nivo/bar";

interface CategoryBarChartProps {
  data: IslamicFact[];
}

// CategoryBarChart displays a Nivo bar chart of facts by category
export const CategoryBarChart: React.FC<CategoryBarChartProps> = ({ data }) => {
  // Group by category
  const counts: Record<string, number> = {};
  data.forEach((fact) => {
    const cat = fact.Category || "Unknown";
    counts[cat] = (counts[cat] || 0) + 1;
  });
  const chartData = Object.entries(counts).map(([category, count]) => ({
    category,
    count,
  }));

  return (
    <div
      className="rounded-2xl shadow border border-stone-200 bg-white p-4 sm:p-6"
      style={{ height: 320 }}
      aria-label="Bar chart of facts by category"
    >
      <ResponsiveBar
        data={chartData}
        keys={["count"]}
        indexBy="category"
        margin={{ top: 20, right: 30, bottom: 60, left: 50 }}
        padding={0.3}
        colors={{ scheme: "greens" }}
        axisBottom={{
          tickRotation: 30,
          legend: "Category",
          legendPosition: "middle",
          legendOffset: 40,
        }}
        axisLeft={{
          legend: "Count",
          legendPosition: "middle",
          legendOffset: -40,
        }}
        labelSkipWidth={16}
        labelSkipHeight={12}
        labelTextColor="#fff"
        theme={{
          axis: {
            ticks: {
              text: { fill: "#374151", fontWeight: 600 },
            },
            legend: {
              text: { fill: "#166534", fontWeight: 700 },
            },
          },
          labels: {
            text: { fill: "#fff", fontWeight: 700 },
          },
        }}
        role="img"
        ariaLabel="Facts by category bar chart"
        barAriaLabel={(e) => `${e.data.category}: ${e.data.count} facts`}
      />
    </div>
  );
};
