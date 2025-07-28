import React from "react";
import { ResponsiveBar } from "@nivo/bar";
import type { QuranicMiracle } from "../../types/Types";

interface WordPairsChartProps {
  data: QuranicMiracle[];
  isActive?: boolean;
}

// WordPairsChart displays an interactive horizontal bar chart of word pair frequencies
export const WordPairsChart: React.FC<WordPairsChartProps> = ({
  data,
  isActive = false,
}) => {
  // Filter only pair type miracles and extract word pairs with their counts
  const pairData = data
    .filter((miracle) => miracle.type === "pair" && miracle.pair)
    .map((miracle) => {
      const pair = Array.isArray(miracle.pair) ? miracle.pair : [miracle.pair];
      const label = pair.join(" & ");

      // Get the count from various possible count properties
      const count =
        miracle.lifeCount ||
        miracle.deathCount ||
        miracle.manCount ||
        miracle.womanCount ||
        miracle.heavenCount ||
        miracle.hellCount ||
        miracle.worldCount ||
        miracle.angelsCount ||
        miracle.goodCount ||
        miracle.patienceCount ||
        0;

      return {
        pair: label,
        count,
        color: "#f59e0b", // Amber color for word pairs
      };
    })
    .filter((item) => item.count > 0) // Only show pairs with counts
    .sort((a, b) => b.count - a.count) // Sort by count descending
    .slice(0, 10); // Show top 10 pairs

  // If no pair data, show a message
  if (pairData.length === 0) {
    return (
      <div className="w-full bg-white dark:bg-stone-800 rounded-2xl shadow-lg border border-stone-200 dark:border-stone-700 p-6 chart-container">
        <h3 className="text-lg font-bold text-green-700 dark:text-green-400 mb-6 text-center">
          Top Word Pair Frequencies
        </h3>
        <div className="h-80 flex items-center justify-center nivo-chart">
          <div className="text-center text-stone-500 dark:text-stone-400">
            <div className="text-lg font-semibold mb-2">No Word Pair Data</div>
            <div className="text-sm">
              Word pair frequency data will appear here when available.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full bg-white dark:bg-stone-800 rounded-2xl shadow-lg border border-stone-200 dark:border-stone-700 p-6 chart-container"
      aria-label="Interactive horizontal bar chart showing word pair frequencies"
    >
      <h3 className="text-lg font-bold text-green-700 dark:text-green-400 mb-6 text-center">
        Top Word Pair Frequencies
      </h3>
      <div className="h-80 nivo-chart">
        <ResponsiveBar
          data={pairData}
          keys={["count"]}
          indexBy="pair"
          layout="horizontal"
          margin={{ top: 20, right: 30, bottom: 60, left: 120 }}
          padding={0.3}
          colors={({ data }) => data.color}
          borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Frequency Count",
            legendPosition: "middle",
            legendOffset: 40,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Word Pairs",
            legendPosition: "middle",
            legendOffset: -100,
          }}
          labelSkipWidth={16}
          labelSkipHeight={12}
          labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
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
          role="img"
          barAriaLabel={(e) => `${e.data.pair}: ${e.data.count} occurrences`}
          tooltip={({ data }) => (
            <div className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-600 rounded-lg p-3 shadow-lg">
              <div className="font-semibold text-stone-900 dark:text-stone-100">
                {data.pair}
              </div>
              <div className="text-stone-600 dark:text-stone-400">
                {data.count} occurrences
              </div>
            </div>
          )}
        />
      </div>

      {/* Explanation - Only show when this chart is active */}
      {isActive && (
        <div className="mt-4 p-3 bg-stone-50 dark:bg-stone-700 rounded-lg border border-stone-200 dark:border-stone-600">
          <h4 className="text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">
            Understanding This Chart:
          </h4>
          <ul className="text-xs text-stone-600 dark:text-stone-400 space-y-1">
            <li>
              • <strong>Word Pairs:</strong> Shows the most frequently occurring
              word pairs in Quranic miracles
            </li>
            <li>
              • <strong>Frequency Count:</strong> Number of times each pair
              appears across all miracles
            </li>
            <li>
              • <strong>Top 10:</strong> Displays the most common pairs for easy
              analysis
            </li>
            <li>
              • <strong>Mathematical Patterns:</strong> Reveals linguistic
              symmetries in the Quran
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
