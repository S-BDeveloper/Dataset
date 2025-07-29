import type { QuranAyah } from "../../../types/Types";

interface QuranCardProps {
  ayah: QuranAyah;
}

export function QuranCard({ ayah }: QuranCardProps) {
  return (
    <div className="w-full h-full bg-white dark:bg-stone-800 rounded-xl p-4 sm:p-6 shadow-lg border border-stone-200 dark:border-stone-700 hover:shadow-xl transition-shadow flex flex-col">
      {/* Header with Surah and Ayah info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-green-100 dark:bg-green-900/30 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center flex-shrink-0">
            <span className="text-green-700 dark:text-green-400 font-bold text-base sm:text-lg">
              {ayah.surah_no}:{ayah.ayah_no_surah}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base sm:text-lg font-bold text-green-700 dark:text-green-400 truncate">
              {ayah.surah_name_en}
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
              {ayah.surah_name_roman}
            </p>
          </div>
        </div>
        <div className="flex justify-end sm:justify-start">
          <span className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
            {ayah.place_of_revelation}
          </span>
        </div>
      </div>

      {/* Arabic Text */}
      <div className="mb-4 flex-1">
        <div className="bg-stone-50 dark:bg-stone-700 rounded-lg p-3 sm:p-4 border border-stone-200 dark:border-stone-600">
          <p
            className="text-right text-lg sm:text-2xl leading-relaxed text-stone-800 dark:text-stone-200 font-arabic"
            dir="rtl"
          >
            {ayah.ayah_ar}
          </p>
        </div>
      </div>

      {/* English Translation */}
      {ayah.ayah_en && (
        <div className="mb-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 sm:p-4 border border-blue-200 dark:border-blue-700">
            <h4
              className="text-xs sm:text-sm font-semibold text-blue-700 dark:text-blue-400 mb-2 text-left"
              dir="ltr"
            >
              English Translation:
            </h4>
            <p
              className="text-sm sm:text-base leading-relaxed text-blue-800 dark:text-blue-300 text-left"
              dir="ltr"
            >
              {ayah.ayah_en}
            </p>
          </div>
        </div>
      )}

      {/* Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm mt-auto">
        <div className="flex items-center justify-between sm:justify-start space-x-2">
          <span className="text-stone-500 dark:text-stone-400 font-medium">
            Ayah Number:
          </span>
          <span className="text-stone-700 dark:text-stone-300">
            {ayah.ayah_no_quran} of {ayah.total_ayah_quran}
          </span>
        </div>
        <div className="flex items-center justify-between sm:justify-start space-x-2">
          <span className="text-stone-500 dark:text-stone-400 font-medium">
            Words:
          </span>
          <span className="text-stone-700 dark:text-stone-300">
            {ayah.no_of_word_ayah}
          </span>
        </div>
        <div className="flex items-center justify-between sm:justify-start space-x-2">
          <span className="text-stone-500 dark:text-stone-400 font-medium">
            Hizb Quarter:
          </span>
          <span className="text-stone-700 dark:text-stone-300">
            {ayah.hizb_quarter}
          </span>
        </div>
        <div className="flex items-center justify-between sm:justify-start space-x-2">
          <span className="text-stone-500 dark:text-stone-400 font-medium">
            Sajdah:
          </span>
          <span className="text-stone-700 dark:text-stone-300">
            {ayah.sajah_ayah ? "Yes" : "No"}
          </span>
        </div>
      </div>

      {/* Arabic Name */}
      <div className="mt-4 pt-4 border-t border-stone-200 dark:border-stone-600">
        <p
          className="text-sm sm:text-lg text-stone-600 dark:text-stone-400 font-arabic text-right"
          dir="rtl"
        >
          {ayah.surah_name_ar}
        </p>
      </div>
    </div>
  );
}
