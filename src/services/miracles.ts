// Service layer for miracle data operations
import type { QuranicMiracle } from "../types/Types";
import quranicMiraclesData from "../data/quranic_miracles.json";

export class MiraclesService {
  private static instance: MiraclesService;
  private cache: QuranicMiracle[] | null = null;

  private constructor() {}

  static getInstance(): MiraclesService {
    if (!MiraclesService.instance) {
      MiraclesService.instance = new MiraclesService();
    }
    return MiraclesService.instance;
  }

  async getMiracles(): Promise<QuranicMiracle[]> {
    if (this.cache) {
      return this.cache;
    }

    try {
      const miracles = quranicMiraclesData as QuranicMiracle[];
      this.cache = miracles;
      return miracles;
    } catch {
      throw new Error("Failed to load miracles data");
    }
  }

  async getMiraclesByType(type: string): Promise<QuranicMiracle[]> {
    const miracles = await this.getMiracles();
    return miracles.filter((miracle) => miracle.type === type);
  }

  async searchMiracles(query: string): Promise<QuranicMiracle[]> {
    const miracles = await this.getMiracles();
    const searchTerm = query.toLowerCase();

    return miracles.filter(
      (miracle) =>
        miracle.title?.toLowerCase().includes(searchTerm) ||
        miracle.description?.toLowerCase().includes(searchTerm) ||
        miracle.notes?.toLowerCase().includes(searchTerm)
    );
  }

  async getMiracleTypes(): Promise<string[]> {
    const miracles = await this.getMiracles();
    return [...new Set(miracles.map((m) => m.type).filter(Boolean))];
  }

  clearCache(): void {
    this.cache = null;
  }
}

// Export singleton instance
export const miraclesService = MiraclesService.getInstance();
