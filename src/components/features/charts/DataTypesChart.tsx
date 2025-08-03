import React, { useContext, useMemo } from "react";
import { ResponsiveBar } from "@nivo/bar";
import type { IslamicData } from "../../../types/Types";
import { DarkModeContext } from "../../../types/ContextTypes";
import { getChartTheme } from "./chartTheme";
import { useResponsive } from "../../../hooks/useResponsive";

interface DataTypesChartProps {
  data: IslamicData[];
}

export const DataTypesChart: React.FC<DataTypesChartProps> = ({ data }) => {
  const darkModeContext = useContext(DarkModeContext);
  const isDarkMode = darkModeContext?.isDarkMode ?? false;
  const chartTheme = getChartTheme(isDarkMode);
  const isMobile = useResponsive();

  const chartData = useMemo(() => {
    const typeCounts = data.reduce((acc, item) => {
      const type = item.type || "Unknown";
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(typeCounts).map(([type, count]) => ({
      type: type.charAt(0).toUpperCase() + type.slice(1),
      count,
    }));
  }, [data]);

  const getColor = (bar: { id: string | number; data: { type: string } }) => {
    const type = bar.data.type.toLowerCase();
    switch (type) {
      case "prophecy":
        return "#ef4444";
      case "scientific":
        return "#10b981";
      case "qadr":
        return "#8b5cf6";
      default:
        return "#6b7280";
    }
  };

  const chartMargins = isMobile
    ? { top: 30, right: 30, bottom: 80, left: 40 }
    : { top: 50, right: 130, bottom: 50, left: 60 };

  return (
    <div className="w-full h-96 md:h-[28rem] bg-white dark:bg-stone-800 rounded-lg shadow-lg p-4 flex flex-col">
      <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-200 mb-4">
        Islamic Data by Type Distribution
      </h3>
      <div className="flex-grow">
        <ResponsiveBar
          data={chartData}
          keys={["count"]}
          indexBy="type"
          margin={chartMargins}
          padding={0.3}
          colors={getColor}
          borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: isMobile ? -45 : 0,
            legend: "Data Type",
            legendPosition: "middle",
            legendOffset: isMobile ? 60 : 32,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Number of Items",
            legendPosition: "middle",
            legendOffset: -35,
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
          tooltip={({ id: _id, value, color, indexValue }) => (
            <div
              style={{
                padding: "12px",
                background: isDarkMode ? "#333333" : "#ffffff",
                border: `1px solid ${isDarkMode ? "#555555" : "#ccc"}`,
                color: isDarkMode ? "#f0f0f0" : "#333333",
              }}
            >
              <strong style={{ color }}>
                {indexValue}: {value}
              </strong>
            </div>
          )}
          theme={chartTheme}
          animate={true}
        />
      </div>
    </div>
  );
};
