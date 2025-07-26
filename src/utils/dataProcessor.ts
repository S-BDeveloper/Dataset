import type { QuranicMiracle } from "../types/Types";

// Quran Data Structure
export interface QuranVerse {
  surah_no: number;
  surah_name_en: string;
  surah_name_ar: string;
  ayah_no_surah: number;
  ayah_no_quran: number;
  ayah_ar: string;
  ayah_en: string;
  place_of_revelation: string;
  no_of_word_ayah: number;
  list_of_words: string[];
}

// Hadith Data Structure
export interface HadithEntry {
  book: string;
  chapter: string;
  hadith_number: number;
  narrator_chain: string;
  text_arabic: string;
  text_english?: string;
  category: string;
  reliability_score: number;
}

// Data Processing Functions
export class DataProcessor {
  private quranData: QuranVerse[] = [];
  private hadithData: HadithEntry[] = [];
  private miracles: QuranicMiracle[] = [];

  // Load and parse Quran data
  async loadQuranData(csvContent: string): Promise<QuranVerse[]> {
    const lines = csvContent.split("\n");

    this.quranData = lines
      .slice(1)
      .map((line) => {
        const values = this.parseCSVLine(line);
        return {
          surah_no: parseInt(values[0]),
          surah_name_en: values[1],
          surah_name_ar: values[2],
          ayah_no_surah: parseInt(values[4]),
          ayah_no_quran: parseInt(values[5]),
          ayah_ar: values[6],
          ayah_en: values[7],
          place_of_revelation: values[14],
          no_of_word_ayah: parseInt(values[17]) || 0,
          list_of_words: this.parseWordList(values[18]),
        };
      })
      .filter((verse) => verse.surah_no > 0);

    return this.quranData;
  }

  // Load and parse Hadith data
  async loadHadithData(textContent: string): Promise<HadithEntry[]> {
    const hadiths: HadithEntry[] = [];
    const sections = textContent.split(
      /(?=قَالَ الشَّيْخُ|ـ حَدَّثَنَا|ـ باب)/
    );

    let currentBook = "";
    let currentChapter = "";
    let hadithNumber = 1;

    sections.forEach((section) => {
      if (section.includes("كتاب")) {
        currentBook = this.extractBookName(section);
      } else if (section.includes("باب")) {
        currentChapter = this.extractChapterName(section);
      } else if (section.includes("حَدَّثَنَا")) {
        const hadith = this.parseHadith(
          section,
          currentBook,
          currentChapter,
          hadithNumber++
        );
        if (hadith) hadiths.push(hadith);
      }
    });

    this.hadithData = hadiths;
    return this.hadithData;
  }

  // Extract numerical miracles from Quran
  extractNumericalMiracles(): QuranicMiracle[] {
    const miracles: QuranicMiracle[] = [];

    // Word count patterns
    const wordCountPatterns = this.analyzeWordCounts();
    miracles.push(...wordCountPatterns);

    // Letter frequency patterns
    const letterPatterns = this.analyzeLetterFrequencies();
    miracles.push(...letterPatterns);

    // Structural patterns
    const structuralPatterns = this.analyzeStructuralPatterns();
    miracles.push(...structuralPatterns);

    this.miracles.push(...miracles);
    return miracles;
  }

  // Extract prophecies from Hadith
  extractProphecies(): QuranicMiracle[] {
    const prophecies: QuranicMiracle[] = [];

    // Keywords for prophecy detection
    const prophecyKeywords = [
      "آخِرُ الزَّمَانِ",
      "قَبْلَ السَّاعَةِ",
      "يَأْتِي زَمَانٌ",
      "سَيَكُونُ",
      "سَيَحْدُثُ",
      "سَتَرَوْنَ",
      "سَتَجِدُونَ",
    ];

    this.hadithData.forEach((hadith) => {
      const isProphecy = prophecyKeywords.some((keyword) =>
        hadith.text_arabic.includes(keyword)
      );

      if (isProphecy) {
        prophecies.push({
          type: "prophecy",
          title: `Prophecy from ${hadith.book} - ${hadith.chapter}`,
          notes: hadith.text_arabic,
          fulfillmentStatus: "pending",
          prophecyCategory: this.categorizeProphecy(hadith.text_arabic) as
            | "historical"
            | "scientific"
            | "social"
            | "natural"
            | "cosmological"
            | "technological",
          fulfillmentConfidence: "medium",
          academicSources: ["Sahih Bukhari"],
          source: hadith.narrator_chain,
        });
      }
    });

    this.miracles.push(...prophecies);
    return prophecies;
  }

