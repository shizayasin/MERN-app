import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

const BASE_URL = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");

const prepareHeaders = (headers, { getState }) => {
  const token = getState().auth?.userInfo?.token;
  headers.set("Accept", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return headers;
};

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include", // Essential for forwarding authentication cookies
    prepareHeaders,
  }),
  tagTypes: ["Product", "Order", "User", "Category", "Cart", "Favorites"],
  endpoints: () => ({}),
});
