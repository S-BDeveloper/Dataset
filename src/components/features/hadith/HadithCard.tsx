import type { HadithEntry } from "../../../types/Types";

interface HadithCardProps {
  hadith: HadithEntry;
  index: number;
  onFavorite?: (hadith: HadithEntry) => void;
  isFavorite?: (hadith: HadithEntry) => boolean;
}

export function HadithCard({
  hadith,
  index,
  onFavorite,
  isFavorite,
}: HadithCardProps) {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onFavorite?.(hadith);
  };

  // Helper function to check if a field has meaningful content
  const hasContent = (value: string | undefined): boolean => {
    if (!value) return false;
    const trimmed = value.trim();
    return (
      trimmed.length > 0 &&
      trimmed !== "Unknown" &&
      trimmed !== "Sahih Bukhari" &&
      trimmed !== "Sahih" &&
      !trimmed.includes("placeholder") &&
      !trimmed.includes("not available")
    );
  };

  // Get fields that actually have content
  const contentFields = Object.entries(hadith).filter(([key, value]) => {
    // Skip id field as it's just for identification
    if (key === "id") return false;
    // Skip text, arabic, and translation fields as they're displayed in dedicated sections
    if (key === "text" || key === "arabic" || key === "translation")
      return false;
    return hasContent(value);
  });

  // Get the main text content (usually the hadith text itself)
  const mainText = hadith.text || hadith.arabic || contentFields[0]?.[1] || "";

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
              Hadith #{hadith.number || index + 1}
            </h3>
            {hasContent(hadith.book) && (
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
                {hadith.book}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
            {contentFields.length} fields
          </span>
          {/* Favorite Button */}
          {onFavorite && isFavorite && (
            <button
              onClick={handleFavoriteClick}
              className={`p-2 rounded-full transition-all duration-200 ${
                isFavorite(hadith)
                  ? "bg-yellow-100 hover:bg-yellow-200 text-yellow-600 hover:text-yellow-700"
                  : "text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700"
              }`}
              aria-label={
                isFavorite(hadith)
                  ? "Remove from favorites"
                  : "Add to favorites"
              }
            >
              <svg
                className="h-5 w-5"
                fill={isFavorite(hadith) ? "currentColor" : "none"}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Main Content - Arabic Text */}
      {hasContent(hadith.arabic) && (
        <div className="mb-4 flex-1">
          <div className="bg-stone-50 dark:bg-stone-700 rounded-lg p-3 sm:p-4 border border-stone-200 dark:border-stone-600">
            <h4 className="text-xs font-semibold text-stone-700 dark:text-stone-300 mb-2 uppercase tracking-wide">
              Arabic Text
            </h4>
            <p
              className="text-right text-sm sm:text-lg leading-relaxed text-stone-800 dark:text-stone-200 font-arabic"
              dir="rtl"
            >
              {hadith.arabic}
            </p>
          </div>
        </div>
      )}

      {/* Main Content - Hadith Text */}
      {hasContent(hadith.text) && !hasContent(hadith.arabic) && (
        <div className="mb-4 flex-1">
          <div className="bg-stone-50 dark:bg-stone-700 rounded-lg p-3 sm:p-4 border border-stone-200 dark:border-stone-600">
            <h4 className="text-xs font-semibold text-stone-700 dark:text-stone-300 mb-2 uppercase tracking-wide">
              Hadith Text
            </h4>
            <p
              className="text-sm sm:text-base leading-relaxed text-stone-800 dark:text-stone-200"
              dir="ltr"
            >
              {hadith.text}
            </p>
          </div>
        </div>
      )}

      {/* English Translation */}
      {hasContent(hadith.translation) && (
        <div className="mb-4">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 sm:p-4 border border-yellow-200 dark:border-yellow-700">
            <h4 className="text-xs sm:text-sm font-semibold text-yellow-700 dark:text-yellow-400 mb-2 text-left">
              English Translation
            </h4>
            <p className="text-xs sm:text-sm text-yellow-600 dark:text-yellow-300 text-left">
              {hadith.translation}
            </p>
          </div>
        </div>
      )}

      {/* Additional Content Fields */}
      {contentFields.length > 1 && (
        <div className="mb-4">
          <h4 className="text-xs sm:text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2 text-left">
            Additional Information:
          </h4>
          <div className="space-y-2">
            {contentFields.slice(1).map(([fieldKey, fieldValue], idx) => {
              // Check if this field contains Arabic text
              const isArabicText =
                /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(
                  fieldValue
                );

              return (
                <div
                  key={idx}
                  className="bg-stone-50 dark:bg-stone-700 rounded p-2 sm:p-3 border border-stone-200 dark:border-stone-600"
                >
                  <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mb-1 text-left font-medium">
                    {fieldKey.charAt(0).toUpperCase() + fieldKey.slice(1)}:
                  </p>
                  <p
                    className={`text-xs sm:text-sm leading-relaxed text-stone-800 dark:text-stone-200 ${
                      isArabicText ? "text-right font-arabic" : "text-left"
                    }`}
                    dir={isArabicText ? "rtl" : "ltr"}
                  >
                    {fieldValue.length > 200
                      ? `${fieldValue.substring(0, 200)}...`
                      : fieldValue}
                  </p>
                </div>
              );
            })}
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
            {mainText.length} characters
          </span>
        </div>
        <div className="flex items-center justify-between sm:justify-start space-x-2">
          <span className="text-stone-500 dark:text-stone-400 font-medium">
            Word Count:
          </span>
          <span className="text-stone-700 dark:text-stone-300">
            {mainText.split(/\s+/).length} words
          </span>
        </div>
      </div>

      {/* Source and Grade */}
      <div className="mt-4 pt-4 border-t border-stone-200 dark:border-stone-600">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          {hasContent(hadith.reference) && (
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
              Reference: {hadith.reference}
            </p>
          )}
          {hasContent(hadith.grade) && (
            <span className="inline-block bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full text-xs font-medium">
              {hadith.grade}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
