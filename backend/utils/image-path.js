// Normalize any image path into a storage-relative path.
// Strips a leading origin (e.g. http://localhost:3000 or https://site.com)
// and backslashes so only "uploads/..." is persisted. This prevents
// absolute/stale URLs (which cause Mixed Content errors) from being
// saved back into the database when an admin re-saves existing content.
export function normalizeImagePath(value) {
  if (typeof value !== "string" || !value) return value;
  let v = value.trim();
  // Strip an absolute origin like http://host or https://host
  v = v.replace(/^https?:\/\/[^/]+/i, "");
  // Normalize Windows backslashes and collapse leading slashes
  v = v.replace(/\\/g, "/").replace(/^\/+/, "");
  return v;
}
