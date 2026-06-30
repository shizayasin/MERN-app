import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import Category from './models/categoryModel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const names = [
  'Electronics',
  'Fashion',
  'Home & Kitchen',
  'Beauty & Personal Care',
  'Sports & Outdoors',
];

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const results = [];

    for (const name of names) {
      const result = await Category.updateOne(
        { name },
        { $setOnInsert: { name } },
        { upsert: true }
      );
      results.push({ name, upserted: result.upsertedCount > 0, matched: result.matchedCount > 0 });
    }

    const categories = await Category.find({ name: { $in: names } }).sort({ name: 1 });
    console.log(JSON.stringify({ insertedOrUpdated: results, categories }, null, 2));
    await mongoose.disconnect();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

run();
