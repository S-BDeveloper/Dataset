import { DataProcessor } from "./dataProcessor";
import type { QuranicMiracle } from "../types/Types";

// Enhanced miracle data with additional fields from new datasets
export interface EnrichedMiracle extends QuranicMiracle {
  // Additional fields from Quran analysis
  quranicContext?: {
    surah: string;
    ayah: number;
    revelationPlace: string;
    wordCount: number;
    relatedVerses: string[];
  };

  // Additional fields from Hadith analysis
  hadithContext?: {
    book: string;
    chapter: string;
    narratorChain: string;
    reliabilityScore: number;
    relatedHadiths: string[];
  };

  // Cross-referencing data
  crossReferences?: {
    quranVerses: string[];
    hadithReferences: string[];
    academicSources: string[];
    historicalContext: string;
  };

  // Enhanced categorization
  enhancedCategories?: {
    primary: string;
    secondary: string[];
    themes: string[];
    keywords: string[];
  };
}

export class DataEnrichment {
  private processor: DataProcessor;
  private enrichedMiracles: EnrichedMiracle[] = [];

  constructor() {
    this.processor = new DataProcessor();
  }

  // Main enrichment process
  async enrichData(): Promise<EnrichedMiracle[]> {
    try {
      console.log("Starting data enrichment process...");

      // Step 1: Load and process Quran data
      await this.loadQuranData();

      // Step 2: Load and process Hadith data
      await this.loadHadithData();

      // Step 3: Extract miracles and prophecies
      const numericalMiracles = this.processor.extractNumericalMiracles();
      const prophecies = this.processor.extractProphecies();

      // Step 4: Enrich existing miracles with new data
      await this.enrichExistingMiracles();

      // Step 5: Create new enriched miracles
      const newEnrichedMiracles = this.createEnrichedMiracles([
        ...numericalMiracles,
        ...prophecies,
      ]);

      // Step 6: Cross-reference and validate
      this.crossReferenceData(newEnrichedMiracles);

      // Step 7: Apply advanced categorization
      this.applyAdvancedCategorization(newEnrichedMiracles);

      this.enrichedMiracles = newEnrichedMiracles;

      console.log(
        `Data enrichment completed. ${this.enrichedMiracles.length} enriched miracles created.`
      );

      return this.enrichedMiracles;
    } catch (error) {
      console.error("Error during data enrichment:", error);
      throw error;
    }
  }

  // Load Quran data with error handling
  private async loadQuranData(): Promise<void> {
    try {
      const response = await fetch("/src/data/The Quran Dataset.csv");
      if (!response.ok) {
        throw new Error(`Failed to load Quran dataset: ${response.statusText}`);
      }

      const csvContent = await response.text();
      await this.processor.loadQuranData(csvContent);
      console.log("Quran data loaded successfully");
    } catch (error) {
      console.error("Error loading Quran data:", error);
      throw error;
    }
  }

  // Load Hadith data with error handling
  private async loadHadithData(): Promise<void> {
    try {
      const response = await fetch("/src/data/Sahih Bukhari Full Text.txt");
      if (!response.ok) {
        throw new Error(
          `Failed to load Hadith dataset: ${response.statusText}`
        );
      }

      const textContent = await response.text();
      await this.processor.loadHadithData(textContent);
      console.log("Hadith data loaded successfully");
    } catch (error) {
      console.error("Error loading Hadith data:", error);
      throw error;
    }
  }

  // Enrich existing miracles with new context
  private async enrichExistingMiracles(): Promise<void> {
    try {
      // Load existing miracles
      const response = await fetch("/src/data/quranic_miracles.json");
      if (!response.ok) {
        console.warn(
          "Could not load existing miracles, proceeding with new data only"
        );
        return;
      }

      const existingMiracles: QuranicMiracle[] = await response.json();

      // Enrich each existing miracle
      const enriched = existingMiracles.map((miracle) =>
        this.enrichSingleMiracle(miracle)
      );

      this.enrichedMiracles.push(...enriched);
      console.log(`Enriched ${enriched.length} existing miracles`);
    } catch (error) {
      console.warn("Error enriching existing miracles:", error);
    }
  }

  // Enrich a single miracle with additional context
  private enrichSingleMiracle(miracle: QuranicMiracle): EnrichedMiracle {
    const enriched: EnrichedMiracle = {
      ...miracle,
      enhancedCategories: {
        primary: miracle.type,
        secondary: this.getSecondaryCategories(miracle),
        themes: this.extractThemes(miracle),
        keywords: this.extractKeywords(miracle),
      },
    };

    // Add Quranic context for relevant miracles
    if (miracle.type === "pair" || miracle.type === "numerical") {
      enriched.quranicContext = this.findQuranicContext(miracle);
    }

    // Add Hadith context for prophecies
    if (miracle.type === "prophecy") {
      enriched.hadithContext = this.findHadithContext(miracle);
    }

    return enriched;
  }

