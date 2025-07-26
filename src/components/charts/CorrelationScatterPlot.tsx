import React, { useState } from "react";
import { ResponsiveScatterPlot } from "@nivo/scatterplot";
import type { QuranicMiracle } from "../../types/Types";

interface CorrelationScatterPlotProps {
  data: QuranicMiracle[];
  isActive?: boolean;
}

// CorrelationScatterPlot displays interactive scatter plots showing relationships between numerical fields
export const CorrelationScatterPlot: React.FC<CorrelationScatterPlotProps> = ({
  data,
  isActive = false,
}) => {
  const [selectedPair, setSelectedPair] = useState<string>("life-death");

  // Define the known Quranic pairs for perfect correlations
  const KNOWN_PAIRS = [
    {
      id: "life-death",
      field1: "lifeCount",
      field2: "deathCount",
      name: "Life & Death",
    },
    {
      id: "man-woman",
      field1: "manCount",
      field2: "womanCount",
      name: "Man & Woman",
    },
    {
      id: "heaven-hell",
      field1: "heavenCount",
      field2: "hellCount",
      name: "Heaven & Hell",
    },
    {
      id: "world-hereafter",
      field1: "worldCount",
      field2: "hereafterCount",
      name: "World & Hereafter",
    },
    {
      id: "angels-devils",
      field1: "angelsCount",
      field2: "devilsCount",
      name: "Angels & Devils",
    },
    {
      id: "good-evil",
      field1: "goodCount",
      field2: "evilCount",
      name: "Good & Evil",
    },
    {
      id: "light-darkness",
      field1: "lightCount",
      field2: "darknessCount",
      name: "Light & Darkness",
    },
    {
      id: "guidance-misguidance",
      field1: "guidanceCount",
      field2: "misguidanceCount",
      name: "Guidance & Misguidance",
    },
    {
      id: "day-night",
      field1: "dayCount",
      field2: "nightCount",
      name: "Day & Night",
    },
    {
      id: "patience-impatience",
      field1: "patienceCount",
      field2: "impatienceCount",
      name: "Patience & Impatience",
    },
  ];

  // Get the currently selected pair
  const currentPair =
    KNOWN_PAIRS.find((pair) => pair.id === selectedPair) || KNOWN_PAIRS[0];

  // Prepare scatter plot data for the selected pair
  const scatterData = data
    .filter(
      (miracle) =>
        typeof miracle[currentPair.field1 as keyof QuranicMiracle] ===
          "number" &&
        typeof miracle[currentPair.field2 as keyof QuranicMiracle] === "number"
    )
    .map((miracle) => ({
      x: miracle[currentPair.field1 as keyof QuranicMiracle] as number,
      y: miracle[currentPair.field2 as keyof QuranicMiracle] as number,
      title: miracle.title,
      type: miracle.type,
    }))
    .filter((point) => point.x > 0 && point.y > 0); // Only show points with valid counts

  // Calculate correlation for the selected pair
  const calculateCorrelation = (data: typeof scatterData): number => {
    if (data.length < 2) return 0;

    const n = data.length;
    const sumX = data.reduce((sum, point) => sum + point.x, 0);
    const sumY = data.reduce((sum, point) => sum + point.y, 0);
    const sumXY = data.reduce((sum, point) => sum + point.x * point.y, 0);
    const sumX2 = data.reduce((sum, point) => sum + point.x * point.x, 0);
    const sumY2 = data.reduce((sum, point) => sum + point.y * point.y, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt(
      (n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY)
    );

    return denominator === 0 ? 0 : numerator / denominator;
  };

  const correlation = calculateCorrelation(scatterData);
  const isPerfectCorrelation = Math.abs(correlation - 1) < 0.01;

  // Prepare data for Nivo scatter plot
  const chartData = [
    {
      id: currentPair.name,
      data: scatterData.map((point) => ({
        x: point.x,
        y: point.y,
        title: point.title,
        type: point.type,
      })),
    },
  ];

  // Get color based on correlation strength
  const getCorrelationColor = (correlation: number): string => {
    if (Math.abs(correlation - 1) < 0.01) return "#10b981"; // Green for perfect correlation
    if (correlation > 0.7) return "#3b82f6"; // Blue for strong correlation
    if (correlation > 0.3) return "#f59e0b"; // Amber for moderate correlation
    return "#6b7280"; // Gray for weak correlation
  };

  return (
    <div className="w-full bg-white dark:bg-stone-800 rounded-2xl shadow-lg border border-stone-200 dark:border-stone-700 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-green-700 dark:text-green-400 text-center sm:text-left">
          Correlation Analysis: {currentPair.name}
        </h3>
        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          <span className="text-sm text-stone-600 dark:text-stone-400">
            Correlation:
          </span>
          <span
            className={`text-lg font-bold ${
              isPerfectCorrelation
                ? "text-green-600 dark:text-green-400"
                : "text-blue-600 dark:text-blue-400"
            }`}
          >
            {correlation.toFixed(3)}
          </span>
          {isPerfectCorrelation && (
            <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-2 py-1 rounded-full">
              Perfect!
            </span>
          )}
        </div>
      </div>

      {/* Pair Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
          Select Pair to Analyze:
        </label>
        <select
          value={selectedPair}
          onChange={(e) => setSelectedPair(e.target.value)}
          className="w-full sm:w-auto px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-green-500 focus:border-green-500"
        >
          {KNOWN_PAIRS.map((pair) => (
            <option key={pair.id} value={pair.id}>
              {pair.name}
            </option>
          ))}
        </select>
      </div>

      {/* Scatter Plot */}
      <div className="h-80">
        {scatterData.length > 0 ? (
          <ResponsiveScatterPlot
            data={chartData}
            margin={{ top: 20, right: 20, bottom: 60, left: 60 }}
            xScale={{ type: "linear", min: 0, max: "auto" }}
            yScale={{ type: "linear", min: 0, max: "auto" }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: currentPair.field1.replace(/Count$/, " Count"),
              legendPosition: "middle",
              legendOffset: 40,
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: currentPair.field2.replace(/Count$/, " Count"),
              legendPosition: "middle",
              legendOffset: -40,
            }}
            colors={getCorrelationColor(correlation)}
            nodeSize={8}
            useMesh={true}
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
              grid: {
                line: {
                  stroke: "#e5e7eb",
                  strokeWidth: 1,
                },
              },
            }}
            tooltip={({ node }) => (
              <div className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-600 rounded-lg p-3 shadow-lg">
                <div className="font-semibold text-stone-900 dark:text-stone-100 mb-1">
                  {node.data.title}
                </div>
                <div className="text-sm text-stone-600 dark:text-stone-400">
                  {currentPair.field1.replace(/Count$/, "")}: {node.data.x}
                </div>
                <div className="text-sm text-stone-600 dark:text-stone-400">
                  {currentPair.field2.replace(/Count$/, "")}: {node.data.y}
                </div>
                <div className="text-xs text-stone-500 dark:text-stone-500 mt-1">
                  Type: {node.data.type}
                </div>
              </div>
            )}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-stone-500 dark:text-stone-400">
            <div className="text-center">
              <div className="text-lg font-semibold mb-2">
                No Data Available
              </div>
              <div className="text-sm">
                No numerical data found for {currentPair.name}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Explanation - Only show when this chart is active */}
      {isActive && (
        <div className="mt-4 p-3 bg-stone-50 dark:bg-stone-700 rounded-lg border border-stone-200 dark:border-stone-600">
          <h4 className="text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">
            Understanding This Chart:
          </h4>
          <ul className="text-xs text-stone-600 dark:text-stone-400 space-y-1">
            <li>
              • <strong>Perfect Line (y=x):</strong> Points on this line show
              equal counts - a mathematical miracle!
            </li>
            <li>
              • <strong>Correlation 1.000:</strong> Perfect correlation
              indicates divine mathematical precision
            </li>
            <li>
              • <strong>Hover for Details:</strong> See exact counts and miracle
              titles
            </li>
            <li>
              • <strong>Switch Pairs:</strong> Explore different Quranic word
              pairs
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
