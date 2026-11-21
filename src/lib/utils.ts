export { cn } from "cn";

/** Convert empty strings to null for database storage */
export function emptyToNull(value: string | undefined): string | null {
  if (!value || value.trim() === "") return null;
  return value.trim();
}

/** Parse comma-separated string to array, filtering empty values */
export function parseInterests(value: string | undefined): string[] | null {
  if (!value || value.trim() === "") return null;
  const items = value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return items.length > 0 ? items : null;
}

/** Generate a consistent CSS class name from a string */
export function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}