  // Create enriched miracles from new data
  private createEnrichedMiracles(
    miracles: QuranicMiracle[]
  ): EnrichedMiracle[] {
    return miracles.map((miracle) => {
      const enriched: EnrichedMiracle = {
        ...miracle,
        enhancedCategories: {
          primary: miracle.type,
          secondary: this.getSecondaryCategories(miracle),
          themes: this.extractThemes(miracle),
          keywords: this.extractKeywords(miracle),
        },
      };

      // Add appropriate context based on miracle type
      if (miracle.type === "pair" || miracle.type === "numerical") {
        enriched.quranicContext = this.findQuranicContext(miracle);
      }

      if (miracle.type === "prophecy") {
        enriched.hadithContext = this.findHadithContext(miracle);
      }

      return enriched;
    });
  }

  // Find Quranic context for a miracle
  private findQuranicContext(
    miracle: QuranicMiracle
  ): EnrichedMiracle["quranicContext"] {
    const allData = this.processor.getAllData();
    const quranData = allData.quranData;

    // Find verses that contain the miracle's keywords
    const keywords = this.extractKeywords(miracle);
    const relatedVerses = quranData
      .filter((verse) =>
        keywords.some(
          (keyword) =>
            verse.ayah_ar.includes(keyword) ||
            verse.ayah_en.toLowerCase().includes(keyword.toLowerCase())
        )
      )
      .slice(0, 5); // Limit to 5 most relevant verses

    if (relatedVerses.length > 0) {
      return {
        surah: relatedVerses[0].surah_name_en,
        ayah: relatedVerses[0].ayah_no_surah,
        revelationPlace: relatedVerses[0].place_of_revelation,
        wordCount: relatedVerses[0].no_of_word_ayah,
        relatedVerses: relatedVerses.map(
          (v) => `${v.surah_name_en} ${v.ayah_no_surah}`
        ),
      };
    }

    return undefined;
  }

  // Find Hadith context for a prophecy
  private findHadithContext(
    miracle: QuranicMiracle
  ): EnrichedMiracle["hadithContext"] {
    const allData = this.processor.getAllData();
    const hadithData = allData.hadithData;

    // Find Hadiths that contain the prophecy's keywords
    const keywords = this.extractKeywords(miracle);
    const relatedHadiths = hadithData
      .filter((hadith) =>
        keywords.some(
          (keyword) =>
            hadith.text_arabic.includes(keyword) ||
            (hadith.text_english &&
              hadith.text_english.toLowerCase().includes(keyword.toLowerCase()))
        )
      )
      .slice(0, 3); // Limit to 3 most relevant Hadiths

    if (relatedHadiths.length > 0) {
      return {
        book: relatedHadiths[0].book,
        chapter: relatedHadiths[0].chapter,
        narratorChain: relatedHadiths[0].narrator_chain,
        reliabilityScore: relatedHadiths[0].reliability_score,
        relatedHadiths: relatedHadiths.map((h) => `${h.book} - ${h.chapter}`),
      };
    }

    return undefined;
  }

  // Extract secondary categories
  private getSecondaryCategories(miracle: QuranicMiracle): string[] {
    const categories = [];

    if (miracle.prophecyCategory) {
      categories.push(miracle.prophecyCategory);
    }

    if (miracle.fulfillmentStatus) {
      categories.push(miracle.fulfillmentStatus);
    }

    if (miracle.type === "pair") {
      categories.push("linguistic", "mathematical");
    }

    if (miracle.type === "numerical") {
      categories.push("mathematical", "pattern");
    }

    return categories;
  }

  // Extract themes from miracle
  private extractThemes(miracle: QuranicMiracle): string[] {
    const themes = [];

    // Extract themes from title and notes
    const text = `${miracle.title} ${miracle.notes || ""}`.toLowerCase();

    if (text.includes("life") || text.includes("death"))
      themes.push("existence");
    if (text.includes("heaven") || text.includes("hell"))
      themes.push("afterlife");
    if (text.includes("man") || text.includes("woman")) themes.push("humanity");
    if (text.includes("world") || text.includes("hereafter"))
      themes.push("cosmology");
    if (text.includes("angels") || text.includes("devils"))
      themes.push("spiritual");
    if (text.includes("good") || text.includes("evil")) themes.push("morality");
    if (text.includes("light") || text.includes("darkness"))
      themes.push("duality");
    if (text.includes("guidance") || text.includes("misguidance"))
      themes.push("guidance");

    return themes;
  }

