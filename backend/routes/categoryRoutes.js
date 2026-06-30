import express from "express";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

import {
  authenticate,
  authorizeAdmin,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getCategories);

router.post("/", authenticate, authorizeAdmin, createCategory);

router
  .route("/:id")
  .put(authenticate, authorizeAdmin, updateCategory)
  .delete(authenticate, authorizeAdmin, deleteCategory);

export default router;