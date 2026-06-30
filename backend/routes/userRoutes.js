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

/* =========================
   PUBLIC ROUTES
========================= */

// Register user
router.post("/", createUser);

// Login user
router.post("/auth", loginUser);

/* =========================
   AUTHENTICATED USER ROUTES
========================= */

// Logout user (must be logged in)
router.post("/logout", authenticate, logoutCurrentUser);

// Get & update own profile
router
  .route("/profile")
  .get(authenticate, getCurrentUserProfile)
  .put(authenticate, updateCurrentUserProfile);

// Cart routes
router.get("/cart", authenticate, getUserCart);
router.post("/cart/add", authenticate, addToCart);
router.post("/cart/remove", authenticate, removeFromCart);
router.post("/cart/update", authenticate, updateCartItem);
router.post("/cart/clear", authenticate, clearCart);

// Favorites/Wishlist routes
router.get("/favorites", authenticate, getUserFavorites);
router.post("/favorites/add", authenticate, addToFavorites);
router.post("/favorites/remove", authenticate, removeFromFavorites);

/* =========================
   ADMIN ROUTES
========================= */

// Get all users
router.get("/", authenticate, authorizeAdmin, getAllUsers);

// User CRUD by ID (admin only)
router
  .route("/:id")
  .get(authenticate, authorizeAdmin, getUserById)
  .put(authenticate, authorizeAdmin, updateUserById)
  .delete(authenticate, authorizeAdmin, deleteUserById);

export default router;