  // Extract keywords from miracle
  private extractKeywords(miracle: QuranicMiracle): string[] {
    const keywords = [];

    // Extract from title
    const titleWords = miracle.title.toLowerCase().split(/\s+/);
    keywords.push(...titleWords.filter((word) => word.length > 3));

    // Extract from notes
    if (miracle.notes) {
      const noteWords = miracle.notes.toLowerCase().split(/\s+/);
      keywords.push(...noteWords.filter((word) => word.length > 3));
    }

    // Extract from pair words
    if (miracle.pair) {
      keywords.push(...miracle.pair.map((word) => word.toLowerCase()));
    }

    // Remove duplicates and common words
    const commonWords = [
      "the",
      "and",
      "or",
      "but",
      "in",
      "on",
      "at",
      "to",
      "for",
      "of",
      "with",
      "by",
    ];
    return [...new Set(keywords)].filter((word) => !commonWords.includes(word));
  }

  // Cross-reference data between Quran and Hadith
  private crossReferenceData(miracles: EnrichedMiracle[]): void {
    miracles.forEach((miracle) => {
      const crossRefs: EnrichedMiracle["crossReferences"] = {
        quranVerses: [],
        hadithReferences: [],
        academicSources: miracle.academicSources || [],
        historicalContext: this.findHistoricalContext(miracle),
      };

      // Find related Quran verses
      if (miracle.quranicContext) {
        crossRefs.quranVerses = miracle.quranicContext.relatedVerses;
      }

      // Find related Hadiths
      if (miracle.hadithContext) {
        crossRefs.hadithReferences = miracle.hadithContext.relatedHadiths;
      }

      miracle.crossReferences = crossRefs;
    });
  }

  // Find historical context
  private findHistoricalContext(miracle: EnrichedMiracle): string {
    if (miracle.yearRevealed) {
      return `Revealed in ${miracle.yearRevealed} CE`;
    }

    if (miracle.fulfillmentStatus === "fulfilled" && miracle.yearFulfilled) {
      return `Fulfilled in ${miracle.yearFulfilled} CE`;
    }

    return "Historical context to be determined";
  }

  // Apply advanced categorization
  private applyAdvancedCategorization(miracles: EnrichedMiracle[]): void {
    miracles.forEach((miracle) => {
      if (!miracle.enhancedCategories) {
        miracle.enhancedCategories = {
          primary: miracle.type,
          secondary: [],
          themes: [],
          keywords: [],
        };
      }

      // Add complexity level
      miracle.enhancedCategories.secondary.push(
        this.getComplexityLevel(miracle)
      );

      // Add significance level
      miracle.enhancedCategories.secondary.push(
        this.getSignificanceLevel(miracle)
      );
    });
  }

  // Determine complexity level
  private getComplexityLevel(miracle: EnrichedMiracle): string {
    if (miracle.type === "numerical" && miracle.pattern?.includes("19")) {
      return "high-complexity";
    }

    if (
      miracle.type === "prophecy" &&
      miracle.fulfillmentStatus === "fulfilled"
    ) {
      return "verified";
    }

    if (miracle.type === "pair") {
      return "medium-complexity";
    }

    return "standard";
  }

  // Determine significance level
  private getSignificanceLevel(miracle: EnrichedMiracle): string {
    if (miracle.fulfillmentConfidence === "high") {
      return "high-significance";
    }

    if (miracle.type === "prophecy") {
      return "prophetic-significance";
    }

    if (miracle.type === "numerical") {
      return "mathematical-significance";
    }

    return "standard-significance";
  }

  // Get enrichment statistics
  getEnrichmentStatistics() {
    const stats = {
      totalEnriched: this.enrichedMiracles.length,
      withQuranicContext: this.enrichedMiracles.filter((m) => m.quranicContext)
        .length,
      withHadithContext: this.enrichedMiracles.filter((m) => m.hadithContext)
        .length,
      withCrossReferences: this.enrichedMiracles.filter(
        (m) => m.crossReferences
      ).length,
      enhancedCategories: this.enrichedMiracles.filter(
        (m) => m.enhancedCategories
      ).length,
      byType: this.enrichedMiracles.reduce((acc, m) => {
        acc[m.type] = (acc[m.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };

    return stats;
  }

  // Export enriched data
  exportEnrichedData(): string {
    return JSON.stringify(this.enrichedMiracles, null, 2);
  }

  // Get enriched miracles
  getEnrichedMiracles(): EnrichedMiracle[] {
    return this.enrichedMiracles;
  }
}
