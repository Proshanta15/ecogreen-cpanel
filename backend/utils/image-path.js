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

// Recursively walk an object/array and normalize known image/logo/media
// path fields so the API never returns an absolute (http://localhost) URL.
// This fixes Mixed Content errors even for clients running an older build.
const IMAGE_FIELDS = [
  "image", "logo", "video", "bannerImage", "heroImage",
  "aboutImage", "visionImage", "missionImage", "ctaImage",
];

function normalizeNode(node) {
  if (Array.isArray(node)) {
    return node.map(normalizeNode);
  }
  if (node && typeof node === "object") {
    const out = {};
    for (const [k, v] of Object.entries(node)) {
      if (IMAGE_FIELDS.includes(k) && typeof v === "string") {
        out[k] = normalizeImagePath(v);
      } else if (v && typeof v === "object") {
        out[k] = normalizeNode(v);
      } else {
        out[k] = v;
      }
    }
    return out;
  }
  return node;
}

export function sanitizeMediaUrls(doc) {
  if (!doc) return doc;
  const obj = typeof doc.toObject === "function" ? doc.toObject() : doc;
  return normalizeNode(obj);
}
