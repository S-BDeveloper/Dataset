import React from "react";
import type { IslamicFact } from "../types/Types";
import { ResponsiveBar } from "@nivo/bar";

interface SourcePieChartProps {
  data: IslamicFact[];
}

// SourceBarChart displays a Nivo horizontal bar chart of facts by source
export const SourcePieChart: React.FC<SourcePieChartProps> = ({ data }) => {
  // Group by source
  const counts: Record<string, number> = {};
  data.forEach((fact) => {
    const source = fact.Source || "Unknown";
    counts[source] = (counts[source] || 0) + 1;
  });
  const chartData = Object.entries(counts).map(([source, count]) => ({
    source,
    count,
  }));

  // Chart height grows with number of sources
  const chartHeight = Math.max(220, chartData.length * 32);

  return (
    <div
      className="rounded-2xl shadow border border-stone-200 bg-white p-4 sm:p-6"
      style={{ height: chartHeight }}
      aria-label="Horizontal bar chart of facts by source"
    >
      <ResponsiveBar
        data={chartData}
        keys={["count"]}
        indexBy="source"
        layout="horizontal"
        margin={{ top: 20, right: 30, bottom: 60, left: 120 }}
        padding={0.3}
        colors={{ scheme: "greens" }}
        axisBottom={{
          legend: "Count",
          legendPosition: "middle",
          legendOffset: 40,
        }}
        axisLeft={{
          legend: "Source",
          legendPosition: "middle",
          legendOffset: -100,
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
        ariaLabel="Facts by source horizontal bar chart"
        barAriaLabel={(e) => `${e.data.source}: ${e.data.count} facts`}
        tooltip={({ value, color, indexValue }) => (
          <span style={{ color, fontWeight: 700 }}>
            {indexValue}: {value}
          </span>
        )}
      />
    </div>
  );
};
