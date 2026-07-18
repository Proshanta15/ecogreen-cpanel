// Centralized API configuration.
// Change API_BASE_URL here to switch between local and deployed environments.
// By default it auto-detects: uses localhost in dev, the deployed URL in production.

const LOCAL_API = "http://localhost:3000";
const PROD_API = "https://api.ecogreentex.eu.com";

const USE_LOCAL = true; // set true for local dev, false for production deploy

export const API_BASE = USE_LOCAL
  ? LOCAL_API
  : (import.meta.env?.DEV ? LOCAL_API : PROD_API);
