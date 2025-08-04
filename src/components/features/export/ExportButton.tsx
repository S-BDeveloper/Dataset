import React, { useState } from "react";
import type { UnifiedSearchResult, FilterState } from "../../../types/Types";
import {
  exportData,
  type ExportData,
  type ExportOptions,
} from "../../../utils/exportUtils";

interface ExportButtonProps {
  results: UnifiedSearchResult[];
  searchQuery?: string;
  filters?: FilterState;
  className?: string;
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  results,
  searchQuery,
  filters,
  className = "",
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [exportFormat, setExportFormat] = useState<"csv" | "json" | "pdf">(
    "csv"
  );

  const handleExport = async (format: "csv" | "json" | "pdf") => {
    if (results.length === 0) {
      alert("No results to export");
      return;
    }

    setIsExporting(true);
    try {
      const exportDataObj: ExportData = {
        results,
        searchQuery,
        filters,
        timestamp: new Date().toISOString(),
        totalResults: results.length,
      };

      const options: ExportOptions = {
        format,
        includeMetadata: true,
        title: "Islamic Dataset Export",
      };

      await exportData(exportDataObj, options);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
      setShowExportMenu(false);
    }
  };

  const copyShareableLink = () => {
    const exportDataObj: ExportData = {
      results,
      searchQuery,
      filters,
      timestamp: new Date().toISOString(),
      totalResults: results.length,
    };

    const shareableLink = `${window.location.origin}${
      window.location.pathname
    }?share=${btoa(
      JSON.stringify({
        query: searchQuery,
        results: results.length,
        timestamp: exportDataObj.timestamp,
      })
    )}`;

    navigator.clipboard
      .writeText(shareableLink)
      .then(() => {
        alert("Shareable link copied to clipboard!");
      })
      .catch(() => {
        alert("Failed to copy link. Please copy manually: " + shareableLink);
      });
  };

  return (
    <div className={`relative ${className}`}>
      {/* Main Export Button */}
      <button
        onClick={() => setShowExportMenu(!showExportMenu)}
        disabled={isExporting || results.length === 0}
        className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-stone-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors duration-200"
      >
        {isExporting ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            Exporting...
          </>
        ) : (
          <>
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Export Results ({results.length})
          </>
        )}
      </button>

      {/* Export Menu */}
      {showExportMenu && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-600 rounded-xl shadow-lg z-50">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-stone-700 dark:text-stone-300 mb-3">
              Export Options
            </h3>

            {/* Format Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-stone-600 dark:text-stone-400 mb-2">
                Export Format
              </label>
              <div className="space-y-2">
                {[
                  { value: "csv", label: "CSV", desc: "Spreadsheet format" },
                  { value: "json", label: "JSON", desc: "Structured data" },
                  { value: "pdf", label: "PDF", desc: "Printable document" },
                ].map((format) => (
                  <label
                    key={format.value}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="exportFormat"
                      value={format.value}
                      checked={exportFormat === format.value}
                      onChange={(e) =>
                        setExportFormat(
                          e.target.value as "csv" | "json" | "pdf"
                        )
                      }
                      className="text-green-600 focus:ring-green-500"
                    />
                    <div>
                      <div className="font-medium text-stone-700 dark:text-stone-300">
                        {format.label}
                      </div>
                      <div className="text-xs text-stone-500 dark:text-stone-400">
                        {format.desc}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Export Actions */}
            <div className="space-y-2">
              <button
                onClick={() => handleExport(exportFormat)}
                disabled={isExporting}
                className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-stone-400 text-white font-medium rounded-lg transition-colors duration-200"
              >
                {isExporting
                  ? "Exporting..."
                  : `Export as ${exportFormat.toUpperCase()}`}
              </button>

              <button
                onClick={copyShareableLink}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                Copy Shareable Link
              </button>
            </div>

            {/* Export Info */}
            <div className="mt-3 p-3 bg-stone-50 dark:bg-stone-700 rounded-lg">
              <div className="text-xs text-stone-600 dark:text-stone-400">
                <div>• CSV: Opens in Excel/Google Sheets</div>
                <div>• JSON: For developers and APIs</div>
                <div>• PDF: Printable and shareable</div>
                <div>• Shareable link: Send to others</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {showExportMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowExportMenu(false)}
        />
      )}
    </div>
  );
};
