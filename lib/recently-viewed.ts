export const RECENTLY_VIEWED_STORAGE_KEY = "auracare_recently_viewed";
const MAX_RECENTLY_VIEWED = 8;

export interface RecentlyViewedEntry {
  slug: string;
  viewedAt: string;
  viewCount: number;
}

function isRecentlyViewedEntry(value: unknown): value is RecentlyViewedEntry {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.slug === "string" &&
    typeof candidate.viewedAt === "string" &&
    typeof candidate.viewCount === "number"
  );
}

function normalizeRecentlyViewedEntries(items: RecentlyViewedEntry[]) {
  return items
    .filter((item) => item.slug)
    .sort((first, second) => Date.parse(second.viewedAt) - Date.parse(first.viewedAt))
    .slice(0, MAX_RECENTLY_VIEWED);
}

export function loadRecentlyViewed() {
  return loadRecentlyViewedEntries().map((item) => item.slug);
}

export function loadRecentlyViewedEntries() {
  if (typeof window === "undefined") return [] as RecentlyViewedEntry[];

  try {
    const raw = window.localStorage.getItem(RECENTLY_VIEWED_STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];

    if (!Array.isArray(parsed)) {
      return [];
    }

    if (parsed.every((item) => typeof item === "string")) {
      const fallbackTimestamp = new Date().toISOString();
      return normalizeRecentlyViewedEntries(
        parsed.map((slug, index) => ({
          slug,
          viewedAt: new Date(Date.now() - index * 60_000).toISOString() || fallbackTimestamp,
          viewCount: 1,
        }))
      );
    }

    return normalizeRecentlyViewedEntries(parsed.filter(isRecentlyViewedEntry));
  } catch {
    return [];
  }
}

export function saveRecentlyViewed(items: string[]) {
  const now = new Date().toISOString();
  saveRecentlyViewedEntries(
    items.map((slug, index) => ({
      slug,
      viewedAt: new Date(Date.now() - index * 60_000).toISOString() || now,
      viewCount: 1,
    }))
  );
}

export function saveRecentlyViewedEntries(items: RecentlyViewedEntry[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    RECENTLY_VIEWED_STORAGE_KEY,
    JSON.stringify(normalizeRecentlyViewedEntries(items))
  );
}

export function pushRecentlyViewed(productSlug: string) {
  const current = loadRecentlyViewedEntries();
  const existing = current.find((item) => item.slug === productSlug);
  const next = [
    {
      slug: productSlug,
      viewedAt: new Date().toISOString(),
      viewCount: existing ? existing.viewCount + 1 : 1,
    },
    ...current.filter((item) => item.slug !== productSlug),
  ];

  saveRecentlyViewedEntries(next);
}
