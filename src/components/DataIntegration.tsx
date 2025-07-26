import React, { useState, useEffect, useCallback } from "react";
import { DataProcessor } from "../utils/dataProcessor";
import type { QuranicMiracle } from "../types/Types";

interface DataIntegrationProps {
  onDataProcessed: (miracles: QuranicMiracle[]) => void;
}

interface ProcessingStatus {
  quran: "idle" | "loading" | "completed" | "error";
  hadith: "idle" | "loading" | "completed" | "error";
  miracles: "idle" | "processing" | "completed" | "error";
}

interface DataStatistics {
  quran: {
    totalVerses: number;
    totalSurahs: number;
    meccanVerses: number;
    medinanVerses: number;
    totalWords: number;
  };
  hadith: {
    totalHadiths: number;
    totalBooks: number;
    totalChapters: number;
    averageReliability: number;
  };
  miracles: {
    total: number;
    byType: Record<string, number>;
  };
}

export const DataIntegration: React.FC<DataIntegrationProps> = ({
  onDataProcessed,
}) => {
  const [processor] = useState(() => new DataProcessor());
  const [status, setStatus] = useState<ProcessingStatus>({
    quran: "idle",
    hadith: "idle",
    miracles: "idle",
  });
  const [statistics, setStatistics] = useState<DataStatistics | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Load Quran data
  const loadQuranData = useCallback(async () => {
    try {
      setStatus((prev) => ({ ...prev, quran: "loading" }));
      setProgress(10);

      const response = await fetch("/src/data/The Quran Dataset.csv");
      if (!response.ok) {
        throw new Error("Failed to load Quran dataset");
      }

      const csvContent = await response.text();
      setProgress(30);

      await processor.loadQuranData(csvContent);
      setProgress(50);

      setStatus((prev) => ({ ...prev, quran: "completed" }));
      setProgress(60);
    } catch (err) {
      setStatus((prev) => ({ ...prev, quran: "error" }));
      setError(
        err instanceof Error ? err.message : "Failed to load Quran data"
      );
    }
  }, [processor]);

  // Load Hadith data
  const loadHadithData = useCallback(async () => {
    try {
      setStatus((prev) => ({ ...prev, hadith: "loading" }));
      setProgress(70);

      const response = await fetch("/src/data/Sahih Bukhari Full Text.txt");
      if (!response.ok) {
        throw new Error("Failed to load Hadith dataset");
      }

      const textContent = await response.text();
      setProgress(80);

      await processor.loadHadithData(textContent);
      setProgress(90);

      setStatus((prev) => ({ ...prev, hadith: "completed" }));
      setProgress(95);
    } catch (err) {
      setStatus((prev) => ({ ...prev, hadith: "error" }));
      setError(
        err instanceof Error ? err.message : "Failed to load Hadith data"
      );
    }
  }, [processor]);

  // Process miracles and prophecies
  const processMiracles = useCallback(async () => {
    try {
      setStatus((prev) => ({ ...prev, miracles: "processing" }));
      setProgress(96);

      // Extract numerical miracles from Quran
      processor.extractNumericalMiracles();
      setProgress(98);

      // Extract prophecies from Hadith
      processor.extractProphecies();
      setProgress(99);

      // Get all processed data
      const allData = processor.getAllData();
      const stats = processor.getStatistics();

      setStatistics(stats);
      setProgress(100);

      setStatus((prev) => ({ ...prev, miracles: "completed" }));

      // Notify parent component with new miracles
      onDataProcessed(allData.miracles);
    } catch (err) {
      setStatus((prev) => ({ ...prev, miracles: "error" }));
      setError(
        err instanceof Error ? err.message : "Failed to process miracles"
      );
    }
  }, [processor, onDataProcessed]);

  // Auto-start processing when component mounts
  useEffect(() => {
    const initializeData = async () => {
      await loadQuranData();
      await loadHadithData();
      await processMiracles();
    };

    initializeData();
  }, [loadQuranData, loadHadithData, processMiracles]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 dark:text-green-400";
      case "loading":
      case "processing":
        return "text-blue-600 dark:text-blue-400";
      case "error":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-stone-600 dark:text-stone-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return "✅";
      case "loading":
      case "processing":
        return "⏳";
      case "error":
        return "❌";
      default:
        return "⏸️";
    }
  };

  return (
    <div className="w-full bg-white dark:bg-stone-800 rounded-2xl shadow-lg border border-stone-200 dark:border-stone-700 p-6">
      <h3 className="text-lg font-bold text-green-700 dark:text-green-400 mb-6">
        Data Integration Dashboard
      </h3>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-stone-600 dark:text-stone-400 mb-2">
          <span>Processing Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-stone-200 dark:bg-stone-700 rounded-full h-2">
          <div
            className="bg-green-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div
          className={`p-4 rounded-lg border ${getStatusColor(
            status.quran
          ).replace("text-", "border-")}`}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{getStatusIcon(status.quran)}</span>
            <span className={`font-semibold ${getStatusColor(status.quran)}`}>
              Quran Dataset
            </span>
          </div>
          <div className="text-sm text-stone-600 dark:text-stone-400">
            {status.quran === "completed" && "Successfully loaded"}
            {status.quran === "loading" && "Loading..."}
            {status.quran === "error" && "Failed to load"}
            {status.quran === "idle" && "Waiting to start"}
          </div>
        </div>

        <div
          className={`p-4 rounded-lg border ${getStatusColor(
            status.hadith
          ).replace("text-", "border-")}`}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{getStatusIcon(status.hadith)}</span>
            <span className={`font-semibold ${getStatusColor(status.hadith)}`}>
              Hadith Dataset
            </span>
          </div>
          <div className="text-sm text-stone-600 dark:text-stone-400">
            {status.hadith === "completed" && "Successfully loaded"}
            {status.hadith === "loading" && "Loading..."}
            {status.hadith === "error" && "Failed to load"}
            {status.hadith === "idle" && "Waiting to start"}
          </div>
        </div>

        <div
          className={`p-4 rounded-lg border ${getStatusColor(
            status.miracles
          ).replace("text-", "border-")}`}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{getStatusIcon(status.miracles)}</span>
            <span
              className={`font-semibold ${getStatusColor(status.miracles)}`}
            >
              Miracles Processing
            </span>
          </div>
          <div className="text-sm text-stone-600 dark:text-stone-400">
            {status.miracles === "completed" && "Successfully processed"}
            {status.miracles === "processing" && "Processing..."}
            {status.miracles === "error" && "Failed to process"}
            {status.miracles === "idle" && "Waiting to start"}
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-red-600 dark:text-red-400">⚠️</span>
            <span className="font-semibold text-red-600 dark:text-red-400">
              Error
            </span>
          </div>
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Statistics Display */}
      {statistics && (
        <div className="space-y-6">
          <h4 className="text-md font-semibold text-stone-700 dark:text-stone-300">
            Dataset Statistics
          </h4>

          {/* Quran Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {statistics.quran.totalVerses.toLocaleString()}
              </div>
              <div className="text-xs text-green-600 dark:text-green-400">
                Quran Verses
              </div>
            </div>
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {statistics.quran.totalSurahs}
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-400">
                Surahs
              </div>
            </div>
            <div className="text-center p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-700">
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {statistics.quran.meccanVerses.toLocaleString()}
              </div>
              <div className="text-xs text-amber-600 dark:text-amber-400">
                Meccan Verses
              </div>
            </div>
            <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {statistics.quran.medinanVerses.toLocaleString()}
              </div>
              <div className="text-xs text-purple-600 dark:text-purple-400">
                Medinan Verses
              </div>
            </div>
            <div className="text-center p-3 bg-stone-50 dark:bg-stone-700 rounded-lg border border-stone-200 dark:border-stone-600">
              <div className="text-2xl font-bold text-stone-600 dark:text-stone-300">
                {statistics.quran.totalWords.toLocaleString()}
              </div>
              <div className="text-xs text-stone-600 dark:text-stone-400">
                Total Words
              </div>
            </div>
          </div>

          {/* Hadith Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {statistics.hadith.totalHadiths.toLocaleString()}
              </div>
              <div className="text-xs text-green-600 dark:text-green-400">
                Hadiths
              </div>
            </div>
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {statistics.hadith.totalBooks}
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-400">
                Books
              </div>
            </div>
            <div className="text-center p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-700">
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {statistics.hadith.totalChapters}
              </div>
              <div className="text-xs text-amber-600 dark:text-amber-400">
                Chapters
              </div>
            </div>
            <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {(statistics.hadith.averageReliability * 100).toFixed(1)}%
              </div>
              <div className="text-xs text-purple-600 dark:text-purple-400">
                Avg Reliability
              </div>
            </div>
          </div>

          {/* Miracles Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {statistics.miracles.total}
              </div>
              <div className="text-xs text-green-600 dark:text-green-400">
                Total Miracles
              </div>
            </div>
            {Object.entries(statistics.miracles.byType).map(([type, count]) => (
              <div
                key={type}
                className="text-center p-3 bg-stone-50 dark:bg-stone-700 rounded-lg border border-stone-200 dark:border-stone-600"
              >
                <div className="text-2xl font-bold text-stone-600 dark:text-stone-300">
                  {count as number}
                </div>
                <div className="text-xs text-stone-600 dark:text-stone-400 capitalize">
                  {type}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-6 flex gap-4">
        <button
          onClick={loadQuranData}
          disabled={status.quran === "loading"}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Reload Quran Data
        </button>
        <button
          onClick={loadHadithData}
          disabled={status.hadith === "loading"}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Reload Hadith Data
        </button>
        <button
          onClick={processMiracles}
          disabled={status.miracles === "processing"}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Reprocess Miracles
        </button>
      </div>

      {/* Completion Message */}
      {status.quran === "completed" &&
        status.hadith === "completed" &&
        status.miracles === "completed" && (
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-green-600 dark:text-green-400">✅</span>
              <span className="font-semibold text-green-600 dark:text-green-400">
                Data Integration Complete!
              </span>
            </div>
            <p className="text-sm text-green-600 dark:text-green-400 mt-2">
              All datasets have been successfully loaded and processed. The new
              miracles and prophecies are now available in your app.
            </p>
          </div>
        )}
    </div>
  );
};
