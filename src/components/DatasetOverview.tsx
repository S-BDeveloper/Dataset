import React from "react";
import type { QuranicMiracle } from "../types/Types";

interface DatasetOverviewProps {
  data: QuranicMiracle[];
  description: string;
  lastUpdated: string;
}

// DatasetOverview displays a summary of the entire dataset
export const DatasetOverview: React.FC<DatasetOverviewProps> = ({
  data,
  description,
  lastUpdated,
}) => {
  const totalSigns = data.length;
  const uniqueTypes = Array.from(new Set(data.map((m) => m.type))).length;

  return (
    <div className="space-y-4 dark:bg-stone-800">
      <div className="flex flex-wrap gap-6">
        <div className="flex flex-col">
          <span className="text-stone-500 dark:text-stone-400 font-semibold text-sm">
            Total Signs
          </span>
          <span className="text-green-700 dark:text-green-400 text-2xl font-bold">
            {totalSigns}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-stone-500 dark:text-stone-400 font-semibold text-sm">
            Sign Types
          </span>
          <span className="text-orange-700 dark:text-orange-400 text-2xl font-bold">
            {uniqueTypes}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-stone-500 dark:text-stone-400 font-semibold text-sm">
            Last Updated
          </span>
          <span className="text-stone-700 dark:text-stone-300 text-lg font-medium">
            {lastUpdated}
          </span>
        </div>
      </div>

      <div className="bg-stone-50 dark:bg-stone-800 rounded-lg p-4 border border-stone-200 dark:border-stone-700">
        <h3 className="font-semibold text-stone-800 dark:text-stone-200 mb-2">
          About This Dataset
        </h3>
        <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">
          {description}
        </p>
      </div>

      <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-700">
        <h3 className="font-semibold text-green-800 dark:text-green-300 mb-2">
          Dataset Features
        </h3>
        <ul className="text-green-700 dark:text-green-400 text-sm space-y-1">
          <li>• Word pairs with equal frequency counts</li>
          <li>• Mathematical patterns and numerical signs</li>
          <li>• Scientific facts confirmed by modern research</li>
          <li>• Prophetic predictions and their fulfillment</li>
          <li>• Structural and linguistic signs</li>
          <li>• Nutritional and health guidance</li>
        </ul>
      </div>
    </div>
  );
};
