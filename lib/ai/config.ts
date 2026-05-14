export function isPlaceholderEnv(value: string | undefined) {
  if (!value) return true;

  const normalized = value.toLowerCase();
  return (
    normalized.includes("your_") ||
    normalized.includes("placeholder") ||
    normalized.includes("example") ||
    normalized.includes("supabase.co") && normalized.includes("your-")
  );
}

export function getGoogleApiKey() {
  const key = process.env.GOOGLE_API_KEY;
  return isPlaceholderEnv(key) ? null : key;
}

export function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (isPlaceholderEnv(url) || isPlaceholderEnv(anonKey)) {
    return null;
  }

  return { url: url!, anonKey: anonKey! };
}
