import type { TaxBand } from "../types/taxBand";

export const defaultBands: TaxBand[] = [
  { min: 0, max: 270000, percent: 0, addAmount: 0 },
  { min: 270000, max: 520000, percent: 8, addAmount: 0 },
  { min: 520000, max: 760000, percent: 20, addAmount: 20000 },
  { min: 760000, max: 1000000, percent: 25, addAmount: 68000 },
  { min: 1000000, max: 9999999999, percent: 30, addAmount: 128000 },
].map((band, index) => ({ category: index + 1, ...band }));