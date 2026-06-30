import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import compression from "compression";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import { validateEnv } from "./config/env.js";
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js"; 
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";

// Initialize environment variables cleanly for both local and production (Railway) environments
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 5000;

validateEnv();

// ================= MIDDLEWARE =================
// Compression for faster responses
app.use(compression());

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://stylehub-mern.netlify.app",
  "https://www.stylehub-mern.netlify.app",
  "https://mern-ecommerce-production-4dac.up.railway.app",
  process.env.FRONTEND_URL,
  process.env.CORS_ORIGIN,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        /\.netlify\.app$/i.test(origin) ||
        /\.up\.railway\.app$/i.test(origin) ||
        origin.includes("localhost")
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" })); // Essential for base64 media strings
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Security & Performance Headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  next();
});

// ================= ROUTES =================

// Base server check to intercept and resolve standard root page queries 
app.get("/", (req, res) => {
  res.json({ status: "healthy", message: "API service layer running cleanly." });
});

app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes); 

// PayPal Configuration Endpoint
app.get("/api/config/paypal", (req, res) => {
  const paypalClientId = process.env.PAYPAL_CLIENT_ID;
  
  if (!paypalClientId || paypalClientId.trim() === "") {
    console.warn(
      "⚠️ WARNING: PayPal Client ID is not configured. Using sandbox mode 'sb'. " +
      "For production, set PAYPAL_CLIENT_ID in your .env file."
    );
    return res.json({ 
      clientId: "sb",
      mode: "sandbox",
      warning: "Using PayPal sandbox mode. Configure PAYPAL_CLIENT_ID for production."
    });
  }
  
  res.json({ 
    clientId: paypalClientId,
    mode: process.env.NODE_ENV === "production" ? "production" : "sandbox"
  });
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "healthy", 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development"
  });
});

// ================= STATIC FILES DISCOVERY =================
app.use("/uploads", express.static(path.resolve(__dirname, "../uploads"), {
  maxAge: process.env.NODE_ENV === "production" ? "1d" : "1h",
  etag: false,
  fallthrough: true
}));
app.use("/uploads", express.static(path.resolve(__dirname, "./uploads"), {
  maxAge: process.env.NODE_ENV === "production" ? "1d" : "1h",
  etag: false,
  fallthrough: true
}));

// ================= ERROR HANDLERS =================
app.use(notFound);
app.use(errorHandler);

// ================= SERVER START (Moved to bottom) =================
const start = async () => {
  await connectDB();

  app.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
    console.log(`📦 Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`💾 Database URL configuration initialized from environment`);
  });
};

start();
