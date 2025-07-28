import type { HadithEntry } from "../types/Types";

interface HadithCardProps {
  hadith: HadithEntry;
  index: number;
}

export function HadithCard({ hadith, index }: HadithCardProps) {
  // Extract the first key-value pair as the main content
  const entries = Object.entries(hadith);
  const mainEntry = entries[0];
  const [, value] = mainEntry;

  return (
    <div className="w-full h-full bg-white dark:bg-stone-800 rounded-xl p-4 sm:p-6 shadow-lg border border-stone-200 dark:border-stone-700 hover:shadow-xl transition-shadow flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-stone-100 dark:bg-purple-900/30 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center flex-shrink-0">
            <span className="text-stone-700 dark:text-purple-400 font-bold text-base sm:text-lg">
              {index + 1}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base sm:text-lg font-bold text-stone-700 dark:text-purple-400 truncate">
              Hadith #{index + 1}
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
              Sahih Bukhari
            </p>
          </div>
        </div>
        <div className="flex justify-end sm:justify-start">
          <span className="inline-block bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
            {entries.length} parts
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="mb-4 flex-1">
        <div className="bg-stone-50 dark:bg-stone-700 rounded-lg p-3 sm:p-4 border border-stone-200 dark:border-stone-600">
          <p className="text-right text-sm sm:text-lg leading-relaxed text-stone-800 dark:text-stone-200 font-arabic">
            {value}
          </p>
        </div>
      </div>

      {/* English Translation Placeholder */}
      <div className="mb-4">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 sm:p-4 border border-yellow-200 dark:border-yellow-700">
          <h4 className="text-xs sm:text-sm font-semibold text-yellow-700 dark:text-yellow-400 mb-2">
            English Translation:
          </h4>
          <p className="text-xs sm:text-sm text-yellow-600 dark:text-yellow-300 italic">
            English translations for Hadith are not currently available in this
            dataset. This feature will be added when translation data becomes
            available.
          </p>
        </div>
      </div>

      {/* Additional Entries */}
      {entries.length > 1 && (
        <div className="mb-4">
          <h4 className="text-xs sm:text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">
            Additional Content:
          </h4>
          <div className="space-y-2">
            {entries.slice(1).map(([entryKey, entryValue], idx) => (
              <div
                key={idx}
                className="bg-stone-50 dark:bg-stone-700 rounded p-2 sm:p-3 border border-stone-200 dark:border-stone-600"
              >
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mb-1">
                  {entryKey.length > 50
                    ? `${entryKey.substring(0, 50)}...`
                    : entryKey}
                </p>
                <p className="text-right text-xs sm:text-base leading-relaxed text-stone-800 dark:text-stone-200 font-arabic">
                  {entryValue.length > 200
                    ? `${entryValue.substring(0, 200)}...`
                    : entryValue}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm mt-auto">
        <div className="flex items-center justify-between sm:justify-start space-x-2">
          <span className="text-stone-500 dark:text-stone-400 font-medium">
            Content Length:
          </span>
          <span className="text-stone-700 dark:text-stone-300">
            {value.length} characters
          </span>
        </div>
        <div className="flex items-center justify-between sm:justify-start space-x-2">
          <span className="text-stone-500 dark:text-stone-400 font-medium">
            Word Count:
          </span>
          <span className="text-stone-700 dark:text-stone-300">
            {value.split(/\s+/).length} words
          </span>
        </div>
      </div>

      {/* Source */}
      <div className="mt-4 pt-4 border-t border-stone-200 dark:border-stone-600">
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
          Source: Sahih Bukhari Collection
        </p>
      </div>
    </div>
  );
}
