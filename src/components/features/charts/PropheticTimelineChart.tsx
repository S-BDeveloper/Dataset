import React, { useState, useMemo, useContext } from "react";
import { ResponsiveLine } from "@nivo/line";
import type { IslamicData } from "../../../types/Types";
import { DarkModeContext } from "../../../types/ContextTypes";
import { getChartTheme } from "./chartTheme";
import { useResponsive } from "../../../hooks/useResponsive";

interface PropheticTimelineChartProps {
  data: IslamicData[];
}

export const PropheticTimelineChart: React.FC<PropheticTimelineChartProps> = ({
  data,
}) => {
  const darkModeContext = useContext(DarkModeContext);
  const isDarkMode = darkModeContext?.isDarkMode ?? false;
  const chartTheme = getChartTheme(isDarkMode);
  const isMobile = useResponsive();

  const [selectedType, setSelectedType] = useState("all");

  const availableTypes = useMemo(() => {
    const types = new Set(data.map((item) => item.type));
    return ["all", ...Array.from(types)];
  }, [data]);

  const filteredData = useMemo(() => {
    const baseData =
      selectedType === "all"
        ? data
        : data.filter((item) => item.type === selectedType);

    // Take the first 20 entries from the filtered data
    return baseData.slice(0, 20);
  }, [data, selectedType]);

  const timelineData = useMemo(() => {
    return [
      {
        id: "Timeline",
        data: filteredData.map((item, index) => ({
          x: index + 1,
          y: 1, // Plot all points on a single horizontal line for clarity
          title: item.title,
        })),
      },
    ];
  }, [filteredData]);

  const chartMargins = isMobile
    ? { top: 30, right: 30, bottom: 50, left: 30 }
    : { top: 50, right: 110, bottom: 50, left: 60 };

  return (
    <div className="w-full h-96 md:h-[28rem] bg-white dark:bg-stone-800 rounded-lg shadow-lg p-4 flex flex-col">
      <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
        <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-200">
          Islamic Data Timeline (First 20 Entries)
        </h3>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="p-2 rounded-md bg-stone-100 dark:bg-stone-700 text-stone-800 dark:text-stone-200"
        >
          {availableTypes.map((type) => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-grow">
        {timelineData[0].data.length > 0 ? (
          <ResponsiveLine
            data={timelineData}
            theme={chartTheme}
            margin={chartMargins}
            xScale={{ type: "linear" }}
            yScale={{
              type: "linear",
              min: 0,
              max: 2, // Keep the line centered
              stacked: false,
              reverse: false,
            }}
            yFormat=" >-.2f"
            axisTop={null}
            axisRight={null}
            axisLeft={{
              tickValues: [], // Hide Y-axis labels
            }}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Entry Number",
              legendOffset: 36,
              legendPosition: "middle",
            }}
            pointSize={12}
            pointColor={{ theme: "background" }}
            pointBorderWidth={3}
            pointBorderColor={{ from: "serieColor" }}
            pointLabelYOffset={-12}
            useMesh={true}
            tooltip={({ point }) => {
              return (
                <div
                  style={{
                    background: isDarkMode ? "#333333" : "white",
                    padding: "9px 12px",
                    border: `1px solid ${isDarkMode ? "#555555" : "#ccc"}`,
                    color: isDarkMode ? "#f0f0f0" : "#333333",
                  }}
                >
                  <div>
                    <strong>{point.data.title as string}</strong>
                  </div>
                </div>
              );
            }}
            animate={true}
          />
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-stone-500 dark:text-stone-400">
              No data available for this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
