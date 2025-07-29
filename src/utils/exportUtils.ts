// Export utilities for CSV and JSON
import type { QuranicMiracle } from "../types/Types";

// Utility to convert array of objects to CSV
export function toCSV<T extends object>(data: T[]): string {
  if (data.length === 0) return "";

  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(","), // Header row
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = (row as Record<string, unknown>)[header];
          // Escape commas and quotes in CSV
          const escapedValue = String(value).replace(/"/g, '""');
          return `"${escapedValue}"`;
        })
        .join(",")
    ),
  ];

  return csvRows.join("\n");
}

// Utility to convert data to JSON string
export function toJSON<T>(data: T): string {
  return JSON.stringify(data, null, 2);
}

// Export miracles data as CSV
export function exportMiraclesCSV(miracles: QuranicMiracle[]): string {
  return toCSV(miracles);
}

// Export miracles data as JSON
export function exportMiraclesJSON(miracles: QuranicMiracle[]): string {
  return toJSON(miracles);
}

// Download file utility
export function downloadFile(
  content: string,
  filename: string,
  mimeType: string
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
