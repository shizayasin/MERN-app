import express from "express";
import {
  createUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  deleteUserById,
  getUserById,
  updateUserById,
  getUserCart,
  addToCart,
  removeFromCart,
  updateCartItem,
  clearCart,
  getUserFavorites,
  addToFavorites,
  removeFromFavorites,
} from "../controllers/userController.js";

import {
  authenticate,
  authorizeAdmin,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", createUser);

router.post("/auth", loginUser);

router.post("/logout", authenticate, logoutCurrentUser);
router
  .route("/profile")
  .get(authenticate, getCurrentUserProfile)
  .put(authenticate, updateCurrentUserProfile);

router.get("/cart", authenticate, getUserCart);
router.post("/cart/add", authenticate, addToCart);
router.post("/cart/remove", authenticate, removeFromCart);
router.post("/cart/update", authenticate, updateCartItem);
router.post("/cart/clear", authenticate, clearCart);

router.get("/favorites", authenticate, getUserFavorites);
router.post("/favorites/add", authenticate, addToFavorites);
router.post("/favorites/remove", authenticate, removeFromFavorites);

router.get("/", authenticate, authorizeAdmin, getAllUsers);
router
  .route("/:id")
  .get(authenticate, authorizeAdmin, getUserById)
  .put(authenticate, authorizeAdmin, updateUserById)
  .delete(authenticate, authorizeAdmin, deleteUserById);

export default router;