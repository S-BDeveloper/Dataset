import React, { useState, useMemo } from "react";
import type { QuranicMiracle } from "../../types/Types";

interface SpatialProphecyMapProps {
  data: QuranicMiracle[];
  isActive?: boolean;
}

// Sample geographical data for prophecies
const PROPHECY_LOCATIONS = [
  {
    id: "SAU",
    name: "Saudi Arabia",
    prophecies: [
      "Return of Jews to Palestine",
      "Discovery of Oil Resources",
      "Modernization of Mecca",
    ],
    coordinates: [45.0792, 23.8859],
    fulfillmentCount: 3,
  },
  {
    id: "ISR",
    name: "Israel",
    prophecies: [
      "Return of Jews to Palestine",
      "Rebuilding of Jerusalem",
      "Technological Advancements",
    ],
    coordinates: [34.8516, 31.0461],
    fulfillmentCount: 3,
  },
  {
    id: "TUR",
    name: "Turkey",
    prophecies: ["Fall of Constantinople", "Modern Istanbul"],
    coordinates: [35.2433, 38.9637],
    fulfillmentCount: 2,
  },
  {
    id: "EGY",
    name: "Egypt",
    prophecies: ["Modern Pyramids", "Nile River Changes"],
    coordinates: [30.8025, 26.8206],
    fulfillmentCount: 2,
  },
  {
    id: "IRN",
    name: "Iran",
    prophecies: ["Persian Empire Changes", "Modern Iran"],
    coordinates: [53.688, 32.4279],
    fulfillmentCount: 2,
  },
  {
    id: "IRQ",
    name: "Iraq",
    prophecies: ["Babylon Ruins", "Tigris-Euphrates Changes"],
    coordinates: [43.6793, 33.2232],
    fulfillmentCount: 2,
  },
  {
    id: "SYR",
    name: "Syria",
    prophecies: ["Damascus Destruction", "Modern Conflicts"],
    coordinates: [38.9968, 34.8021],
    fulfillmentCount: 2,
  },
  {
    id: "YEM",
    name: "Yemen",
    prophecies: ["Sana'a Development", "Modern Yemen"],
    coordinates: [47.5868, 15.5527],
    fulfillmentCount: 1,
  },
  {
    id: "OMN",
    name: "Oman",
    prophecies: ["Modern Oman", "Gulf Development"],
    coordinates: [55.9233, 21.4735],
    fulfillmentCount: 1,
  },
  {
    id: "ARE",
    name: "UAE",
    prophecies: ["Dubai Development", "Modern Emirates"],
    coordinates: [53.8478, 23.4241],
    fulfillmentCount: 2,
  },
];

