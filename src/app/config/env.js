const sanitizeUrl = (value) => {
  if (!value) return "";
  return value.endsWith("/") ? value.slice(0, -1) : value;
};

export const API_BASE_URL = sanitizeUrl(import.meta.env.VITE_API_URL || "");
const browserOrigin = window.location.origin;
export const PUBLIC_APP_URL = sanitizeUrl(
  import.meta.env.VITE_PUBLIC_APP_URL || browserOrigin
);
export const PUSHER_KEY = import.meta.env.VITE_PUSHER_KEY || "";
export const PUSHER_CLUSTER = import.meta.env.VITE_PUSHER_CLUSTER || "mt1";
