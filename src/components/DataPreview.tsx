import React, { useState } from "react";
import type { QuranicMiracle } from "../types/Types";

interface DataPreviewProps {
  data: QuranicMiracle[];
  maxRows?: number;
}

// DataPreview displays a table preview of the signs and guidance data
export const DataPreview: React.FC<DataPreviewProps> = ({
  data,
  maxRows = 10,
}) => {
  // Track which rows are expanded - must be at the top before any early returns
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-stone-500 dark:text-stone-400">
        No data available to preview.
      </div>
    );
  }

  // Create a representative sample showing different types
  const getRepresentativeSample = (data: QuranicMiracle[], maxRows: number) => {
    if (!maxRows) return data;

    // Group by type
    const groupedByType = data.reduce((acc, item) => {
      if (!acc[item.type]) acc[item.type] = [];
      acc[item.type].push(item);
      return acc;
    }, {} as Record<string, QuranicMiracle[]>);

    // Calculate how many from each type to show
    const types = Object.keys(groupedByType);
    const itemsPerType = Math.max(1, Math.floor(maxRows / types.length));

    // Take samples from each type
    const sample: QuranicMiracle[] = [];
    types.forEach((type) => {
      const typeItems = groupedByType[type].slice(0, itemsPerType);
      sample.push(...typeItems);
    });

    // If we have room, add more from types with more items
    const remaining = maxRows - sample.length;
    if (remaining > 0) {
      types.forEach((type) => {
        const typeItems = groupedByType[type];
        const alreadyAdded = sample.filter((item) => item.type === type).length;
        const additional = Math.min(remaining, typeItems.length - alreadyAdded);
        if (additional > 0) {
          sample.push(
            ...typeItems.slice(alreadyAdded, alreadyAdded + additional)
          );
        }
      });
    }

    return sample.slice(0, maxRows);
  };

  const displayData = maxRows ? getRepresentativeSample(data, maxRows) : data;
  const columns = ["Title", "Type", "Details", "Count", "Notes"];

  const toggleRow = (index: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedRows(newExpanded);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white dark:bg-stone-800 rounded-xl shadow border border-stone-200 dark:border-stone-700">
        <thead>
          <tr className="bg-stone-200 dark:bg-stone-900 border-b border-stone-300 dark:border-stone-600">
            {columns.map((column) => (
              <th
                key={column}
                className="px-4 py-3 text-left text-sm font-semibold text-stone-900 dark:text-stone-100 uppercase tracking-wider"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {displayData.map((miracle, index) => {
            const isExpanded = expandedRows.has(index);
            return (
              <React.Fragment key={index}>
                <tr
                  className={`border-b border-stone-100 dark:border-stone-700 transition-colors cursor-pointer ${
                    index % 2 === 0
                      ? "bg-white dark:bg-stone-700"
                      : "bg-stone-100 dark:bg-stone-800"
                  }`}
                  onClick={() => toggleRow(index)}
                >
                  <td className="px-4 py-3 text-sm text-stone-900 dark:text-stone-100 font-medium">
                    {miracle.title}
                  </td>
                  <td className="px-4 py-3 text-sm text-stone-700 dark:text-stone-300">
                    <span className="inline-block px-2 py-1 text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full capitalize">
                      {miracle.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-stone-600 dark:text-stone-400 max-w-xs">
                    {miracle.status ? (
                      <span
                        className={`inline-block px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                          miracle.status === "Fulfilled"
                            ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                            : miracle.status === "Yet to Happen"
                            ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300"
                            : miracle.status === "Proven"
                            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                            : "bg-stone-100 dark:bg-stone-700 text-stone-800 dark:text-stone-300"
                        }`}
                      >
                        {miracle.status}
                      </span>
                    ) : miracle.location || miracle.source ? (
                      <span className="text-blue-700 dark:text-blue-400 font-medium">
                        {miracle.location || miracle.source}
                      </span>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-stone-700 dark:text-stone-300 font-medium">
                    N/A
                  </td>
                  <td className="px-4 py-3 text-sm text-stone-600 dark:text-stone-400 max-w-xs">
                    <div className="flex items-center justify-between">
                      <span className={isExpanded ? "" : "truncate"}>
                        {miracle.notes || miracle.description || "N/A"}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleRow(index);
                        }}
                        className="ml-2 text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 transition-colors"
                        aria-label={
                          isExpanded ? "Collapse details" : "Expand details"
                        }
                      >
                        <svg
                          className={`w-4 h-4 transition-transform ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Expanded details row */}
                {isExpanded && (
                  <tr
                    className={`border-b border-stone-200 dark:border-stone-600 ${
                      index % 2 === 0
                        ? "bg-stone-200 dark:bg-stone-600"
                        : "bg-stone-300 dark:bg-stone-500"
                    }`}
                  >
                    <td colSpan={5} className="px-4 py-3">
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Full description */}
                          <div>
                            <h4 className="font-semibold text-stone-800 dark:text-stone-200 mb-2">
                              Full Description
                            </h4>
                            <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">
                              {miracle.description ||
                                miracle.notes ||
                                "No description available."}
                            </p>
                          </div>

                          {/* Additional details based on type */}
                          <div>
                            <h4 className="font-semibold text-stone-800 dark:text-stone-200 mb-2">
                              Additional Details
                            </h4>
                            <div className="space-y-2 text-sm text-stone-600 dark:text-stone-400">
                              {miracle.status && (
                                <p>
                                  <strong>Status:</strong>{" "}
                                  <span
                                    className={`inline-block px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                                      miracle.status === "Fulfilled"
                                        ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                                        : miracle.status === "Yet to Happen"
                                        ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300"
                                        : miracle.status === "Proven"
                                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                                        : "bg-stone-100 dark:bg-stone-700 text-stone-800 dark:text-stone-300"
                                    }`}
                                  >
                                    {miracle.status}
                                  </span>
                                </p>
                              )}
                              {miracle.location && (
                                <p>
                                  <strong>Location:</strong> {miracle.location}
                                </p>
                              )}
                              {miracle.source && (
                                <p>
                                  <strong>Source:</strong> {miracle.source}
                                </p>
                              )}
                              {miracle.significance && (
                                <p>
                                  <strong>Significance:</strong>{" "}
                                  {miracle.significance}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Sources section if available */}
                        {miracle.sources && (
                          <div className="border-t border-stone-200 dark:border-stone-600 pt-3">
                            <h4 className="font-semibold text-stone-800 dark:text-stone-200 mb-2">
                              Sources & References
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-stone-600 dark:text-stone-400">
                              <div>
                                <p>
                                  <strong>Primary:</strong>{" "}
                                  {miracle.sources.primary}
                                </p>
                                <p>
                                  <strong>Methodology:</strong>{" "}
                                  {miracle.sources.methodology}
                                </p>
                              </div>
                              <div>
                                <p>
                                  <strong>Source:</strong>{" "}
                                  {miracle.sources.source}
                                </p>
                                {miracle.sources.references &&
                                  miracle.sources.references.length > 0 && (
                                    <div>
                                      <strong>References:</strong>
                                      <ul className="mt-1 space-y-1">
                                        {miracle.sources.references
                                          .slice(0, 2)
                                          .map((ref, refIndex) => (
                                            <li key={refIndex}>
                                              <a
                                                href={ref}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 underline text-xs break-all"
                                              >
                                                {ref}
                                              </a>
                                            </li>
                                          ))}
                                        {miracle.sources.references.length >
                                          2 && (
                                          <li className="text-stone-500 dark:text-stone-400 text-xs">
                                            +
                                            {miracle.sources.references.length -
                                              2}{" "}
                                            more references
                                          </li>
                                        )}
                                      </ul>
                                    </div>
                                  )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
      {maxRows && data.length > maxRows && (
        <div className="text-center py-3 text-sm text-stone-500 dark:text-stone-400 bg-stone-50 dark:bg-stone-800 border-t border-stone-200 dark:border-stone-700">
          Showing {maxRows} of {data.length} signs and guidance
        </div>
      )}
    </div>
  );
};
