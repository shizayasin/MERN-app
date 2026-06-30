import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  removeProductReview,
} from "../controllers/productController.js";
import {
  authenticate,
  authorizeAdmin,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .get(getProducts)
  .post(authenticate, authorizeAdmin, createProduct);

router.route("/:id/reviews").post(authenticate, createProductReview);
router.route("/:id/reviews/:reviewId").delete(authenticate, authorizeAdmin, removeProductReview);

router
  .route("/:id")
  .get(getProductById)
  .put(authenticate, authorizeAdmin, updateProduct)
  .delete(authenticate, authorizeAdmin, deleteProduct);

export default router;