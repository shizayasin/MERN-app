// frontend/src/constants.js

export const STORE_NAME = "StyleHub";
export const BASE_URL = ""; // Leave blank if relying on Vite proxy, or "http://localhost:5000"

export const PRODUCTS_URL = "/products";
export const CATEGORIES_URL = "/categories";
export const USERS_URL = "/users";
export const ORDERS_URL = "/orders";
export const UPLOAD_URL = "/upload";

export const formatPrice = (value) => `Rs. ${Number(value || 0).toLocaleString("en-PK")}`;

const getBackendOrigin = () => {
  const configuredUrl = import.meta.env?.VITE_API_URL || import.meta.env?.BACKEND_URL || "";
  if (!configuredUrl) return "";

  return configuredUrl.replace(/\/api\/?$/i, "");
};

export const getAssetUrl = (path) => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  if (/^data:image\//i.test(path)) return path;

  if (path.startsWith("/uploads/")) {
    const backendOrigin = getBackendOrigin();
    if (backendOrigin) return `${backendOrigin}${path}`;
    return path;
  }

  if (path.startsWith("/")) return `${BASE_URL}${path}`;
  return `${BASE_URL}/${path}`;
};