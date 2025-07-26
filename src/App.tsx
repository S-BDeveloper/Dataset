import { useRef, useState } from "react";
import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import SubmitFact from "./pages/SubmitFact";
import AdminReview from "./pages/AdminReview";
import Favorites from "./pages/Favorites";
import QuranicPairs from "./pages/QuranicPairs";
import LoadingSkeleton from "./components/LoadingSkeleton";
import { useMiracles } from "./hooks/useFacts";
import { useMiracleFilters } from "./hooks/useFactFilters";
import type { MiracleFilters } from "./hooks/useFactFilters";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import { DarkModeProvider } from "./contexts/DarkModeContext";

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

  const miraclesListRef = useRef(null);
  const [activeTab, setActiveTab] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  // Export functions
  const handleExportCSV = () => {
    const csv = toCSV(sortedMiracles);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "quranic-signs-guidance.csv";
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
    a.download = "quranic-signs-guidance.json";
    a.click();
    window.URL.revokeObjectURL(url);
    setToast("JSON exported successfully!");
  };

  if (loading) {
    return (
      <main className="container mx-auto max-w-6xl px-4 py-12 bg-stone-50 rounded-2xl shadow-lg mt-8 mb-12">
        <h2 className="text-2xl font-bold text-green-700 mb-6 text-left tracking-tight">
          Loading Quranic Signs & Guidance...
        </h2>
        <LoadingSkeleton count={8} />
      </main>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="flex flex-col items-center bg-red-100 border border-red-400 rounded p-6 shadow">
          <span className="text-red-700 font-semibold text-lg mb-2">
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
    <DarkModeProvider>
      <div className="min-h-screen bg-stone-50 dark:bg-stone-900 transition-colors duration-300">
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                miracles={miracles}
                sortedMiracles={sortedMiracles}
                paginatedMiracles={paginatedMiracles}
                filters={filters}
                setFilters={setFilters}
                types={types}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
                goToPage={goToPage}
                setGoToPage={setGoToPage}
                handleGoToPage={handleGoToPage}
                handleExportCSV={handleExportCSV}
                handleExportJSON={handleExportJSON}
                setToast={setToast}
                miraclesListRef={miraclesListRef}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            }
          />
          <Route path="/submit" element={<SubmitFact />} />
          <Route path="/admin" element={<AdminReview />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/quranic-pairs" element={<QuranicPairs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>

        {/* Toast notification */}
        {toast && (
          <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50">
            {toast}
          </div>
        )}
      </div>
    </DarkModeProvider>
  );
}

export default App;