  // Get statistics about the data
  getStatistics() {
    return {
      quran: {
        totalVerses: this.quranData.length,
        totalSurahs: new Set(this.quranData.map((v) => v.surah_no)).size,
        meccanVerses: this.quranData.filter(
          (v) => v.place_of_revelation === "Meccan"
        ).length,
        medinanVerses: this.quranData.filter(
          (v) => v.place_of_revelation === "Medinan"
        ).length,
        totalWords: this.quranData.reduce(
          (sum, v) => sum + v.no_of_word_ayah,
          0
        ),
      },
      hadith: {
        totalHadiths: this.hadithData.length,
        totalBooks: new Set(this.hadithData.map((h) => h.book)).size,
        totalChapters: new Set(this.hadithData.map((h) => h.chapter)).size,
        averageReliability:
          this.hadithData.reduce((sum, h) => sum + h.reliability_score, 0) /
          this.hadithData.length,
      },
      miracles: {
        total: this.miracles.length,
        byType: this.miracles.reduce((acc, m) => {
          acc[m.type] = (acc[m.type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
      },
    };
  }

  // Private helper methods
  private parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        result.push(current);
        current = "";
      } else {
        current += char;
      }
    }
    result.push(current);
    return result;
  }

  private parseWordList(wordListStr: string): string[] {
    try {
      // Remove brackets and split by comma
      const cleanStr = wordListStr.replace(/^\[|\]$/g, "");
      return cleanStr.split(",").map((word) => word.trim().replace(/"/g, ""));
    } catch {
      return [];
    }
  }

  private extractBookName(section: string): string {
    const match = section.match(/كتاب\s+(.+?)(?:\s|$)/);
    return match ? match[1].trim() : "Unknown Book";
  }

  private extractChapterName(section: string): string {
    const match = section.match(/باب\s+(.+?)(?:\s|$)/);
    return match ? match[1].trim() : "Unknown Chapter";
  }

  private parseHadith(
    section: string,
    book: string,
    chapter: string,
    number: number
  ): HadithEntry | null {
    const narratorMatch = section.match(/حَدَّثَنَا\s+(.+?)(?:\s+قَالَ|\s*$)/);
    const textMatch = section.match(/"([^"]+)"/);

    if (!narratorMatch || !textMatch) return null;

    return {
      book,
      chapter,
      hadith_number: number,
      narrator_chain: narratorMatch[1].trim(),
      text_arabic: textMatch[1],
      category: this.categorizeHadith(textMatch[1]),
      reliability_score: 0.95, // Sahih Bukhari is considered highly reliable
    };
  }

  private categorizeHadith(text: string): string {
    const categories = {
      aqeedah: ["إيمان", "توحيد", "الله", "رسول"],
      ibadah: ["صلاة", "صوم", "زكاة", "حج"],
      muamalat: ["بيع", "شراء", "قرض", "رهن"],
      akhlaq: ["أخلاق", "صبر", "صدق", "أمانة"],
      prophecy: ["آخِرُ الزَّمَانِ", "قَبْلَ السَّاعَةِ", "سَيَكُونُ"],
    };

    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some((keyword) => text.includes(keyword))) {
        return category;
      }
    }

    return "general";
  }

