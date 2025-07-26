import React from "react";
import type { QuranicMiracle } from "../types/Types";

interface DataQualityAnalysisProps {
  miracles: QuranicMiracle[];
}

// All numerical fields for analysis
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

export const DataQualityAnalysis: React.FC<DataQualityAnalysisProps> = ({
  miracles,
}) => {
  // Calculate completeness percentage for a field
  function calculateCompleteness(field: string): number {
    const validValues = miracles.filter((m) => {
      const value = m[field as keyof QuranicMiracle];
      return value !== null && value !== undefined && value !== "";
    }).length;
    return (validValues / miracles.length) * 100;
  }

  // Detect outliers using IQR method
  function detectOutliers(field: string): number[] {
    const values = miracles
      .map((m) => m[field as keyof QuranicMiracle])
      .filter((v): v is number => typeof v === "number");

    if (values.length < 4) return [];

    const sorted = values.sort((a, b) => a - b);
    const q1 = sorted[Math.floor(sorted.length * 0.25)];
    const q3 = sorted[Math.floor(sorted.length * 0.75)];
    const iqr = q3 - q1;
    const lowerBound = q1 - iqr * 1.5;
    const upperBound = q3 + iqr * 1.5;

    return values.filter((v) => v < lowerBound || v > upperBound);
  }

  // Check for logical inconsistencies in pairs
  function checkPairConsistency(): {
    pair: string;
    consistent: boolean;
    details: string;
  }[] {
    const pairChecks = [
      { field1: "lifeCount", field2: "deathCount", name: "Life & Death" },
      { field1: "manCount", field2: "womanCount", name: "Man & Woman" },
      { field1: "heavenCount", field2: "hellCount", name: "Heaven & Hell" },
      {
        field1: "worldCount",
        field2: "hereafterCount",
        name: "World & Hereafter",
      },
      { field1: "angelsCount", field2: "devilsCount", name: "Angels & Devils" },
      { field1: "goodCount", field2: "evilCount", name: "Good & Evil" },
      {
        field1: "lightCount",
        field2: "darknessCount",
        name: "Light & Darkness",
      },
      {
        field1: "guidanceCount",
        field2: "misguidanceCount",
        name: "Guidance & Misguidance",
      },
      { field1: "dayCount", field2: "nightCount", name: "Day & Night" },
      {
        field1: "patienceCount",
        field2: "impatienceCount",
        name: "Patience & Impatience",
      },
    ];

    return pairChecks.map(({ field1, field2, name }) => {
      const pairMiracles = miracles.filter(
        (m) =>
          typeof m[field1 as keyof QuranicMiracle] === "number" &&
          typeof m[field2 as keyof QuranicMiracle] === "number"
      );

      const inconsistent = pairMiracles.filter(
        (m) =>
          m[field1 as keyof QuranicMiracle] !==
          m[field2 as keyof QuranicMiracle]
      );

      return {
        pair: name,
        consistent: inconsistent.length === 0,
        details:
          inconsistent.length > 0
            ? `${inconsistent.length} records have mismatched values`
            : "All pairs are perfectly balanced",
      };
    });
  }

  // Calculate overall data quality score
  function calculateQualityScore(): number {
    const completenessScore =
      NUMERICAL_FIELDS.reduce(
        (sum, field) => sum + calculateCompleteness(field),
        0
      ) / NUMERICAL_FIELDS.length;

    const consistencyScore =
      (checkPairConsistency().filter((c) => c.consistent).length / 10) * 100;

    const outlierScore = Math.max(
      0,
      100 -
        NUMERICAL_FIELDS.reduce(
          (sum, field) => sum + detectOutliers(field).length,
          0
        ) *
          5
    );

    return Math.round(
      (completenessScore + consistencyScore + outlierScore) / 3
    );
  }

  const qualityScore = calculateQualityScore();
  const pairConsistency = checkPairConsistency();

  return (
    <div className="bg-white dark:bg-stone-900 rounded-xl p-4 border border-green-200 dark:border-green-700 shadow">
      <h3 className="text-lg font-bold text-green-700 dark:text-green-400 mb-4 flex items-center gap-2">
        Data Quality Analysis
        <span
          className="text-green-500 text-base cursor-help"
          title="Comprehensive analysis of data completeness, consistency, and reliability"
        >
          ?
        </span>
      </h3>

      {/* Overall Quality Score */}
      <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg border border-green-200 dark:border-green-700">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-semibold text-green-800 dark:text-green-200">
              Overall Data Quality Score
            </h4>
            <p className="text-sm text-green-600 dark:text-green-300">
              Based on completeness, consistency, and outlier analysis
            </p>
          </div>
          <div className="text-center">
            <div
              className={`text-3xl font-bold ${
                qualityScore >= 90
                  ? "text-green-600 dark:text-green-400"
                  : qualityScore >= 70
                  ? "text-yellow-600 dark:text-yellow-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {qualityScore}%
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {qualityScore >= 90
                ? "Excellent"
                : qualityScore >= 70
                ? "Good"
                : "Needs Attention"}
            </div>
          </div>
        </div>
      </div>

      {/* Data Completeness */}
      <div className="mb-6">
        <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Data Completeness by Field
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {NUMERICAL_FIELDS.map((field) => {
            const completeness = calculateCompleteness(field);
            return (
              <div
                key={field}
                className="flex items-center justify-between p-2 bg-gray-50 dark:bg-stone-800 rounded"
              >
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {field.replace(/Count$/, " Count")}
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-gray-200 dark:bg-stone-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        completeness >= 90
                          ? "bg-green-500"
                          : completeness >= 70
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${completeness}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 w-8">
                    {Math.round(completeness)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pair Consistency Check */}
      <div className="mb-6">
        <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Quranic Pair Consistency
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {pairConsistency.map(({ pair, consistent, details }) => (
            <div
              key={pair}
              className={`p-2 rounded border ${
                consistent
                  ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700"
                  : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    consistent ? "bg-green-500" : "bg-red-500"
                  }`}
                ></span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {pair}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {details}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Outlier Detection */}
      <div className="mb-4">
        <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Outlier Detection
        </h4>
        <div className="space-y-2">
          {NUMERICAL_FIELDS.map((field) => {
            const outliers = detectOutliers(field);
            if (outliers.length === 0) return null;

            return (
              <div
                key={field}
                className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-700"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {field.replace(/Count$/, " Count")}
                  </span>
                  <span className="text-xs text-yellow-600 dark:text-yellow-400">
                    {outliers.length} outlier{outliers.length > 1 ? "s" : ""}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Values: {outliers.join(", ")}
                </p>
              </div>
            );
          })}
        </div>
        {NUMERICAL_FIELDS.every(
          (field) => detectOutliers(field).length === 0
        ) && (
          <p className="text-sm text-green-600 dark:text-green-400 p-2 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-700">
            ✅ No outliers detected - data appears to be consistent
          </p>
        )}
      </div>

      {/* Data Quality Summary */}
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-700">
        <h5 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
          Data Quality Summary:
        </h5>
        <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
          <li>
            • <strong>Completeness:</strong> Average{" "}
            {Math.round(
              NUMERICAL_FIELDS.reduce(
                (sum, field) => sum + calculateCompleteness(field),
                0
              ) / NUMERICAL_FIELDS.length
            )}
            % of fields have data
          </li>
          <li>
            • <strong>Consistency:</strong>{" "}
            {pairConsistency.filter((c) => c.consistent).length}/10 Quranic
            pairs are perfectly balanced
          </li>
          <li>
            • <strong>Reliability:</strong>{" "}
            {NUMERICAL_FIELDS.every(
              (field) => detectOutliers(field).length === 0
            )
              ? "No outliers detected"
              : "Some outliers found"}
          </li>
        </ul>
      </div>
    </div>
  );
};
