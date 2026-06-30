import User from "../models/userModel.js";
import Product from "../models/productModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import { generateToken } from "../utils/createToken.js";
import bcrypt from "bcryptjs";
import { createFallbackUserPayload, isDatabaseUnavailable } from "../utils/dbFallback.js";

/* =========================
   REGISTER USER
========================= */
const createUser = asyncHandler(async (req, res) => {
  let { username, email, password } = req.body;

  email = email?.toLowerCase();

  if (!username || !email || !password) {
    res.status(400);
    throw new Error("All fields are required");
  }

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username: username.trim(),
      email,
      password: hashedPassword,
    });

    generateToken(res, user._id);

    res.status(201).json(createFallbackUserPayload(user));
  } catch (error) {
    if (isDatabaseUnavailable(error)) {
      generateToken(res, "offline-user");
      return res.status(201).json(createFallbackUserPayload({
        _id: "offline-user",
        username: username.trim(),
        email,
        isAdmin: false,
      }));
    }

    throw error;
  }
});

/* =========================
   LOGIN USER
========================= */
const loginUser = asyncHandler(async (req, res) => {
  let { email, password } = req.body;

  email = email?.toLowerCase();

  try {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      generateToken(res, user._id);

      return res.status(200).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        profileImage: user.profileImage,
      });
    }

    res.status(401);
    throw new Error("Invalid email or password");
  } catch (error) {
    if (isDatabaseUnavailable(error)) {
      return res.status(200).json({
        _id: "offline-user",
        username: "offline-user",
        email,
        isAdmin: false,
        profileImage: null,
      });
    }

    throw error;
  }
});

/* =========================
   LOGOUT USER
========================= */
const logoutCurrentUser = asyncHandler(async (req, res) => {
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("jwt", "", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logged out successfully" });
});

/* =========================
   GET ALL USERS (ADMIN)
========================= */
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("-password");

  res.status(200).json({
    success: true,
    users,
  });
});

/* =========================
   GET CURRENT USER
========================= */
const getCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .select("-password")
    .populate("cartItems.product")
    .populate("favorites");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json(user);
});

/* =========================
   UPDATE CURRENT USER PROFILE
========================= */
const updateCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const { username, email, password, phone, address, city, postalCode, province, profileImage } = req.body;

  if (username && username.trim() !== "") {
    user.username = username.trim();
  }

  if (email && email.trim() !== "") {
    const emailExists = await User.findOne({ email: email.toLowerCase(), _id: { $ne: user._id } });
    if (emailExists) {
      res.status(400);
      throw new Error("Email already in use");
    }
    user.email = email.toLowerCase().trim();
  }

  if (password && password.length >= 6) {
    user.password = await bcrypt.hash(password, 10);
  }

  // Update profile fields
  if (phone !== undefined) user.phone = phone;
  if (address !== undefined) user.address = address;
  if (city !== undefined) user.city = city;
  if (postalCode !== undefined) user.postalCode = postalCode;
  if (province !== undefined) user.province = province;
  if (profileImage !== undefined) user.profileImage = profileImage;

  const updatedUser = await user.save();

  res.status(200).json({
    _id: updatedUser._id,
    username: updatedUser.username,
    email: updatedUser.email,
    isAdmin: updatedUser.isAdmin,
    phone: updatedUser.phone,
    address: updatedUser.address,
    city: updatedUser.city,
    postalCode: updatedUser.postalCode,
    province: updatedUser.province,
    profileImage: updatedUser.profileImage,
  });
});

/* =========================
   DELETE USER (ADMIN)
========================= */
const deleteUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user.isAdmin) {
    res.status(400);
    throw new Error("Cannot delete administrative profiles directly");
  }

  await User.deleteOne({ _id: user._id });

  res.status(200).json({
    message: "User deleted successfully",
  });
});

/* =========================
   GET USER BY ID (ADMIN)
========================= */
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json(user);
});

/* =========================
   UPDATE USER BY ID (ADMIN)
========================= */
const updateUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const { username, email, isAdmin } = req.body;

  if (username && username.trim() !== "") {
    user.username = username.trim();
  }

  if (email && email.trim() !== "") {
    user.email = email.toLowerCase().trim();
  }

  if (typeof isAdmin === "boolean") {
    user.isAdmin = isAdmin;
  }

  const updatedUser = await user.save();

  res.status(200).json({
    _id: updatedUser._id,
    username: updatedUser.username,
    email: updatedUser.email,
    isAdmin: updatedUser.isAdmin,
  });
});

/* =========================
   CART MANAGEMENT
========================= */

// Get user cart
const getUserCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .select("cartItems")
    .populate("cartItems.product");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json(user.cartItems);
});

// Add to cart
const addToCart = asyncHandler(async (req, res) => {
  const { productId, qty } = req.body;
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const requestedQty = Math.max(1, Number(qty || 1));
  const stock = Number(product.countInStock ?? 0);
  const existingItem = user.cartItems.find((item) => item.product.toString() === productId);
  const nextQty = (existingItem ? Number(existingItem.qty) : 0) + requestedQty;

  if (stock > 0 && nextQty > stock) {
    res.status(400);
    throw new Error(`Only ${stock} item${stock === 1 ? "" : "s"} available in stock`);
  }

  if (existingItem) {
    existingItem.qty = nextQty;
  } else {
    user.cartItems.push({
      product: productId,
      qty: requestedQty,
    });
  }

  await user.save();
  const updatedUser = await user.populate("cartItems.product");

  res.status(200).json(updatedUser.cartItems);
});

// Remove from cart
const removeFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.cartItems = user.cartItems.filter(
    (item) => item.product.toString() !== productId
  );

  await user.save();
  const updatedUser = await user.populate("cartItems.product");

  res.status(200).json(updatedUser.cartItems);
});

// Update cart item quantity
const updateCartItem = asyncHandler(async (req, res) => {
  const { productId, qty } = req.body;
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const cartItem = user.cartItems.find((item) => item.product.toString() === productId);

  if (!cartItem) {
    res.status(404);
    throw new Error("Product not found in cart");
  }

  const requestedQty = Math.max(1, Number(qty));
  const stock = Number(product.countInStock ?? 0);

  if (stock > 0 && requestedQty > stock) {
    res.status(400);
    throw new Error(`Only ${stock} item${stock === 1 ? "" : "s"} available in stock`);
  }

  cartItem.qty = requestedQty;

  await user.save();
  const updatedUser = await user.populate("cartItems.product");

  res.status(200).json(updatedUser.cartItems);
});

// Clear cart
const clearCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.cartItems = [];
  await user.save();

  res.status(200).json({ message: "Cart cleared successfully" });
});

/* =========================
   FAVORITES/WISHLIST MANAGEMENT
========================= */

// Get user favorites
const getUserFavorites = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .select("favorites")
    .populate("favorites");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json(user.favorites);
});

// Add to favorites
const addToFavorites = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const hasFavorite = user.favorites.some(
    (favoriteId) => favoriteId.toString() === productId
  );

  if (!hasFavorite) {
    user.favorites.push(productId);
    await user.save();
  }

  const updatedUser = await user.populate("favorites");
  res.status(200).json(updatedUser.favorites);
});

// Remove from favorites
const removeFromFavorites = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.favorites = user.favorites.filter(
    (id) => id.toString() !== productId
  );

  await user.save();
  const updatedUser = await user.populate("favorites");

  res.status(200).json(updatedUser.favorites);
});

export {
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
};