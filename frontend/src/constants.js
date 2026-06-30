// frontend/src/constants.js

export const STORE_NAME = "StyleHub";
export const BASE_URL = ""; // Leave blank if relying on Vite proxy, or "http://localhost:5000"

export const PRODUCTS_URL = "/products";
export const CATEGORIES_URL = "/categories";
export const USERS_URL = "/users";
export const ORDERS_URL = "/orders";
export const UPLOAD_URL = "/upload";

export const getAssetUrl = (path) => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  if (path.startsWith("/")) return `${BASE_URL}${path}`;
  return `${BASE_URL}/${path}`;
};