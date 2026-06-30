import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

// Use the same-origin /api path by default so the app works in local Vite dev,
// Netlify proxy deployments, and any reverse-proxy hosting without a hardcoded backend URL.
const BASE_URL = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include", // Essential for forwarding authentication cookies
  }),
  tagTypes: ["Product", "Order", "User", "Category", "Cart", "Favorites"],
  endpoints: () => ({}),
});
