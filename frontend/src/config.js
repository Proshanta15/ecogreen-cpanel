// config.js
// Use Vite env override (VITE_API_BASE_URL) when set, otherwise fall back to
// the backend origin. In production the frontend is served by the backend
// itself, so window.location.origin works there.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  || (import.meta.env.DEV ? 'http://localhost:3000/api' : window.location.origin + '/api');

// Media (uploaded images) are served from the backend root at /uploads,
// NOT under /api. Derive the media base from the API base by stripping /api.
// ✅ FIXED: Ensure we're removing /api correctly
export const MEDIA_BASE_URL = API_BASE_URL.replace(/\/api$/, '') || window.location.origin;

// Resolve an image path to an absolute, same-origin URL.
// Handles three cases:
//  - already-absolute external URL (https://...)      -> used as-is
//  - absolute URL containing a stale origin (http://localhost:3000/...)
//    or any http(s):// prefix                          -> origin stripped so it
//    resolves against the current (HTTPS) page origin (fixes Mixed Content)
//  - relative path (uploads/... or /uploads/...)       -> prefixed with the
//    current media base origin
export function resolveMediaUrl(img) {
  if (!img) return img;
  if (img.startsWith("//")) return window.location.protocol + img;
  if (img.startsWith("http")) {
    try {
      const u = new URL(img);
      return u.pathname.replace(/^\/+/, "");
    } catch {
      return img.replace(/^https?:\/\/[^/]+/, "");
    }
  }
  return `${MEDIA_BASE_URL}/${img.replace(/\\/g, "/").replace(/^\/+/, "")}`;
}

// Alternative: More explicit version
// export const MEDIA_BASE_URL = import.meta.env.DEV 
//   ? 'http://localhost:3000' 
//   : window.location.origin;