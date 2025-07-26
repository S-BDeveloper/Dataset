import React from "react";
import type { IslamicFact } from "../types/Types";
import { ResponsiveLine } from "@nivo/line";

interface FactsOverTimeLineChartProps {
  data: IslamicFact[];
}

// FactsOverTimeLineChart displays a Nivo line chart of facts over time (by year)
export const FactsOverTimeLineChart: React.FC<FactsOverTimeLineChartProps> = ({
  data,
}) => {
  // Group by year (assuming fact has a Year property)
  const counts: Record<string, number> = {};
  data.forEach((fact) => {
    const year =
      typeof fact.Year === "string" && fact.Year ? fact.Year : "Unknown";
    counts[year] = (counts[year] || 0) + 1;
  });
  // Sort years numerically if possible
  const sortedYears = Object.keys(counts).sort((a, b) => {
    if (a === "Unknown") return 1;
    if (b === "Unknown") return -1;
    return Number(a) - Number(b);
  });
  const chartData = [
    {
      id: "Facts",
      color: "hsl(24, 90%, 60%)",
      data: sortedYears.map((year) => ({ x: year, y: counts[year] })),
    },
  ];

  return (
    <div
      className="rounded-2xl shadow border border-stone-200 bg-white p-4 sm:p-6"
      style={{ height: 320 }}
    >
      <ResponsiveLine
        data={chartData}
        margin={{ top: 20, right: 40, bottom: 60, left: 50 }}
        xScale={{ type: "point" }}
        yScale={{
          type: "linear",
          min: "auto",
          max: "auto",
          stacked: false,
          reverse: false,
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          legend: "Year",
          legendOffset: 40,
          legendPosition: "middle",
          tickRotation: 30,
        }}
        axisLeft={{
          legend: "Facts",
          legendOffset: -40,
          legendPosition: "middle",
        }}
        colors={{ scheme: "oranges" }}
        pointSize={10}
        pointColor={{ theme: "background" }}
        pointBorderWidth={2}
        pointBorderColor={{ from: "serieColor" }}
        pointLabelYOffset={-12}
        enableArea={true}
        areaOpacity={0.2}
        useMesh={true}
        theme={{
          axis: {
            ticks: { text: { fill: "#b45309", fontWeight: 600 } },
            legend: { text: { fill: "#ea580c", fontWeight: 700 } },
          },
          labels: { text: { fill: "#ea580c", fontWeight: 700 } },
        }}
        role="img"
        // The tooltip prop expects a function that receives PointTooltipProps, not just { point }
        // We'll use the correct type and destructure point from the props
        tooltip={({ point }) => (
          // Use the seriesColor for the text color, and bold for emphasis
          <span style={{ color: point.seriesColor, fontWeight: 700 }}>
            {/* Show the formatted x and y values */}
            {point.data.xFormatted}: {point.data.yFormatted}
          </span>
        )}
      />
    </div>
  );
};
