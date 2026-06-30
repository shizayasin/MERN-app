import mongoose from "mongoose";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import { isDatabaseUnavailable } from "../utils/dbFallback.js";

// @desc Create new complex order record
// @route POST /api/orders
const addOrderItems = asyncHandler(async (req, res) => {
  const { 
    orderItems, 
    shippingAddress, 
    paymentMethod, 
    itemsPrice, 
    shippingPrice, 
    totalPrice 
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error("Your cart contains no items.");
  }

  // Guard rails against unauthorized execution paths
  if (!req.user) {
    res.status(401);
    throw new Error("User identity footprint missing from state context.");
  }

  try {
    const normalizedOrderItems = orderItems.map((item) => {
      const productId = item.product || item._id || item.productId;
      return {
        ...item,
        product: productId,
        qty: Number(item.qty || 1),
        price: Number(item.price || 0),
        name: item.name || "Unnamed product",
        image: item.image || "",
      };
    });

    // Deduct stock using safe atomic queries
    for (const item of normalizedOrderItems) {
      const productId = item.product;

      if (!productId) {
        res.status(400);
        throw new Error("A target item node is missing structural identification attributes.");
      }

      // Fetch product to check current stock
      const product = await Product.findById(productId);
      
      if (!product) {
        res.status(404);
        throw new Error(`Product not found: ${productId}`);
      }
      
      if (product.countInStock < Number(item.qty)) {
        res.status(400);
        throw new Error(
          `Insufficient stock for ${product.name}. Available: ${product.countInStock}, Requested: ${item.qty}`
        );
      }

      // Updated option syntax removes the Mongoose deprecation warning
      const updatedProd = await Product.findOneAndUpdate(
        { _id: productId, countInStock: { $gte: Number(item.qty) } },
        { $inc: { countInStock: -Number(item.qty) } },
        { returnDocument: "after" } 
      );

      if (!updatedProd) {
        res.status(400);
        throw new Error(`Failed to reserve stock for ${product.name}. Please try again.`);
      }
    }

    // Build order document matching the schema definitions safely
    const order = new Order({
      user: req.user._id,
      orderItems: normalizedOrderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);

  } catch (error) {
    if (isDatabaseUnavailable(error)) {
      return res.status(200).json({
        message: "Order created in offline mode",
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        totalPrice,
      });
    }

    res.status(error.statusCode || 500);
    throw error;
  }
});

const buildOfflineOrderPayload = (id, userId) => ({
  _id: id,
  user: userId,
  orderItems: [],
  shippingAddress: {},
  paymentMethod: "COD",
  itemsPrice: 0,
  shippingPrice: 0,
  totalPrice: 0,
  isPaid: false,
  message: "Order data is currently unavailable while the database is offline.",
});

// @desc Get logged-in user order records
// @route GET /api/orders/myorders
const getMyOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("orderItems.product", "name price image")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    if (isDatabaseUnavailable(error)) {
      return res.status(200).json([]);
    }

    throw error;
  }
});

// @desc Get order profile metrics by ID
// @route GET /api/orders/:id
const getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    res.status(400);
    throw new Error("Invalid order id.");
  }

  try {
    const order = await Order.findById(id)
      .populate("user", "username email")
      .populate("orderItems.product", "name price image");

    if (!order) {
      res.status(404);
      throw new Error("Requested order matrix node not found.");
    }

    res.json(order);
  } catch (error) {
    if (isDatabaseUnavailable(error)) {
      return res.status(200).json(buildOfflineOrderPayload(id, req.user?._id));
    }

    throw error;
  }
});

// @desc Process transaction payment status confirmation
// @route PUT /api/orders/:id/pay
const payOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    res.status(400);
    throw new Error("Invalid order id.");
  }

  const order = await Order.findById(id);
  if (!order) {
    res.status(404);
    throw new Error("Order trace mapping missing.");
  }

  order.isPaid = true;
  order.paidAt = new Date();
  
  // Clean structure matching flattened payload from frontend mutation updates
  order.paymentResult = {
    id: req.body.id,
    status: req.body.status || "COMPLETED",
    update_time: new Date().toISOString(),
    referenceNotes: req.body.referenceNotes,
  };

  const updatedOrder = await order.save();
  res.json(updatedOrder);
});

// @desc Admin: View system orders index
// @route GET /api/orders
const getOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "username email")
      .populate("orderItems.product", "name price image")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    if (isDatabaseUnavailable(error)) {
      return res.status(200).json([]);
    }

    throw error;
  }
});

export { addOrderItems, getMyOrders, getOrderById, getOrders, payOrder };