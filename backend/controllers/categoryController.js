import Category from "../models/categoryModel.js";
import Product from "../models/productModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import { isDatabaseUnavailable } from "../utils/dbFallback.js";

// GET ALL
const getCategories = asyncHandler(async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    if (isDatabaseUnavailable(error)) {
      return res.status(200).json([]);
    }

    throw error;
  }
});

// CREATE
const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const trimmedName = name?.trim();

  if (!trimmedName) {
    res.status(400);
    throw new Error("Category name is required");
  }

  const exists = await Category.findOne({
    name: { $regex: new RegExp(`^${trimmedName}$`, "i") },
  });

  if (exists) {
    res.status(400);
    throw new Error("Category already exists");
  }

  const category = await Category.create({
    name: trimmedName,
  });

  res.status(201).json(category);
});

// UPDATE
const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  const name = req.body.name?.trim();

  if (!name) {
    res.status(400);
    throw new Error("Category name is required");
  }

  const duplicate = await Category.findOne({
    _id: { $ne: category._id },
    name: { $regex: new RegExp(`^${name}$`, "i") },
  });

  if (duplicate) {
    res.status(400);
    throw new Error("Category already exists");
  }

  category.name = name;

  const updated = await category.save();
  res.json(updated);
});

// DELETE SAFE
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  const productsCount = await Product.countDocuments({
    category: category._id,
  });

  if (productsCount > 0) {
    res.status(400);
    throw new Error("Category is used by products");
  }

  await Category.deleteOne({ _id: category._id });

  res.json({ message: "Category deleted" });
});

export {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};