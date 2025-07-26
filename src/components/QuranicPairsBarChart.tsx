import React from "react";
import type { QuranicMiracle } from "../types/Types";

interface QuranicPairsBarChartProps {
  data: QuranicMiracle[];
}

// QuranicPairsBarChart displays a bar chart of Quranic pairs (example placeholder)
const QuranicPairsBarChart: React.FC<QuranicPairsBarChartProps> = ({
  data,
}) => {
  // Filter only pair type miracles and create chart data
  const pairData = data.filter((item) => item.type === "pair");
  const chartData = pairData.map((item) => {
    // Use the first and second elements of the pair array as label
    const label = Array.isArray(item.pair)
      ? item.pair.join(" & ")
      : String(item.pair);
    // Use the first available count property
    const count =
      item.lifeCount ??
      item.deathCount ??
      item.manCount ??
      item.womanCount ??
      item.heavenCount ??
      item.hellCount ??
      item.patienceCount ??
      item.impatienceCount ??
      0;
    return { pair: label, count };
  });

  // Placeholder chart (replace with Nivo if available)
  return (
    <div className="rounded-2xl shadow border border-stone-200 bg-white p-4 sm:p-6 w-full">
      <div className="w-full h-48 flex items-end gap-4">
        {chartData.map((d) => (
          <div key={d.pair} className="flex flex-col items-center w-12">
            <div
              className="bg-orange-500 w-6 rounded-lg shadow-md transition-all duration-200"
              style={{ height: `${d.count * 10}px` }}
              aria-label={`Pair: ${d.pair}, Count: ${d.count}`}
            />
            <span className="text-xs mt-2 text-orange-700 font-semibold text-center break-words">
              {d.pair}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuranicPairsBarChart;
