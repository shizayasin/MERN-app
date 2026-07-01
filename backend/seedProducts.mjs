import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import Category from './models/categoryModel.js';
import Product from './models/productModel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const seedData = async () => {
  try {
    await connectDB();
  
    await Category.deleteMany({});
    await Product.deleteMany({});

    console.log('No demo products or categories were inserted.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding cleanup failed:', error);
    process.exit(1);
  }
};

seedData();
