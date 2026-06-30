import { createSlice } from "@reduxjs/toolkit";

const FAVORITES_STORAGE_KEY = "stylehub_favorites_items";

const loadFavorites = () => {
  if (typeof window === "undefined") return [];

  try {
    const stored = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const persistFavorites = (favorites) => {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  } catch {
    // ignore storage errors
  }
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState: {
    favorites: loadFavorites(),
    loading: false,
    error: null,
  },
  reducers: {
    setFavorites: (state, action) => {
      state.favorites = Array.isArray(action.payload) ? action.payload : [];
      state.error = null;
      persistFavorites(state.favorites);
    },
    addToFavoritesLocal: (state, action) => {
      const product = action.payload;
      const id = product?._id;
      if (!id) return;

      const exists = state.favorites.some((item) => item._id === id);
      if (!exists) {
        state.favorites.push(product);
      }

      persistFavorites(state.favorites);
    },
    removeFromFavoritesLocal: (state, action) => {
      const id = action.payload;
      state.favorites = state.favorites.filter((item) => item._id !== id);
      persistFavorites(state.favorites);
    },
    clearFavoritesLocal: (state) => {
      state.favorites = [];
      persistFavorites(state.favorites);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setFavorites,
  addToFavoritesLocal,
  removeFromFavoritesLocal,
  clearFavoritesLocal,
  setLoading,
  setError,
} = favoritesSlice.actions;

export const addToFavorites = addToFavoritesLocal;
export const removeFromFavorites = removeFromFavoritesLocal;
export const clearFavorites = clearFavoritesLocal;

export default favoritesSlice.reducer;