import { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetCartQuery,
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useUpdateCartItemMutation,
  useClearCartMutation,
} from "../redux/api/userApiSlice";
import {
  setCartItems,
  addToCartLocal,
  removeFromCartLocal,
  updateQtyLocal,
  clearCartLocal,
  setLoading,
  setError,
  normalizeCartItems,
  mergeCartItems,
} from "../redux/features/cart/cartSlice";
import { showNotice } from "../redux/features/ui/noticeSlice";

const createCartSignature = (items = []) =>
  (Array.isArray(items) ? items : [])
    .map((item) => `${item?.product?._id || item?._id || ""}:${Number(item?.qty || 1)}`)
    .join("|");

const getItemStock = (item = {}) => Number(item?.countInStock ?? item?.product?.countInStock ?? 0);

const notifyCartToast = (type, message, toastId) => {
  if (!message) return;

  const id = toastId || `${type}:${message}`;
  if (type === "success") {
    toast.success(message, { toastId: id });
    return;
  }

  toast.error(message, { toastId: id });
};

export const useUserCart = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems, loading, error } = useSelector((state) => state.cart);
  const lastHydratedRef = useRef("");

  const { data: backendCart = [], isLoading: isCartLoading } =
    useGetCartQuery(userInfo?._id ?? null, { skip: !userInfo });
  const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();
  const [removeFromCart, { isLoading: isRemoving }] = useRemoveFromCartMutation();
  const [updateCartItem, { isLoading: isUpdating }] = useUpdateCartItemMutation();
  const [clearCart, { isLoading: isClearing }] = useClearCartMutation();

  useEffect(() => {
    if (!userInfo) {
      lastHydratedRef.current = "";
      dispatch(setError(null));
      return;
    }

    if (isCartLoading || !Array.isArray(backendCart)) {
      return;
    }

    const remoteSignature = createCartSignature(backendCart);
    const hydrationKey = `${userInfo?._id || "guest"}:${remoteSignature}`;

    if (lastHydratedRef.current === hydrationKey) {
      return;
    }

    const normalizedRemoteCart = normalizeCartItems(backendCart);

    const nextItems =
      Array.isArray(cartItems) && cartItems.length > 0 && normalizedRemoteCart.length > 0
        ? mergeCartItems(cartItems, normalizedRemoteCart)
        : normalizedRemoteCart;

    if (createCartSignature(cartItems) === createCartSignature(nextItems)) {
      lastHydratedRef.current = hydrationKey;
      return;
    }

    lastHydratedRef.current = hydrationKey;
    dispatch(setCartItems(nextItems));
  }, [backendCart, cartItems, dispatch, isCartLoading, userInfo]);

  const handleAddToCart = useCallback(
    async (product, qty = 1) => {
      const resolvedProduct = typeof product === "object" && product !== null ? product : null;
      const productId = resolvedProduct?._id || resolvedProduct?.product?._id || product;
      const existingItem = Array.isArray(cartItems)
        ? cartItems.find((item) => (item?.product?._id || item?._id) === productId)
        : null;
      const stock = Number(
        resolvedProduct?.countInStock ??
          resolvedProduct?.product?.countInStock ??
          existingItem?.countInStock ??
          existingItem?.product?.countInStock ??
          0
      );
      const requestedQty = Number(qty || 1);
      const nextQty = (existingItem?.qty || 0) + requestedQty;

      if (!productId) {
        const message = "Invalid product data";
        dispatch(setError(message));
        toast.error(message);
        return false;
      }

      if (stock > 0 && nextQty > stock) {
        const message = `Only ${stock} item${stock === 1 ? "" : "s"} available in stock`;
        dispatch(setError(message));
        notifyCartToast("error", message, `stock:${productId}`);
        return false;
      }

      if (!userInfo) {
        dispatch(addToCartLocal({ product: resolvedProduct?.product || resolvedProduct || product, _id: productId, qty: requestedQty }));
        dispatch(showNotice({ message: "Product added to cart", type: "success" }));
        notifyCartToast("success", "Product added to cart", `add:${productId}`);
        return true;
      }

      try {
        dispatch(setLoading(true));
        const response = await addToCart({ productId, qty: requestedQty }).unwrap();
        dispatch(setCartItems(normalizeCartItems(response)));
        dispatch(showNotice({ message: "Cart updated successfully", type: "success" }));
        notifyCartToast("success", existingItem ? "Cart updated successfully" : "Product added to cart", `add:${productId}`);
        return true;
      } catch (err) {
        const message = err?.data?.message || "Failed to add to cart";
        dispatch(setError(message));
        toast.error(message);
        return false;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [addToCart, cartItems, dispatch, userInfo]
  );

  const handleRemoveFromCart = useCallback(
    async (productId) => {
      if (!userInfo) {
        dispatch(removeFromCartLocal(productId));
        dispatch(showNotice({ message: "Removed from cart.", type: "info" }));
        toast.success("Removed from cart");
        return true;
      }

      try {
        dispatch(setLoading(true));
        const response = await removeFromCart({ productId }).unwrap();
        dispatch(setCartItems(normalizeCartItems(response)));
        dispatch(showNotice({ message: "Removed from cart.", type: "info" }));
        toast.success("Removed from cart");
        return true;
      } catch (err) {
        const message = err?.data?.message || "Failed to remove from cart";
        dispatch(setError(message));
        toast.error(message);
        return false;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch, removeFromCart, userInfo]
  );

  const handleUpdateQty = useCallback(
    async (productId, qty) => {
      if (!productId) {
        toast.error("Invalid product data");
        return false;
      }

      if (qty < 1) {
        return handleRemoveFromCart(productId);
      }

      const existingItem = Array.isArray(cartItems)
        ? cartItems.find((item) => (item?.product?._id || item?._id) === productId)
        : null;
      const stock = getItemStock(existingItem);
      const requestedQty = Number(qty);
      const safeQty = stock > 0 ? Math.min(Math.max(requestedQty, 1), stock) : Math.max(requestedQty, 1);

      if (stock > 0 && requestedQty > stock) {
        const message = `Only ${stock} item${stock === 1 ? "" : "s"} available in stock`;
        dispatch(setError(message));
        notifyCartToast("error", message, `stock:${productId}`);
        return false;
      }

      if (!userInfo) {
        dispatch(updateQtyLocal({ id: productId, qty: safeQty }));
        notifyCartToast("success", "Cart updated successfully", `qty:${productId}`);
        return true;
      }

      try {
        dispatch(setLoading(true));
        const response = await updateCartItem({ productId, qty: safeQty }).unwrap();
        dispatch(setCartItems(normalizeCartItems(response)));
        notifyCartToast("success", "Cart updated successfully", `qty:${productId}`);
        return true;
      } catch (err) {
        const message = err?.data?.message || "Failed to update quantity";
        dispatch(setError(message));
        dispatch(showNotice({ message, type: "error" }));
        toast.error(message);
        return false;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [cartItems, dispatch, handleRemoveFromCart, updateCartItem, userInfo]
  );

  const handleClearCart = useCallback(async () => {
    if (!userInfo) {
      dispatch(clearCartLocal());
      dispatch(showNotice({ message: "Cart cleared.", type: "info" }));
      toast.success("Cart cleared");
      return true;
    }

    try {
      dispatch(setLoading(true));
      await clearCart().unwrap();
      dispatch(clearCartLocal());
      dispatch(showNotice({ message: "Cart cleared.", type: "info" }));
      toast.success("Cart cleared");
      return true;
    } catch (err) {
      const message = err?.data?.message || "Failed to clear cart";
      dispatch(setError(message));
      toast.error(message);
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  }, [clearCart, dispatch, userInfo]);

  return {
    cartItems,
    loading: loading || isCartLoading || isAdding || isRemoving || isUpdating || isClearing,
    error,
    addToCart: handleAddToCart,
    removeFromCart: handleRemoveFromCart,
    updateQty: handleUpdateQty,
    clearCart: handleClearCart,
    totalItems: Array.isArray(cartItems)
      ? cartItems.reduce((sum, item) => sum + Number(item.qty || 0), 0)
      : 0,
  };
};

export default useUserCart;
