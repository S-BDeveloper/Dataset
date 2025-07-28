import { useRef, useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import Favorites from "./pages/Favorites";

import LoadingSkeleton from "./components/LoadingSkeleton";
import { useMiracles } from "./hooks/useFacts";
import { useMiracleFilters } from "./hooks/useFactFilters";
import type { MiracleFilters } from "./types/Types";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import { DarkModeProvider } from "./contexts/DarkModeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import SubmitDiscovery from "./pages/SubmitDiscovery";
import AdminReview from "./pages/AdminReview";

// Utility to convert array of objects to CSV
function toCSV<T extends object>(data: T[]): string {
  if (!data.length) return "";
  const keys = Object.keys(data[0]) as (keyof T)[];
  const csvRows = [keys.join(",")];
  for (const row of data) {
    csvRows.push(
      keys.map((k) => `"${String(row[k] ?? "").replace(/"/g, '""')}"`).join(",")
    );
  }
  return csvRows.join("\n");
}

function App({ loadingDelay = 1000 }) {
  const initialFilters: MiracleFilters = {
    searchTerm: "",
    type: "",
    sortBy: "title",
  };

  const { miracles, loading, error, refetch } = useMiracles(loadingDelay);

  const {
    filters,
    setFilters,
    types,
    paginatedMiracles,
    sortedMiracles,
    currentPage,
    setCurrentPage,
    totalPages,
    goToPage,
    setGoToPage,
    handleGoToPage,
  } = useMiracleFilters(miracles, initialFilters, 8);

  const miraclesListRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [toast, setToast] = useState<string | null>(null);

  // Auto-clear toast after 3 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Export functions
  const handleExportCSV = () => {
    const csv = toCSV(sortedMiracles);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "islamic-signs-guidance.csv";
    a.click();
    window.URL.revokeObjectURL(url);
    setToast("CSV exported successfully!");
  };

  const handleExportJSON = () => {
    const json = JSON.stringify(sortedMiracles, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "islamic-signs-guidance.json";
    a.click();
    window.URL.revokeObjectURL(url);
    setToast("JSON exported successfully!");
  };

  if (loading) {
    return (
      <main className="container mx-auto max-w-6xl px-4 py-12 bg-stone-50 dark:bg-stone-800 rounded-2xl shadow-lg mt-8 mb-12">
        <h2 className="text-2xl font-bold text-green-700 dark:text-green-400 mb-6 text-left tracking-tight">
          Loading Islamic Signs and Guidance...
        </h2>
        <LoadingSkeleton count={8} />
      </main>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-900">
        <div className="flex flex-col items-center bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 rounded p-6 shadow">
          <span className="text-red-700 dark:text-red-300 font-semibold text-lg mb-2">
            {error}
          </span>
          <button
            onClick={refetch}
            className="px-4 py-2 rounded bg-green-700 text-white font-semibold border border-green-700 mt-2 hover:bg-green-800 focus:ring-2 focus:ring-green-500"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <LanguageProvider>
      <DarkModeProvider>
        <div className="min-h-screen bg-stone-50 dark:bg-stone-900 transition-colors duration-300 flex flex-col w-full overflow-hidden">
          <Navbar />
          <main className="flex-1 w-full overflow-hidden">
            <Routes>
              <Route
                path="/"
                element={
                  <HomePage
                    miracles={miracles}
                    paginatedMiracles={paginatedMiracles}
                    filters={filters}
                    setFilters={setFilters}
                    types={types}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    totalPages={totalPages}
                    goToPage={goToPage}
                    setGoToPage={setGoToPage}
                    handleGoToPage={() => handleGoToPage(Number(goToPage))}
                    handleExportCSV={handleExportCSV}
                    handleExportJSON={handleExportJSON}
                    setToast={setToast}
                    miraclesListRef={miraclesListRef}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                  />
                }
              />

              <Route path="/favorites" element={<Favorites />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Submit Discovery Route */}
              <Route path="/submit-discovery" element={<SubmitDiscovery />} />

              {/* Admin Review Route */}
              <Route path="/admin" element={<AdminReview />} />
            </Routes>
          </main>
          <Footer />

          {/* Toast notification */}
          {toast && (
            <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50">
              {toast}
            </div>
          )}
        </div>
      </DarkModeProvider>
    </LanguageProvider>
  );
}

export default App;
