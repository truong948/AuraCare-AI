export const COMPARE_STORAGE_KEY = "auracare_compare";

export function loadCompare() {
  if (typeof window === "undefined") return [] as string[];

  try {
    const raw = window.localStorage.getItem(COMPARE_STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as string[]) : [];
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string").slice(0, 4) : [];
  } catch {
    return [];
  }
}

export function saveCompare(items: string[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(items.slice(0, 4)));
}
