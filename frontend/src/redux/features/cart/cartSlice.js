import { createSlice } from "@reduxjs/toolkit";

const CART_STORAGE_KEY = "stylehub_cart_items";

const loadCartItems = () => {
  if (typeof window === "undefined") return [];

  try {
    const stored = window.localStorage.getItem(CART_STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const persistCartItems = (cartItems) => {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  } catch {
    // ignore storage errors
  }
};

const clampQtyToStock = (qty, stock = 0) => {
  const parsedQty = Number(qty ?? 1);

  if (!Number.isFinite(parsedQty)) {
    return 1;
  }

  const lowerBoundedQty = Math.max(1, parsedQty);
  return stock > 0 ? Math.min(lowerBoundedQty, stock) : lowerBoundedQty;
};

export const getCartItemId = (item = {}, fallbackId = null) => {
  const productId = item?.product?._id || item?._id || item?.productId || fallbackId;
  return productId || null;
};

export const normalizeCartItem = (item, fallbackId = null) => {
  const productId = getCartItemId(item, fallbackId);
  const product = item?.product || {};
  const stock = Number(item?.countInStock ?? product?.countInStock ?? item?.product?.countInStock ?? 0);
  const normalized = {
    ...item,
    ...product,
    qty: clampQtyToStock(item?.qty || 1, stock),
  };

  if (productId) {
    normalized._id = productId;
    normalized.product = productId ? { ...product, _id: productId } : product;
  }

  if (stock > 0) {
    normalized.countInStock = stock;
  }

  return normalized;
};

export const normalizeCartItems = (items = []) => {
  if (!Array.isArray(items)) return [];

  return items.map((item) => normalizeCartItem(item, getCartItemId(item)));
};

export const mergeCartItems = (localItems = [], backendItems = []) => {
  const merged = new Map();

  const addItem = (item) => {
    const productId = getCartItemId(item);
    if (!productId) return;

    const normalized = normalizeCartItem(item, productId);
    const existing = merged.get(productId);

    if (existing) {
      existing.qty = Math.max(Number(existing.qty || 1), Number(normalized.qty || 1));
      if (!existing.countInStock && normalized.countInStock) {
        existing.countInStock = normalized.countInStock;
      }
      if (!existing.name && normalized.name) {
        existing.name = normalized.name;
      }
      if (!existing.price && normalized.price) {
        existing.price = normalized.price;
      }
      if (!existing.image && normalized.image) {
        existing.image = normalized.image;
      }
      if (!existing.product || !existing.product._id) {
        existing.product = normalized.product;
      }
    } else {
      merged.set(productId, normalized);
    }
  };

  localItems.forEach(addItem);
  backendItems.forEach(addItem);

  return Array.from(merged.values());
};

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: loadCartItems(),
    loading: false,
    error: null,
  },
  reducers: {
    setCartItems: (state, action) => {
      state.cartItems = Array.isArray(action.payload)
        ? normalizeCartItems(action.payload)
        : [];
      state.error = null;
      persistCartItems(state.cartItems);
    },
    addToCartLocal: (state, action) => {
      const item = normalizeCartItem(action.payload);
      const productId = item._id;
      if (!productId) return;

      const existing = state.cartItems.find(
        (x) => getCartItemId(x) === productId
      );

      if (existing) {
        const stock = Number(existing.countInStock ?? existing.product?.countInStock ?? 0);
        existing.qty = clampQtyToStock(Number(existing.qty || 1) + Number(item.qty || 1), stock);
      } else {
        state.cartItems.push(item);
      }

      persistCartItems(state.cartItems);
    },
    removeFromCartLocal: (state, action) => {
      const productId = action.payload;
      state.cartItems = state.cartItems.filter(
        (x) => getCartItemId(x) !== productId
      );
      persistCartItems(state.cartItems);
    },
    updateQtyLocal: (state, action) => {
      const { id, qty } = action.payload;
      const item = state.cartItems.find((x) => getCartItemId(x) === id);
      if (item) {
        const stock = Number(item.countInStock ?? item.product?.countInStock ?? 0);
        item.qty = clampQtyToStock(qty, stock);
      }
      persistCartItems(state.cartItems);
    },
    clearCartLocal: (state) => {
      state.cartItems = [];
      persistCartItems(state.cartItems);
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
  setCartItems,
  addToCartLocal,
  removeFromCartLocal,
  updateQtyLocal,
  clearCartLocal,
  setLoading,
  setError,
} = cartSlice.actions;

export const addToCart = addToCartLocal;
export const removeFromCart = removeFromCartLocal;
export const updateQty = updateQtyLocal;
export const clearCart = clearCartLocal;

export default cartSlice.reducer;