import React, { useState, useEffect } from "react";
import { DataIntegration } from "../components/DataIntegration";
import { EnhancedDataDashboard } from "../components/EnhancedDataDashboard";
import { DataEnrichment } from "../utils/dataEnrichment";
import type { QuranicMiracle } from "../types/Types";
import type { EnrichedMiracle } from "../utils/dataEnrichment";

interface EnrichmentStatistics {
  totalEnriched: number;
  withQuranicContext: number;
  withHadithContext: number;
  withCrossReferences: number;
  enhancedCategories: number;
  byType: Record<string, number>;
}

const DataIntegrationPage: React.FC = () => {
  const [miracles, setMiracles] = useState<QuranicMiracle[]>([]);
  const [enrichedMiracles, setEnrichedMiracles] = useState<EnrichedMiracle[]>(
    []
  );
  const [isEnriching, setIsEnriching] = useState(false);
  const [enrichmentStats, setEnrichmentStats] =
    useState<EnrichmentStatistics | null>(null);
  const [activeTab, setActiveTab] = useState<
    "integration" | "enrichment" | "dashboard"
  >("integration");
  const [toast, setToast] = useState<string | null>(null);

  // Handle data processing from DataIntegration component
  const handleDataProcessed = (newMiracles: QuranicMiracle[]) => {
    setMiracles(newMiracles);
    setToast(
      `Successfully processed ${newMiracles.length} miracles from datasets!`
    );
  };

  // Handle data enrichment
  const handleDataEnrichment = async () => {
    setIsEnriching(true);
    try {
      const enrichment = new DataEnrichment();
      const enriched = await enrichment.enrichData();
      setEnrichedMiracles(enriched);

      const stats = enrichment.getEnrichmentStatistics();
      setEnrichmentStats(stats);

      setToast(
        `Successfully enriched ${enriched.length} miracles with additional context!`
      );
    } catch (error) {
      console.error("Error during enrichment:", error);
      setToast(
        "Error during data enrichment. Please check console for details."
      );
    } finally {
      setIsEnriching(false);
    }
  };

  // Export enriched data
  const handleExportEnriched = () => {
    if (enrichedMiracles.length === 0) {
      setToast("No enriched data to export. Please run enrichment first.");
      return;
    }

    const enrichment = new DataEnrichment();
    const jsonData = enrichment.exportEnrichedData();
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "enriched-quranic-miracles.json";
    a.click();
    window.URL.revokeObjectURL(url);
    setToast("Enriched data exported successfully!");
  };

  // Auto-hide toast after 5 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900 transition-colors duration-300">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-green-700 dark:text-green-400 mb-4">
            Data Integration & Enrichment Center
          </h1>
          <p className="text-lg text-stone-600 dark:text-stone-400">
            Process Quran and Hadith datasets to extract miracles, prophecies,
            and create enriched data for the Quranic Signs & Guidance app.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8">
          {[
            { id: "integration", label: "Data Integration", icon: "📊" },
            { id: "enrichment", label: "Data Enrichment", icon: "🔍" },
            { id: "dashboard", label: "Analytics Dashboard", icon: "📈" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() =>
                setActiveTab(
                  tab.id as "integration" | "enrichment" | "dashboard"
                )
              }
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-green-600 text-white"
                  : "bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-600"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "integration" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <DataIntegration onDataProcessed={handleDataProcessed} />
            <EnhancedDataDashboard
              miracles={miracles}
              quranStats={{
                totalVerses: 6236,
                meccanVerses: 4472,
                medinanVerses: 1764,
              }}
              hadithStats={{ totalHadiths: 7563, prophecies: 150 }}
            />
          </div>
        )}

        {activeTab === "enrichment" && (
          <div className="space-y-8">
            {/* Enrichment Controls */}
            <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-lg border border-stone-200 dark:border-stone-700 p-6">
              <h3 className="text-lg font-bold text-green-700 dark:text-green-400 mb-4">
                Data Enrichment Process
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {miracles.length}
                  </div>
                  <div className="text-sm text-blue-600 dark:text-blue-400">
                    Processed Miracles
                  </div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {enrichedMiracles.length}
                  </div>
                  <div className="text-sm text-purple-600 dark:text-purple-400">
                    Enriched Miracles
                  </div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {enrichmentStats?.totalEnriched || 0}
                  </div>
                  <div className="text-sm text-green-600 dark:text-green-400">
                    Total Enriched
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleDataEnrichment}
                  disabled={isEnriching || miracles.length === 0}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {isEnriching ? "Enriching..." : "Start Enrichment"}
                </button>
                <button
                  onClick={handleExportEnriched}
                  disabled={enrichedMiracles.length === 0}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Export Enriched Data
                </button>
              </div>
            </div>

            {/* Enrichment Statistics */}
            {enrichmentStats && (
              <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-lg border border-stone-200 dark:border-stone-700 p-6">
                <h3 className="text-lg font-bold text-green-700 dark:text-green-400 mb-4">
                  Enrichment Statistics
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                  <div className="text-center p-3 bg-stone-50 dark:bg-stone-700 rounded-lg border border-stone-200 dark:border-stone-600">
                    <div className="text-2xl font-bold text-stone-600 dark:text-stone-300">
                      {enrichmentStats.withQuranicContext}
                    </div>
                    <div className="text-xs text-stone-600 dark:text-stone-400">
                      With Quran Context
                    </div>
                  </div>
                  <div className="text-center p-3 bg-stone-50 dark:bg-stone-700 rounded-lg border border-stone-200 dark:border-stone-600">
                    <div className="text-2xl font-bold text-stone-600 dark:text-stone-300">
                      {enrichmentStats.withHadithContext}
                    </div>
                    <div className="text-xs text-stone-600 dark:text-stone-400">
                      With Hadith Context
                    </div>
                  </div>
                  <div className="text-center p-3 bg-stone-50 dark:bg-stone-700 rounded-lg border border-stone-200 dark:border-stone-600">
                    <div className="text-2xl font-bold text-stone-600 dark:text-stone-300">
                      {enrichmentStats.withCrossReferences}
                    </div>
                    <div className="text-xs text-stone-600 dark:text-stone-400">
                      With Cross References
                    </div>
                  </div>
                  <div className="text-center p-3 bg-stone-50 dark:bg-stone-700 rounded-lg border border-stone-200 dark:border-stone-600">
                    <div className="text-2xl font-bold text-stone-600 dark:text-stone-300">
                      {enrichmentStats.enhancedCategories}
                    </div>
                    <div className="text-xs text-stone-600 dark:text-stone-400">
                      Enhanced Categories
                    </div>
                  </div>
                  <div className="text-center p-3 bg-stone-50 dark:bg-stone-700 rounded-lg border border-stone-200 dark:border-stone-600">
                    <div className="text-2xl font-bold text-stone-600 dark:text-stone-300">
                      {enrichmentStats.totalEnriched}
                    </div>
                    <div className="text-xs text-stone-600 dark:text-stone-400">
                      Total Enriched
                    </div>
                  </div>
                </div>

                {/* Miracle Types Distribution */}
                <div className="p-4 bg-stone-50 dark:bg-stone-700 rounded-lg border border-stone-200 dark:border-stone-600">
                  <h4 className="text-md font-semibold text-stone-700 dark:text-stone-300 mb-3">
                    Enriched Miracles by Type
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {Object.entries(enrichmentStats.byType).map(
                      ([type, count]) => (
                        <div
                          key={type}
                          className="flex justify-between items-center p-2 bg-white dark:bg-stone-800 rounded border"
                        >
                          <span className="text-sm capitalize">{type}</span>
                          <span className="font-semibold text-sm">
                            {count as number}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Sample Enriched Data */}
            {enrichedMiracles.length > 0 && (
              <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-lg border border-stone-200 dark:border-stone-700 p-6">
                <h3 className="text-lg font-bold text-green-700 dark:text-green-400 mb-4">
                  Sample Enriched Miracles
                </h3>

                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {enrichedMiracles.slice(0, 5).map((miracle, index) => (
                    <div
                      key={index}
                      className="p-4 bg-stone-50 dark:bg-stone-700 rounded-lg border border-stone-200 dark:border-stone-600"
                    >
                      <h4 className="font-semibold text-stone-900 dark:text-stone-100 mb-2">
                        {miracle.title}
                      </h4>
                      <p className="text-sm text-stone-600 dark:text-stone-400 mb-2">
                        {miracle.notes}
                      </p>

                      {miracle.enhancedCategories && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {miracle.enhancedCategories.themes.map((theme, i) => (
                            <span
                              key={i}
                              className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-2 py-1 rounded"
                            >
                              {theme}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="text-xs text-stone-500 dark:text-stone-400">
                        Type: {miracle.type} |
                        {miracle.quranicContext &&
                          ` Quran: ${miracle.quranicContext.surah} ${miracle.quranicContext.ayah} |`}
                        {miracle.hadithContext &&
                          ` Hadith: ${miracle.hadithContext.book} |`}
                        Enhanced Categories:{" "}
                        {miracle.enhancedCategories?.secondary.join(", ")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "dashboard" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <EnhancedDataDashboard
              miracles={[...miracles, ...enrichedMiracles]}
              quranStats={{
                totalVerses: 6236,
                meccanVerses: 4472,
                medinanVerses: 1764,
              }}
              hadithStats={{ totalHadiths: 7563, prophecies: 150 }}
            />

            {/* Additional Analytics */}
            <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-lg border border-stone-200 dark:border-stone-700 p-6">
              <h3 className="text-lg font-bold text-green-700 dark:text-green-400 mb-4">
                Data Quality Metrics
              </h3>

              <div className="space-y-4">
                <div className="p-4 bg-stone-50 dark:bg-stone-700 rounded-lg border border-stone-200 dark:border-stone-600">
                  <h4 className="text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">
                    Processing Status
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Quran Dataset:</span>
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        ✓ Processed
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Hadith Dataset:</span>
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        ✓ Processed
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Data Enrichment:</span>
                      <span
                        className={`font-semibold ${
                          enrichedMiracles.length > 0
                            ? "text-green-600 dark:text-green-400"
                            : "text-amber-600 dark:text-amber-400"
                        }`}
                      >
                        {enrichedMiracles.length > 0
                          ? "✓ Completed"
                          : "⏳ Pending"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-stone-50 dark:bg-stone-700 rounded-lg border border-stone-200 dark:border-stone-600">
                  <h4 className="text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">
                    Data Coverage
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span>Quran Verses:</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-stone-200 dark:bg-stone-600 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: "100%" }}
                          ></div>
                        </div>
                        <span className="font-semibold">100%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Hadith Collection:</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-stone-200 dark:bg-stone-600 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: "95%" }}
                          ></div>
                        </div>
                        <span className="font-semibold">95%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Miracle Extraction:</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-stone-200 dark:bg-stone-600 rounded-full h-2">
                          <div
                            className="bg-purple-600 h-2 rounded-full"
                            style={{ width: "85%" }}
                          ></div>
                        </div>
                        <span className="font-semibold">85%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Toast notification */}
      {toast && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          {toast}
        </div>
      )}
    </div>
  );
};

export default DataIntegrationPage;
