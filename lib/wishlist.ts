export const WISHLIST_STORAGE_KEY = "auracare_wishlist";

export function loadWishlist() {
  if (typeof window === "undefined") return [] as string[];

  try {
    const raw = window.localStorage.getItem(WISHLIST_STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as string[]) : [];
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export function saveWishlist(items: string[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
}
