import React from "react";
import type { QuranicMiracle } from "../types/Types";

interface StatsProps {
  miracles: QuranicMiracle[];
  filteredCount: number;
}

// Stats displays key statistics about the signs and guidance dataset
export const Stats: React.FC<StatsProps> = ({ miracles, filteredCount }) => {
  // Calculate statistics
  const totalSigns = miracles.length;
  const pairSigns = miracles.filter((m) => m.type === "pair").length;
  const numericalSigns = miracles.filter((m) => m.type === "numerical").length;
  const structuralSigns = miracles.filter((m) => m.type === "structure").length;
  const linguisticSigns = miracles.filter(
    (m) => m.type === "linguistic"
  ).length;
  const prophecySigns = miracles.filter((m) => m.type === "prophecy").length;
  const middleSigns = miracles.filter((m) => m.type === "middle").length;
  const scientificSigns = miracles.filter(
    (m) => m.type === "scientific"
  ).length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 dark:bg-stone-800">
      <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/30 rounded-xl p-4 text-center border border-green-200 dark:border-green-700">
        <div className="text-2xl font-bold text-green-700 dark:text-green-400">
          {totalSigns}
        </div>
        <div className="text-sm text-green-600 dark:text-green-300 font-medium">
          Total Signs
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/30 rounded-xl p-4 text-center border border-blue-200 dark:border-blue-700">
        <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">
          {filteredCount}
        </div>
        <div className="text-sm text-blue-600 dark:text-blue-300 font-medium">
          Filtered
        </div>
      </div>

      <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/30 rounded-xl p-4 text-center border border-orange-200 dark:border-orange-700">
        <div className="text-2xl font-bold text-orange-700 dark:text-orange-400">
          {pairSigns}
        </div>
        <div className="text-sm text-orange-600 dark:text-orange-300 font-medium">
          Word Pairs
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/30 rounded-xl p-4 text-center border border-purple-200 dark:border-purple-700">
        <div className="text-2xl font-bold text-purple-700 dark:text-purple-400">
          {numericalSigns +
            structuralSigns +
            linguisticSigns +
            prophecySigns +
            middleSigns +
            scientificSigns}
        </div>
        <div className="text-sm text-purple-600 dark:text-purple-300 font-medium">
          Other Types
        </div>
      </div>
    </div>
  );
};
