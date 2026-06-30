import mongoose from "mongoose";
import Product from "../models/productModel.js";
import Category from "../models/categoryModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import { calculateRatingSummary, removeReviewAndRecalculate } from "../utils/reviewUtils.js";
import { getFallbackProductsPayload, isDatabaseUnavailable } from "../utils/dbFallback.js";

// GET ALL PRODUCTS
const getProducts = asyncHandler(async (req, res) => {
  try {
    const pageSize = Number(req.query.pageSize) || 12;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword
      ? {
          $or: [
            { name: { $regex: req.query.keyword, $options: "i" } },
            { description: { $regex: req.query.keyword, $options: "i" } },
            { brand: { $regex: req.query.keyword, $options: "i" } },
          ],
        }
      : {};

    let categoryFilter = {};
    if (req.query.category) {
      if (mongoose.Types.ObjectId.isValid(req.query.category)) {
        categoryFilter = { category: req.query.category };
      } else {
        const categoryDoc = await Category.findOne({
          name: { $regex: `^${req.query.category}$`, $options: "i" },
        }).select("_id");

        if (categoryDoc) {
          categoryFilter = { category: categoryDoc._id };
        }
      }
    }

    const filter = {
      ...keyword,
      ...categoryFilter,
    };

    let sortOrder = { createdAt: -1 };

    if (req.query.sort) {
      switch (req.query.sort) {
        case "price-low":
          sortOrder = { price: 1 };
          break;
        case "price-high":
          sortOrder = { price: -1 };
          break;
        case "name-asc":
          sortOrder = { name: 1 };
          break;
        case "name-desc":
          sortOrder = { name: -1 };
          break;
        case "newest":
          sortOrder = { createdAt: -1 };
          break;
        case "oldest":
          sortOrder = { createdAt: 1 };
          break;
        default:
          sortOrder = { createdAt: -1 };
      }
    }

    const count = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .populate("category", "name")
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort(sortOrder);

    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
    });
  } catch (error) {
    if (isDatabaseUnavailable(error)) {
      return res.status(200).json(getFallbackProductsPayload());
    }

    throw error;
  }
});

// GET SINGLE PRODUCT
const getProductById = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "category",
      "name"
    );

    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    res.json(product);
  } catch (error) {
    if (isDatabaseUnavailable(error)) {
      res.status(404);
      throw new Error("Product not found");
    }

    throw error;
  }
});

// CREATE REVIEW
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const alreadyReviewed = product.reviews.some((review) => review.user?.toString() === req.user._id.toString());
  if (alreadyReviewed) {
    res.status(400);
    throw new Error("You have already reviewed this product");
  }

  const review = {
    user: req.user._id,
    name: req.user.username || "Customer",
    rating: Number(rating),
    comment,
  };

  product.reviews.push(review);
  const summary = calculateRatingSummary(product.reviews);
  product.rating = summary.averageRating;
  product.numReviews = summary.numReviews;

  await product.save();
  const updatedProduct = await Product.findById(product._id).populate("category", "name");

  res.status(201).json(updatedProduct);
});

// REMOVE A REVIEW
const removeProductReview = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const { reviewId } = req.params;
  const result = removeReviewAndRecalculate(product.reviews, reviewId);

  if (result.reviews.length === product.reviews.length) {
    res.status(404);
    throw new Error("Review not found");
  }

  product.reviews = result.reviews;
  product.rating = result.summary.averageRating;
  product.numReviews = result.summary.numReviews;

  await product.save();
  const updatedProduct = await Product.findById(product._id).populate("category", "name");

  res.json(updatedProduct);
});

// CREATE PRODUCT
const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    brand,
    countInStock,
    category,
    image,
  } = req.body;

  if (
    !name ||
    !description ||
    !price ||
    !brand ||
    !countInStock ||
    !category
  ) {
    res.status(400);
    throw new Error("All required fields must be filled");
  }

  const categoryExists = await Category.findById(category);
  if (!categoryExists) {
    res.status(400);
    throw new Error("Invalid category");
  }

  const product = await Product.create({
    name,
    description,
    price,
    brand,
    countInStock,
    category,
    image: image || "",
  });

  const created = await Product.findById(product._id).populate(
    "category",
    "name"
  );

  res.status(201).json(created);
});

// UPDATE PRODUCT
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const { category } = req.body;

  if (category && category !== product.category?.toString()) {
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      res.status(400);
      throw new Error("Invalid category");
    }
  }

  Object.assign(product, req.body);
  const updated = await product.save();
  const populated = await updated.populate("category", "name");

  res.json(populated);
});

// DELETE PRODUCT
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  await product.deleteOne();

  res.json({ message: "Product removed" });
});

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  removeProductReview,
};