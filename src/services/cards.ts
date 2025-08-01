// Service layer for miracle data operations
import type { IslamicData } from "../types/Types";
import IslamicDataCards from "../data/islamic_data.json";

export class IslamicDataService {
  private static instance: IslamicDataService;
  private cache: IslamicData[] | null = null;

  private constructor() {}

  static getInstance(): IslamicDataService {
    if (!IslamicDataService.instance) {
      IslamicDataService.instance = new IslamicDataService();
    }
    return IslamicDataService.instance;
  }

  async getIslamicData(): Promise<IslamicData[]> {
    if (this.cache) {
      return this.cache;
    }

    try {
      const cards = IslamicDataCards as IslamicData[];
      this.cache = cards;
      return cards;
    } catch {
      throw new Error("Failed to load Islamic data");
    }
  }

  async getIslamicDataByType(type: string): Promise<IslamicData[]> {
    const cards = await this.getIslamicData();
    return cards.filter((cards) => cards.type === type);
  }

  async searchIslamicData(query: string): Promise<IslamicData[]> {
    const cards = await this.getIslamicData();
    const searchTerm = query.toLowerCase();

    return cards.filter(
      (cards) =>
        cards.title?.toLowerCase().includes(searchTerm) ||
        cards.description?.toLowerCase().includes(searchTerm) ||
        cards.notes?.toLowerCase().includes(searchTerm)
    );
  }

  async getIslamicDataTypes(): Promise<string[]> {
    const cards = await this.getIslamicData();
    return [...new Set(cards.map((m) => m.type).filter(Boolean))];
  }

  clearCache(): void {
    this.cache = null;
  }
}

// Export singleton instance
export const cards = IslamicDataService.getInstance();
