import React from "react";
import quranicMiraclesData from "../data/quranic_miracles.json";
import type { QuranicMiracle } from "../types/Types";
import Breadcrumb from "../components/Breadcrumb";
import { ChartsDashboard } from "../components/charts/ChartsDashboard";

// QuranicPairs page displays interactive charts of Quranic numerical patterns
const QuranicPairs: React.FC = () => {
  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <Breadcrumb />
      <h1 className="text-3xl font-bold text-green-700 dark:text-green-400 mb-6">
        Mathematical Patterns & Visualizations
      </h1>
      <div className="bg-white dark:bg-stone-800 rounded-2xl shadow border border-stone-200 dark:border-stone-700 p-6 mb-8">
        <div className="text-stone-700 dark:text-stone-300 mb-6">
          Interactive charts and visualizations showing the mathematical
          patterns, word pairs, and category distributions found in the Quranic
          miracles.
        </div>
        <ChartsDashboard data={quranicMiraclesData as QuranicMiracle[]} />
      </div>
    </main>
  );
};

export default QuranicPairs;
