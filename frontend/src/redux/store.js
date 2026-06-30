import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import cartReducer from "./features/cart/cartSlice";
import favoritesReducer from "./features/favorites/favoritesSlice";
import themeReducer from "./features/theme/themeSlice";
import noticeReducer from "./features/ui/noticeSlice";
import { apiSlice } from "./api/apiSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    favorites: favoritesReducer,
    theme: themeReducer,
    notice: noticeReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
});

export default store;