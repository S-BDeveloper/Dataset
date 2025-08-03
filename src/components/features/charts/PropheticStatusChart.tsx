import React, { useContext, useMemo, useState } from "react";
import { ResponsivePie } from "@nivo/pie";
import type { IslamicData } from "../../../types/Types";
import { DarkModeContext } from "../../../types/ContextTypes";
import { getChartTheme } from "./chartTheme";
import { useResponsive } from "../../../hooks/useResponsive";

interface PropheticStatusChartProps {
  data: IslamicData[];
}

export const PropheticStatusChart: React.FC<PropheticStatusChartProps> = ({
  data,
}) => {
  const darkModeContext = useContext(DarkModeContext);
  const isDarkMode = darkModeContext?.isDarkMode ?? false;
  const chartTheme = getChartTheme(isDarkMode);
  const isMobile = useResponsive();
  const [tooltip, setTooltip] = useState<{
    datum: any;
    x: number;
    y: number;
  } | null>(null);

  const chartData = useMemo(() => {
    const statusCounts = data.reduce((acc, item) => {
      const status = item.status || "Unknown";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(statusCounts).map(([status, value]) => ({
      id: status,
      label: status,
      value,
    }));
  }, [data]);

  const getColor = (pieSlice: { id: string | number }) => {
    const status = pieSlice.id.toString();
    switch (status) {
      case "Fulfilled":
        return "#10b981";
      case "Proven":
        return "#3b82f6";
      case "In Progress":
        return "#f59e0b";
      case "Yet to Happen":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const chartMargins = isMobile
    ? { top: 20, right: 20, bottom: 20, left: 20 }
    : { top: 40, right: 80, bottom: 80, left: 80 };

  return (
    <div className="w-full h-96 md:h-[28rem] bg-white dark:bg-stone-800 rounded-lg shadow-lg p-4 flex flex-col relative">
      <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-200 mb-4">
        Islamic Data Status Distribution
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
          enableArcLinkLabels={true}
          enableArcLabels={true}
          onMouseEnter={(datum, event) => {
            console.log("Mouse enter:", datum);
            setTooltip({ datum, x: event.clientX, y: event.clientY });
          }}
          onMouseLeave={() => {
            console.log("Mouse leave");
            setTooltip(null);
          }}
          animate={true}
        />
      </div>

      {/* Custom tooltip */}
      {tooltip && (
        <div
          style={{
            position: "fixed",
            left: tooltip.x + 10,
            top: tooltip.y - 10,
            background: isDarkMode ? "#1f2937" : "#ffffff",
            border: `2px solid ${isDarkMode ? "#4b5563" : "#e5e7eb"}`,
            borderRadius: "8px",
            padding: "12px",
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            color: isDarkMode ? "#f9fafb" : "#111827",
            fontSize: "14px",
            fontWeight: "600",
            zIndex: 9999,
            pointerEvents: "none",
            minWidth: "160px",
          }}
        >
          <div
            style={{
              color: tooltip.datum.color,
              marginBottom: "6px",
              fontWeight: "700",
            }}
          >
            {tooltip.datum.id}
          </div>
          <div style={{ fontSize: "13px", marginBottom: "4px" }}>
            Count: {tooltip.datum.value} entries
          </div>
          <div style={{ fontSize: "12px", opacity: 0.8 }}>
            {(
              (tooltip.datum.value /
                chartData.reduce((sum, item) => sum + item.value, 0)) *
              100
            ).toFixed(1)}
            % of total data
          </div>
        </div>
      )}
    </div>
  );
};
