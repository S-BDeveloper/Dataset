import React, { useContext, useMemo } from "react";
import { ResponsivePie } from "@nivo/pie";
import type { IslamicData } from "../../../types/Types";
import { DarkModeContext } from "../../../types/ContextTypes";
import { getChartTheme } from "./chartTheme";
import { useResponsive } from "../../../hooks/useResponsive";

interface CategoryPieChartProps {
  data: IslamicData[];
}

export const CategoryPieChart: React.FC<CategoryPieChartProps> = ({ data }) => {
  const darkModeContext = useContext(DarkModeContext);
  const isDarkMode = darkModeContext?.isDarkMode ?? false;
  const chartTheme = getChartTheme(isDarkMode);
  const isMobile = useResponsive();

  const chartData = useMemo(() => {
    const categoryCounts = data.reduce((acc, item) => {
      const category = item.type || "Unknown";
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categoryCounts).map(([category, value]) => ({
      id: category.charAt(0).toUpperCase() + category.slice(1),
      label: category.charAt(0).toUpperCase() + category.slice(1),
      value,
    }));
  }, [data]);

  const getColor = (pieSlice: { id: string | number }) => {
    const type = pieSlice.id.toString().toLowerCase();
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
    ? { top: 20, right: 20, bottom: 20, left: 20 }
    : { top: 40, right: 80, bottom: 80, left: 80 };

  return (
    <div className="w-full h-96 md:h-[28rem] bg-white dark:bg-stone-800 rounded-lg shadow-lg p-4 flex flex-col">
      <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-200 mb-4">
        Islamic Data Category Distribution
      </h3>
      <div className="flex-grow">
        <ResponsivePie
          data={chartData}
          theme={chartTheme}
          margin={chartMargins}
          innerRadius={0.5}
          padAngle={0.7}
          cornerRadius={3}
          activeOuterRadiusOffset={8}
          colors={getColor}
          borderWidth={1}
          borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
          arcLinkLabelsSkipAngle={15}
          arcLinkLabelsTextColor={isDarkMode ? "#f0f0f0" : "#333333"}
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: "color" }}
          arcLabelsSkipAngle={15}
          arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
          tooltip={({ datum }) => (
            <div
              style={{
                padding: "12px",
                background: isDarkMode ? "#333333" : "#ffffff",
                border: `1px solid ${isDarkMode ? "#555555" : "#ccc"}`,
                color: isDarkMode ? "#f0f0f0" : "#333333",
              }}
            >
              <strong style={{ color: datum.color }}>
                {datum.id}: {datum.value}
              </strong>
            </div>
          )}
          animate={true}
        />
      </div>
    </div>
  );
};
