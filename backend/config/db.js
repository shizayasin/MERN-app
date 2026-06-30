import mongoose from "mongoose";

const normalizeMongoUri = (mongoUri) => {
  if (!mongoUri || !/^mongodb(?:\+srv)?:\/\//i.test(mongoUri)) {
    return mongoUri;
  }

  try {
    const parsed = new URL(mongoUri);
    const dbName = parsed.pathname.replace(/^\//, "").split("?")[0];

    if (dbName) {
      parsed.pathname = `/${dbName.toLowerCase()}`;
      return parsed.toString();
    }
  } catch {
    // Fall back to the original URI if parsing fails.
  }

  return mongoUri;
};

const connectDB = async () => {
  const mongoUri = normalizeMongoUri(process.env.MONGO_URI);

  if (!mongoUri || !/^mongodb(?:\+srv)?:\/\//i.test(mongoUri)) {
    console.warn("MongoDB URI is invalid or missing; skipping database connection.");
    return;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);

    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    }

    console.warn("Continuing without database connection in development mode.");
  }
};

export { normalizeMongoUri };
export default connectDB;