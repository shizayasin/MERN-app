import { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetFavoritesQuery,
  useAddToFavoritesMutation,
  useRemoveFromFavoritesMutation,
} from "../redux/api/userApiSlice";
import {
  setFavorites,
  addToFavoritesLocal,
  removeFromFavoritesLocal,
  setLoading,
  setError,
} from "../redux/features/favorites/favoritesSlice";
import { showNotice } from "../redux/features/ui/noticeSlice";

const mergeFavorites = (localFavorites = [], backendFavorites = []) => {
  const merged = new Map();

  const addFavorite = (item) => {
    const productId = item?._id;
    if (!productId) return;
    if (!merged.has(productId)) {
      merged.set(productId, item);
    }
  };

  localFavorites.forEach(addFavorite);
  backendFavorites.forEach(addFavorite);

  return Array.from(merged.values());
};

const createFavoritesSignature = (items = []) =>
  (Array.isArray(items) ? items : []).map((item) => item?._id || "").join("|");

export const useUserFavorites = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const { favorites, loading, error } = useSelector((state) => state.favorites);
  const lastHydratedRef = useRef("");

  const { data: backendFavorites = [], isLoading: isFavoritesLoading } =
    useGetFavoritesQuery(userInfo?._id ?? null, { skip: !userInfo });
  const [addToFavorites, { isLoading: isAdding }] = useAddToFavoritesMutation();
  const [removeFromFavorites, { isLoading: isRemoving }] = useRemoveFromFavoritesMutation();

  useEffect(() => {
    if (!userInfo) {
      lastHydratedRef.current = "";
      dispatch(setError(null));
      return;
    }

    if (isFavoritesLoading || !Array.isArray(backendFavorites)) {
      return;
    }

    const remoteSignature = createFavoritesSignature(backendFavorites);
    const hydrationKey = `${userInfo?._id || "guest"}:${remoteSignature}`;

    if (lastHydratedRef.current === hydrationKey) {
      return;
    }

    const nextFavorites =
      Array.isArray(favorites) && favorites.length > 0 && backendFavorites.length > 0
        ? mergeFavorites(favorites, backendFavorites)
        : backendFavorites;

    if (createFavoritesSignature(favorites) === createFavoritesSignature(nextFavorites)) {
      lastHydratedRef.current = hydrationKey;
      return;
    }

    lastHydratedRef.current = hydrationKey;
    dispatch(setFavorites(nextFavorites));
  }, [backendFavorites, dispatch, favorites, isFavoritesLoading, userInfo]);

  const handleAddToFavorites = useCallback(
    async (product) => {
      if (!userInfo) {
        dispatch(addToFavoritesLocal(product));
        dispatch(showNotice({ message: "Saved to favorites locally.", type: "success" }));
        toast.success("Added to favorites!");
        return true;
      }

      try {
        dispatch(setLoading(true));
        await addToFavorites({ productId: product._id }).unwrap();
        dispatch(addToFavoritesLocal(product));
        dispatch(showNotice({ message: "Added to favorites.", type: "success" }));
        toast.success("Added to favorites!");
        return true;
      } catch (err) {
        const message = err?.data?.message || "Failed to add to favorites";
        dispatch(setError(message));
        toast.error(message);
        return false;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [addToFavorites, dispatch, userInfo]
  );

  const handleRemoveFromFavorites = useCallback(
    async (productId) => {
      if (!userInfo) {
        dispatch(removeFromFavoritesLocal(productId));
        dispatch(showNotice({ message: "Removed from favorites.", type: "info" }));
        toast.success("Removed from favorites");
        return true;
      }

      try {
        dispatch(setLoading(true));
        await removeFromFavorites({ productId }).unwrap();
        dispatch(removeFromFavoritesLocal(productId));
        dispatch(showNotice({ message: "Removed from favorites.", type: "info" }));
        toast.success("Removed from favorites");
        return true;
      } catch (err) {
        const message = err?.data?.message || "Failed to remove from favorites";
        dispatch(setError(message));
        toast.error(message);
        return false;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch, removeFromFavorites, userInfo]
  );

  const isFavorite = useCallback(
    (productId) => {
      return Array.isArray(favorites) && favorites.some((fav) => fav._id === productId);
    },
    [favorites]
  );

  return {
    favorites,
    loading: loading || isFavoritesLoading || isAdding || isRemoving,
    error,
    addToFavorites: handleAddToFavorites,
    removeFromFavorites: handleRemoveFromFavorites,
    isFavorite,
    totalFavorites: Array.isArray(favorites) ? favorites.length : 0,
  };
};

export default useUserFavorites;
