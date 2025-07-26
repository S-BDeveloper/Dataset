import React from "react";
import type { QuranicMiracle } from "../types/Types";
import { CorrelationMatrix } from "./CorrelationMatrix";
import { DataQualityAnalysis } from "./DataQualityAnalysis";

interface StatsProps {
  miracles: QuranicMiracle[];
  filteredCount: number;
}

// Stats displays key statistics about the signs and guidance dataset
export const Stats: React.FC<StatsProps> = ({ miracles, filteredCount }) => {
  // Calculate statistics
  const totalSigns = miracles.length;
  const pairSigns = miracles.filter((m) => m.type === "pair").length;
  const numericalSigns = miracles.filter((m) => m.type === "numerical").length;
  const structuralSigns = miracles.filter((m) => m.type === "structure").length;
  const linguisticSigns = miracles.filter(
    (m) => m.type === "linguistic"
  ).length;
  const prophecySigns = miracles.filter((m) => m.type === "prophecy").length;
  const middleSigns = miracles.filter((m) => m.type === "middle").length;
  const scientificSigns = miracles.filter(
    (m) => m.type === "scientific"
  ).length;

  // Utility functions for statistics
  function mean(values: number[]): number {
    // Calculates the average value
    if (!values.length) return 0;
    return values.reduce((a, b) => a + b, 0) / values.length;
  }

  function median(values: number[]): number {
    // Calculates the middle value
    if (!values.length) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0
      ? sorted[mid]
      : (sorted[mid - 1] + sorted[mid]) / 2;
  }

  function mode(values: number[]): number | null {
    // Calculates the most frequent value
    if (!values.length) return null;
    const freq: Record<number, number> = {};
    values.forEach((v) => (freq[v] = (freq[v] || 0) + 1));
    let maxFreq = 0;
    let modeVal: number | null = null;
    for (const val in freq) {
      if (freq[val] > maxFreq) {
        maxFreq = freq[val];
        modeVal = Number(val);
      }
    }
    return modeVal;
  }

  function stddev(values: number[]): number {
    // Calculates the standard deviation
    if (!values.length) return 0;
    const avg = mean(values);
    const variance = mean(values.map((v) => (v - avg) ** 2));
    return Math.sqrt(variance);
  }

  function min(values: number[]): number {
    // Finds the minimum value
    return values.length ? Math.min(...values) : 0;
  }

  function max(values: number[]): number {
    // Finds the maximum value
    return values.length ? Math.max(...values) : 0;
  }

  // List of all relevant numerical fields in QuranicMiracle
  const NUM_FIELDS = [
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

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 dark:bg-stone-800">
        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/30 rounded-xl p-4 text-center border border-green-200 dark:border-green-700">
          <div className="text-2xl font-bold text-green-700 dark:text-green-400">
            {totalSigns}
          </div>
          <div className="text-sm text-green-600 dark:text-green-300 font-medium">
            Total Signs
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/30 rounded-xl p-4 text-center border border-blue-200 dark:border-blue-700">
          <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">
            {filteredCount}
          </div>
          <div className="text-sm text-blue-600 dark:text-blue-300 font-medium">
            Filtered
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/30 rounded-xl p-4 text-center border border-orange-200 dark:border-orange-700">
          <div className="text-2xl font-bold text-orange-700 dark:text-orange-400">
            {pairSigns}
          </div>
          <div className="text-sm text-orange-600 dark:text-orange-300 font-medium">
            Word Pairs
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/30 rounded-xl p-4 text-center border border-purple-200 dark:border-purple-700">
          <div className="text-2xl font-bold text-purple-700 dark:text-purple-400">
            {numericalSigns +
              structuralSigns +
              linguisticSigns +
              prophecySigns +
              middleSigns +
              scientificSigns}
          </div>
          <div className="text-sm text-purple-600 dark:text-purple-300 font-medium">
            Other Types
          </div>
        </div>
      </div>

      {/* Advanced Statistical Analysis Table */}
      <div className="mt-8 bg-white dark:bg-stone-900 rounded-xl p-4 border border-green-200 dark:border-green-700 shadow">
        <h3 className="text-lg font-bold text-green-700 dark:text-green-400 mb-4 flex items-center gap-2">
          Advanced Statistical Analysis
          {/* Inline explanation: This section shows key metrics for each numerical field in the dataset. */}
          <span
            className="text-green-500 text-base"
            title="This table summarizes the mean, median, mode, min, max, and standard deviation for each numerical field in the dataset."
          >
            ?
          </span>
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead>
              <tr className="bg-green-50 dark:bg-stone-800">
                <th className="px-2 py-1 font-semibold">Field</th>
                <th className="px-2 py-1 font-semibold">Mean</th>
                <th className="px-2 py-1 font-semibold">Median</th>
                <th className="px-2 py-1 font-semibold">Mode</th>
                <th className="px-2 py-1 font-semibold">Min</th>
                <th className="px-2 py-1 font-semibold">Max</th>
                <th className="px-2 py-1 font-semibold">Std Dev</th>
              </tr>
            </thead>
            <tbody>
              {NUM_FIELDS.map((field) => {
                // Gather all values for this field
                const values = miracles
                  .map((m) =>
                    typeof m[field] === "number" ? (m[field] as number) : null
                  )
                  .filter((v): v is number => v !== null && v !== undefined);
                if (!values.length) return null;
                return (
                  <tr
                    key={field}
                    className="border-b border-green-100 dark:border-stone-700"
                  >
                    <td className="px-2 py-1 font-medium text-green-800 dark:text-green-200">
                      {field.replace(/Count$/, " Count")}
                    </td>
                    {/* Inline explanation: Each cell below shows a different statistical metric for this field. */}
                    <td className="px-2 py-1">{mean(values).toFixed(2)}</td>
                    <td className="px-2 py-1">{median(values).toFixed(2)}</td>
                    <td className="px-2 py-1">
                      {mode(values) !== null ? mode(values) : "-"}
                    </td>
                    <td className="px-2 py-1">{min(values)}</td>
                    <td className="px-2 py-1">{max(values)}</td>
                    <td className="px-2 py-1">{stddev(values).toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {/* Inline explanation: This table helps users quickly understand the distribution and variability of each numerical field in the dataset. */}
      </div>

      {/* Correlation Matrix Analysis */}
      <div className="mt-8">
        <CorrelationMatrix miracles={miracles} />
      </div>

      {/* Data Quality Analysis */}
      <div className="mt-8">
        <DataQualityAnalysis miracles={miracles} />
      </div>
    </>
  );
};
