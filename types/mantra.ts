export const CATEGORIES = [
  "Kaharwa Tal",
  "Daspahira Tal",
  "Dadra Tal",
  "Hastasadhana",
  "Hatuti",
  "Khemta Tal",
  "Tin Tal",
  "Short Tehais",
  "Long Tehais",
  "32 Tehais",
] as const;

export type Category = (typeof CATEGORIES)[number];

/** Extend this list to add new bols. */
export const STROKE_NAMES = ["Dha", "Ghi", "Te", "Ta", "Nak", "Khi", "Dhei"] as const;
export type StrokeName = (typeof STROKE_NAMES)[number];

/** Temporary placeholder symbols — not an authoritative notation system. */
export const NOTATION_SYMBOLS = ["×", "○", "●", "—"] as const;

/**
 * A notation value. Today only text symbols are used; `image` is reserved so
 * image-based notation can be added later without touching the UI tables.
 */
export type Notation = string;

export interface Stroke {
  id: string;
  name: StrokeName;
  largeHeadNotation: Notation;
  smallHeadNotation: Notation;
}

export interface Mantra {
  id: string;
  name: string;
  category: Category;
  author: string;
  description: string;
  strokes: Stroke[];
}

export const uid = () => Math.random().toString(36).slice(2, 10);

/** Placeholder defaults when a stroke name is picked. */
export const DEFAULT_NOTATION: Record<StrokeName, { large: string; small: string }> = {
  Dha: { large: "●", small: "○" },
  Ghi: { large: "", small: "○" },
  Te: { large: "×", small: "" },
  Ta: { large: "●", small: "" },
  Nak: { large: "×", small: "" },
  Khi: { large: "×", small: "" },
  Dhei: { large: "●", small: "●" },
};
