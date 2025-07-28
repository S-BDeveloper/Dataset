import React from "react";
import type { QuranicMiracle } from "../types/Types";

interface CorrelationMatrixProps {
  miracles: QuranicMiracle[];
}

// Define the known pairs for Quranic miracles
const KNOWN_PAIRS = [
  ["lifeCount", "deathCount"],
  ["manCount", "womanCount"],
  ["heavenCount", "hellCount"],
  ["worldCount", "hereafterCount"],
  ["angelsCount", "devilsCount"],
  ["goodCount", "evilCount"],
  ["lightCount", "darknessCount"],
  ["guidanceCount", "misguidanceCount"],
  ["dayCount", "nightCount"],
  ["patienceCount", "impatienceCount"],
];

// All numerical fields for the full matrix
const NUMERICAL_FIELDS = [
  "lifeCount",
  "deathCount",
  "manCount",
  "womanCount",
  "heavenCount",
  "hellCount",
  "worldCount",
  "hereafterCount",
  "angelsCount",
  "devilsCount",
  "goodCount",
  "evilCount",
  "lightCount",
  "darknessCount",
  "guidanceCount",
  "misguidanceCount",
  "dayCount",
  "nightCount",
  "patienceCount",
  "impatienceCount",
];

export const CorrelationMatrix: React.FC<CorrelationMatrixProps> = ({
  miracles,
}) => {
  // Function to calculate correlation coefficient between two arrays of numbers
  function calculateCorrelation(x: number[], y: number[]): number {
    // Returns Pearson correlation coefficient between two arrays
    if (x.length !== y.length || x.length === 0) return 0;

    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
    const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt(
      (n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY)
    );

    return denominator === 0 ? 0 : numerator / denominator;
  }

  // Function to get color based on correlation strength
  function getCorrelationColor(correlation: number): string {
    const absCorr = Math.abs(correlation);
    if (absCorr < 0.1) return "bg-gray-100 dark:bg-gray-800"; // No correlation
    if (absCorr < 0.3) return "bg-blue-100 dark:bg-blue-900/30"; // Weak correlation
    if (absCorr < 0.5) return "bg-blue-200 dark:bg-blue-800/40"; // Moderate correlation
    if (absCorr < 0.7) return "bg-blue-300 dark:bg-blue-700/50"; // Strong correlation
    return "bg-blue-400 dark:bg-blue-600/60"; // Very strong correlation
  }

  // Function to get text color based on background
  function getTextColor(correlation: number): string {
    const absCorr = Math.abs(correlation);
    if (absCorr < 0.1) return "text-gray-600 dark:text-gray-400";
    if (absCorr < 0.3) return "text-blue-800 dark:text-blue-200";
    if (absCorr < 0.5) return "text-blue-900 dark:text-blue-100";
    if (absCorr < 0.7) return "text-white dark:text-white";
    return "text-white dark:text-white";
  }

  // Check if two fields form a known pair
  function isKnownPair(field1: string, field2: string): boolean {
    return KNOWN_PAIRS.some(
      ([pair1, pair2]) =>
        (field1 === pair1 && field2 === pair2) ||
        (field1 === pair2 && field2 === pair1)
    );
  }

  // Calculate correlation matrix
  const correlationMatrix = NUMERICAL_FIELDS.map((field1) =>
    NUMERICAL_FIELDS.map((field2) => {
      // For diagonal cells (same field), return 1.0 (perfect correlation with itself)
      if (field1 === field2) return 1.0;

      // For known pairs, check if they're equal in the data
      if (isKnownPair(field1, field2)) {
        const pairData = miracles.filter(
          (m) => typeof m[field1] === "number" && typeof m[field2] === "number"
        );

        if (pairData.length > 0) {
          // Check if all values in this pair are equal (perfect correlation)
          const allEqual = pairData.every((m) => m[field1] === m[field2]);
          return allEqual ? 1.0 : 0.0;
        }
      }

      // For other field combinations, calculate correlation
      const pairedValues: { x: number; y: number }[] = [];

      miracles.forEach((miracle) => {
        const value1 = miracle[field1];
        const value2 = miracle[field2];

        // Only include records where both fields have numeric values
        if (typeof value1 === "number" && typeof value2 === "number") {
          pairedValues.push({ x: value1, y: value2 });
        }
      });

      // Need at least 2 data points for meaningful correlation
      if (pairedValues.length < 2) return 0;

      const x = pairedValues.map((p) => p.x);
      const y = pairedValues.map((p) => p.y);

      return calculateCorrelation(x, y);
    })
  );

  return (
    <div className="bg-white dark:bg-stone-900 rounded-xl p-4 border border-green-200 dark:border-green-700 shadow chart-container">
      <h3 className="text-lg font-bold text-green-700 dark:text-green-400 mb-4 flex items-center gap-2">
        Correlation Matrix Analysis
        <span
          className="text-green-500 text-base cursor-help"
          title="This matrix shows correlation coefficients between numerical fields. Values range from -1 (perfect negative correlation) to +1 (perfect positive correlation). Darker colors indicate stronger relationships."
        >
          ?
        </span>
      </h3>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              <th className="px-2 py-2 font-semibold text-left">Field</th>
              {NUMERICAL_FIELDS.map((field) => (
                <th key={field} className="px-2 py-2 font-semibold text-center">
                  {field.replace(/Count$/, "").slice(0, 8)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {NUMERICAL_FIELDS.map((field, rowIndex) => (
              <tr key={field}>
                <td className="px-2 py-2 font-medium text-green-800 dark:text-green-200 text-left">
                  {field.replace(/Count$/, "").slice(0, 8)}
                </td>
                {NUMERICAL_FIELDS.map((_, colIndex) => {
                  const correlation = correlationMatrix[rowIndex][colIndex];
                  const isDiagonal = rowIndex === colIndex;
                  const isKnownPairCell = isKnownPair(
                    field,
                    NUMERICAL_FIELDS[colIndex]
                  );

                  return (
                    <td
                      key={colIndex}
                      className={`px-2 py-2 text-center border ${
                        isDiagonal
                          ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 font-bold"
                          : isKnownPairCell && correlation === 1.0
                          ? "bg-green-200 dark:bg-green-800/40 text-green-900 dark:text-green-100 font-bold"
                          : `${getCorrelationColor(correlation)} ${getTextColor(
                              correlation
                            )}`
                      }`}
                      title={`${field.replace(
                        /Count$/,
                        ""
                      )} vs ${NUMERICAL_FIELDS[colIndex].replace(
                        /Count$/,
                        ""
                      )}: ${correlation.toFixed(3)}${
                        isKnownPairCell && correlation === 1.0
                          ? " (Quranic Miracle!)"
                          : ""
                      }`}
                    >
                      {isDiagonal ? "1.000" : correlation.toFixed(3)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend explaining correlation values */}
      <div className="mt-4 p-4 bg-gray-50 dark:bg-stone-800 rounded-lg">
        <h4 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Correlation Interpretation:
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-100 dark:bg-gray-800 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">
              0.0-0.1: No correlation
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-100 dark:bg-blue-900/30 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">
              0.1-0.3: Weak
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-200 dark:bg-blue-800/40 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">
              0.3-0.5: Moderate
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-200 dark:bg-green-800/40 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">
              1.000: Quranic Miracle!
            </span>
          </div>
        </div>

        {/* Explanation of what the matrix shows */}
        <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-700">
          <h5 className="text-sm font-semibold text-green-800 dark:text-green-200 mb-2">
            Understanding This Matrix:
          </h5>
          <ul className="text-sm text-green-700 dark:text-green-300 space-y-2">
            <li>
              • <strong>Diagonal (1.000):</strong> A field perfectly correlates
              with itself (expected)
            </li>
            <li>
              • <strong>Green cells (1.000):</strong> Perfect Quranic miracles!
              These pairs always have equal counts
            </li>
            <li>
              • <strong>Gray cells (0.000):</strong> No relationship between
              these fields (also expected)
            </li>
            <li>
              • <strong>Example:</strong> "lifeCount vs deathCount = 1.000"
              means they're always equal - a mathematical miracle!
            </li>
          </ul>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
          Hover over cells to see exact correlation values. Green cells with
          1.000 reveal Quranic mathematical miracles!
        </p>
      </div>
    </div>
  );
};