export const SpatialProphecyMap: React.FC<SpatialProphecyMapProps> = ({
  data,
  isActive = false,
}) => {
  const [selectedView, setSelectedView] = useState<"fulfillment" | "density">(
    "fulfillment"
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Filter prophecies
  const prophecies = data.filter((miracle) => miracle.type === "prophecy");

  // Get categories for filtering
  const categories = useMemo(() => {
    const cats = Array.from(
      new Set(prophecies.map((p) => p.prophecyCategory).filter(Boolean))
    );
    return ["all", ...cats];
  }, [prophecies]);

  // Filter prophecies by category
  const filteredProphecies = useMemo(() => {
    if (selectedCategory === "all") return prophecies;
    return prophecies.filter((p) => p.prophecyCategory === selectedCategory);
  }, [prophecies, selectedCategory]);

  // Prepare map data
  const mapData = useMemo(() => {
    return PROPHECY_LOCATIONS.map((location) => {
      const locationProphecies = location.prophecies.filter((prophecyTitle) =>
        filteredProphecies.some((p) => p.title.includes(prophecyTitle))
      );

      const fulfilledCount = locationProphecies.length;
      const totalCount = location.prophecies.length;

      return {
        id: location.id,
        value: selectedView === "fulfillment" ? fulfilledCount : totalCount,
        label: location.name,
        prophecies: locationProphecies,
        fulfillmentRate:
          totalCount > 0 ? (fulfilledCount / totalCount) * 100 : 0,
        coordinates: location.coordinates,
      };
    });
  }, [filteredProphecies, selectedView]);

  // Calculate statistics
  const totalLocations = mapData.length;
  const totalProphecies = mapData.reduce(
    (sum, location) => sum + location.value,
    0
  );
  const averageFulfillmentRate =
    mapData.reduce((sum, location) => sum + location.fulfillmentRate, 0) /
    totalLocations;

  return (
    <div className="w-full bg-white dark:bg-stone-800 rounded-2xl shadow-lg border border-stone-200 dark:border-stone-700 p-6">
      <h3 className="text-lg font-bold text-green-700 dark:text-green-400 mb-6 text-center">
        Spatial Prophecy Mapping
      </h3>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {totalLocations}
          </div>
          <div className="text-xs text-green-600 dark:text-green-400">
            Countries
          </div>
        </div>
        <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {totalProphecies}
          </div>
          <div className="text-xs text-blue-600 dark:text-blue-400">
            Total Prophecies
          </div>
        </div>
        <div className="text-center p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-700">
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
            {Math.round(averageFulfillmentRate)}%
          </div>
          <div className="text-xs text-amber-600 dark:text-amber-400">
            Avg Fulfillment
          </div>
        </div>
        <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {filteredProphecies.length}
          </div>
          <div className="text-xs text-purple-600 dark:text-purple-400">
            Filtered
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
            View:
          </label>
          <select
            value={selectedView}
            onChange={(e) =>
              setSelectedView(e.target.value as "fulfillment" | "density")
            }
            className="px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="fulfillment">Fulfillment Rate</option>
            <option value="density">Prophecy Density</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
            Category:
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === "all"
                  ? "All Categories"
                  : (category || "").charAt(0).toUpperCase() +
                    (category || "").slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Map */}
      <div className="h-96 bg-stone-50 dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-600">
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg font-semibold text-stone-700 dark:text-stone-300 mb-2">
              Interactive World Map
            </div>
            <div className="text-sm text-stone-500 dark:text-stone-400 mb-4">
              {selectedView === "fulfillment"
                ? "Showing prophecy fulfillment rates by country"
                : "Showing total prophecy density by country"}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl">
              {mapData.slice(0, 6).map((location) => (
                <div
                  key={location.id}
                  className="p-3 bg-white dark:bg-stone-800 rounded border border-stone-200 dark:border-stone-600"
                >
                  <div className="font-semibold text-sm text-stone-900 dark:text-stone-100">
                    {location.label}
                  </div>
                  <div className="text-xs text-stone-500 dark:text-stone-400">
                    {selectedView === "fulfillment"
                      ? `${location.fulfillmentRate.toFixed(0)}% fulfilled`
                      : `${location.value} prophecies`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-stone-200 dark:bg-stone-600 rounded"></div>
          <span className="text-sm text-stone-600 dark:text-stone-400">
            Low {selectedView === "fulfillment" ? "Fulfillment" : "Density"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-sm text-stone-600 dark:text-stone-400">
            High {selectedView === "fulfillment" ? "Fulfillment" : "Density"}
          </span>
        </div>
      </div>

      {/* Explanation - Only show when this chart is active */}
      {isActive && (
        <div className="mt-4 p-3 bg-stone-50 dark:bg-stone-700 rounded-lg border border-stone-200 dark:border-stone-600">
          <h4 className="text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">
            Understanding This Map:
          </h4>
          <ul className="text-xs text-stone-600 dark:text-stone-400 space-y-1">
            <li>
              • <strong>Geographical Distribution:</strong> Shows where
              prophecies were revealed and fulfilled
            </li>
            <li>
              • <strong>Fulfillment Rate:</strong> Percentage of prophecies
              fulfilled in each region
            </li>
            <li>
              • <strong>Prophecy Density:</strong> Total number of prophecies
              per country
            </li>
            <li>
              • <strong>Pattern Recognition:</strong> Identify regions with high
              prophetic activity
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
