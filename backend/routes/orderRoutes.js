import express from "express";
import {
  addOrderItems,
  getMyOrders,
  getOrderById,
  getOrders,
  payOrder,
} from "../controllers/orderController.js";

import {
  authenticate,
  authorizeAdmin,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/")
  .post(authenticate, addOrderItems)
  .get(authenticate, authorizeAdmin, getOrders);

router.route("/myorders").get(authenticate, getMyOrders);
router.route("/:id").get(authenticate, getOrderById);
router.route("/:id/pay").put(authenticate, payOrder);

export default router;