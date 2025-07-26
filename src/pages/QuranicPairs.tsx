import React from "react";
import QuranicPairsBarChart from "../components/QuranicPairsBarChart";
import quranicMiraclesData from "../data/quranic_miracles.json";
import type { QuranicMiracle } from "../types/Types";
import Breadcrumb from "../components/Breadcrumb";

// QuranicPairs page displays a bar chart of Quranic numerical pairs
const QuranicPairs: React.FC = () => {
  // You can add more advanced logic here if needed (filtering, searching, etc.)
  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <Breadcrumb />
      <h1 className="text-3xl font-bold text-green-700 mb-6">
        Mathematical Patterns
      </h1>
      <div className="bg-white rounded-2xl shadow border border-stone-200 p-6 mb-8">
        <div className="text-stone-700 mb-4">
          This chart visualizes the frequency of special word pairs found in the
          Quran, showing mathematical patterns and symmetries.
        </div>
        <QuranicPairsBarChart data={quranicMiraclesData as QuranicMiracle[]} />
      </div>
    </main>
  );
};

export default QuranicPairs;
