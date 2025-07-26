import React from "react";
import type { IslamicFact } from "../types/Types";
import { ResponsivePie } from "@nivo/pie";

interface StatusPieChartProps {
  data: IslamicFact[];
}

// StatusPieChart displays a Nivo pie chart of facts by status
export const StatusPieChart: React.FC<StatusPieChartProps> = ({ data }) => {
  // Group by status
  const counts: Record<string, number> = {};
  data.forEach((fact) => {
    const status = fact.Status || "Unknown";
    counts[status] = (counts[status] || 0) + 1;
  });
  const chartData = Object.entries(counts).map(([status, value]) => ({
    id: status,
    label: status,
    value,
  }));

  return (
    <div
      className="rounded-2xl shadow border border-stone-200 bg-white p-4 sm:p-6"
      style={{ height: 270 }}
      aria-label="Pie chart of facts by status"
    >
      <ResponsivePie
        data={chartData}
        margin={{ top: 20, right: 40, bottom: 60, left: 40 }}
        innerRadius={0.5}
        padAngle={1.5}
        cornerRadius={4}
        colors={{ scheme: "yellow_orange_brown" }}
        borderWidth={1}
        borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor="#92400e"
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: "color" }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor="#fff"
        theme={{
          labels: { text: { fontWeight: 700 } },
          legends: { text: { fill: "#b45309", fontWeight: 700 } },
        }}
        role="img"
        arcLabel={(d) => `${d.label} (${d.value})`}
        tooltip={({ datum }) => (
          <span style={{ color: datum.color, fontWeight: 700 }}>
            {datum.label}: {datum.value}
          </span>
        )}
      />
    </div>
  );
};
