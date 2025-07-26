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
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center border border-green-200">
        <div className="text-2xl font-bold text-green-700">{totalSigns}</div>
        <div className="text-sm text-green-600 font-medium">Total Signs</div>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center border border-blue-200">
        <div className="text-2xl font-bold text-blue-700">{filteredCount}</div>
        <div className="text-sm text-blue-600 font-medium">Filtered</div>
      </div>

      <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 text-center border border-orange-200">
        <div className="text-2xl font-bold text-orange-700">{pairSigns}</div>
        <div className="text-sm text-orange-600 font-medium">Word Pairs</div>
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 text-center border border-purple-200">
        <div className="text-2xl font-bold text-purple-700">
          {numericalSigns +
            structuralSigns +
            linguisticSigns +
            prophecySigns +
            middleSigns +
            scientificSigns}
        </div>
        <div className="text-sm text-purple-600 font-medium">Other Types</div>
      </div>
    </div>
  );
};