  private categorizeProphecy(text: string): string {
    const categories = {
      historical: ["فتح", "حرب", "دولة", "ملك"],
      scientific: ["علم", "طب", "فلك", "طبيعة"],
      social: ["مجتمع", "أخلاق", "عادات", "تقاليد"],
      natural: ["زلزال", "فيضان", "جفاف", "طقس"],
      cosmological: ["شمس", "قمر", "نجوم", "سماء"],
      technological: ["تقنية", "اختراع", "اكتشاف", "تطور"],
    };

    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some((keyword) => text.includes(keyword))) {
        return category;
      }
    }

    return "general";
  }

  private analyzeWordCounts(): QuranicMiracle[] {
    const miracles: QuranicMiracle[] = [];

    // Define word pairs to analyze
    const wordPairs = [
      ["حياة", "موت"],
      ["رجل", "امرأة"],
      ["جنة", "نار"],
      ["دنيا", "آخرة"],
      ["ملائكة", "شياطين"],
      ["خير", "شر"],
      ["نور", "ظلام"],
      ["هدى", "ضلال"],
      ["يوم", "ليل"],
      ["صبر", "جزع"],
    ];

    wordPairs.forEach(([word1, word2]) => {
      const count1 = this.countWordOccurrences(word1);
      const count2 = this.countWordOccurrences(word2);

      if (count1 > 0 && count2 > 0) {
        miracles.push({
          type: "pair",
          title: `${word1} & ${word2}`,
          pair: [word1, word2],
          [`${word1.toLowerCase()}Count`]: count1,
          [`${word2.toLowerCase()}Count`]: count2,
          notes: `Both words appear in the Quran: ${word1} (${count1} times), ${word2} (${count2} times)`,
          sources: {
            primary: "Quran Text Analysis",
            verification: "Digital Quran Database",
            methodology: "Computer-assisted word frequency analysis",
            references: ["https://quran.com/", "https://corpus.quran.com/"],
            academic: "Quranic Studies Research",
          },
        });
      }
    });

    return miracles;
  }

  private analyzeLetterFrequencies(): QuranicMiracle[] {
    const miracles: QuranicMiracle[] = [];

    // Analyze letter frequencies for patterns
    const letterCounts: Record<string, number> = {};

    this.quranData.forEach((verse) => {
      const arabicText = verse.ayah_ar;
      for (const char of arabicText) {
        if (/[\u0600-\u06FF]/.test(char)) {
          // Arabic Unicode range
          letterCounts[char] = (letterCounts[char] || 0) + 1;
        }
      }
    });

    // Look for multiples of 19 (significant number in Quran)
    Object.entries(letterCounts).forEach(([letter, count]) => {
      if (count % 19 === 0 && count > 19) {
        miracles.push({
          type: "numerical",
          title: `Letter ${letter} Frequency`,
          notes: `Letter ${letter} appears ${count} times (multiple of 19)`,
          pattern: `${count} = ${count / 19} × 19`,
          significance: "Mathematical pattern in Quranic text",
          source: "Letter frequency analysis",
        });
      }
    });

    return miracles;
  }

  private analyzeStructuralPatterns(): QuranicMiracle[] {
    const miracles: QuranicMiracle[] = [];

    // Analyze Meccan vs Medinan patterns
    const meccanVerses = this.quranData.filter(
      (v) => v.place_of_revelation === "Meccan"
    );
    const medinanVerses = this.quranData.filter(
      (v) => v.place_of_revelation === "Medinan"
    );

    if (meccanVerses.length > 0 && medinanVerses.length > 0) {
      const avgMeccanWords =
        meccanVerses.reduce((sum, v) => sum + v.no_of_word_ayah, 0) /
        meccanVerses.length;
      const avgMedinanWords =
        medinanVerses.reduce((sum, v) => sum + v.no_of_word_ayah, 0) /
        medinanVerses.length;

      miracles.push({
        type: "structure",
        title: "Meccan vs Medinan Verse Structure",
        notes: `Average word count per verse: Meccan (${avgMeccanWords.toFixed(
          1
        )}), Medinan (${avgMedinanWords.toFixed(1)})`,
        pattern: "Structural difference between revelation periods",
        significance: "Shows evolution of Quranic style and content",
        source: "Structural analysis of Quranic text",
      });
    }

    return miracles;
  }

  private countWordOccurrences(word: string): number {
    let count = 0;
    this.quranData.forEach((verse) => {
      const arabicText = verse.ayah_ar;
      const regex = new RegExp(word, "g");
      const matches = arabicText.match(regex);
      if (matches) {
        count += matches.length;
      }
    });
    return count;
  }

  // Get all processed data
  getAllData() {
    return {
      quranData: this.quranData,
      hadithData: this.hadithData,
      miracles: this.miracles,
    };
  }
}
