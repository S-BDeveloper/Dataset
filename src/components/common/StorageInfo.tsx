import {
  getStorageStats,
  clearAllFavorites,
  exportFavorites,
} from "../../hooks/useFavorites";
import { useLanguage } from "../../hooks/useContext";

interface StorageInfoProps {
  className?: string;
}

export function StorageInfo({ className = "" }: StorageInfoProps) {
  const { t } = useLanguage();
  const stats = getStorageStats();

  const handleExport = () => {
    const exportData = exportFavorites();
    if (exportData) {
      const blob = new Blob([exportData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `favorites-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleClear = () => {
    if (window.confirm(t("storage.confirmClear"))) {
      clearAllFavorites();
      window.location.reload(); // Refresh to update the UI
    }
  };

  return (
    <div
      className={`bg-stone-50 dark:bg-stone-800 rounded-lg p-4 border border-stone-200 dark:border-stone-700 ${className}`}
    >
      <h3 className="text-sm font-semibold text-stone-700 dark:text-stone-300 mb-3">
        {t("storage.title")}
      </h3>

      <div className="space-y-3">
        {/* Storage Usage Bar */}
        <div>
          <div className="flex justify-between text-xs text-stone-600 dark:text-stone-400 mb-1">
            <span>{t("storage.usage")}</span>
            <span>{stats.percentage}%</span>
          </div>
          <div className="w-full bg-stone-200 dark:bg-stone-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                stats.percentage > 80
                  ? "bg-red-500"
                  : stats.percentage > 60
                  ? "bg-yellow-500"
                  : "bg-green-500"
              }`}
              style={{ width: `${Math.min(stats.percentage, 100)}%` }}
            ></div>
          </div>
          <div className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            {stats.sizeMB} MB / {stats.maxSizeMB} MB ({stats.count} favorites)
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            disabled={stats.count === 0}
            className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {t("storage.export")}
          </button>
          <button
            onClick={handleClear}
            disabled={stats.count === 0}
            className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {t("storage.clear")}
          </button>
        </div>

        {/* Storage Tips */}
        {stats.percentage > 60 && (
          <div className="text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20 rounded p-2">
            <strong>{t("storage.warning")}:</strong> {t("storage.using")}{" "}
            {stats.percentage}% of available storage.{" "}
            {t("storage.considerExport")}
          </div>
        )}
      </div>
    </div>
  );
}
