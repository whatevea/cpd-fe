import { API_BASE_URL } from "@/app/config/env";

const buildUrl = (path = "") => {
  if (!path) {
    return API_BASE_URL || "/";
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  if (!API_BASE_URL) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};

export const apiUrl = (path) => buildUrl(path);

export const apiFetch = (path, options = {}) => {
  const url = buildUrl(path);
  return fetch(url, options);
};

export const redirectToApi = (path) => {
  const target = buildUrl(path);
  window.location.href = target;
};
