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

    const categories = await Category.insertMany([
      { name: 'Electronics' },
      { name: 'Fashion' },
      { name: 'Home & Kitchen' },
      { name: 'Beauty & Personal Care' },
      { name: 'Sports & Outdoors' },
    ]);

    const categoryMap = Object.fromEntries(categories.map((category) => [category.name, category._id]));

    const products = [
      {
        name: 'Wireless Headphones',
        description: 'Immersive sound with noise cancellation and 30-hour battery life.',
        price: 129.99,
        brand: 'SoundMax',
        countInStock: 18,
        category: categoryMap['Electronics'],
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
        rating: 4.7,
        numReviews: 12,
      },
      {
        name: 'Smart Watch',
        description: 'Track fitness, sleep, and notifications from a sleek wearable.',
        price: 199.5,
        brand: 'FitTech',
        countInStock: 12,
        category: categoryMap['Electronics'],
        image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=900&q=80',
        rating: 4.5,
        numReviews: 8,
      },
      {
        name: 'Classic Denim Jacket',
        description: 'A timeless jacket designed for everyday comfort and style.',
        price: 79.99,
        brand: 'Northwind',
        countInStock: 21,
        category: categoryMap['Fashion'],
        image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
        rating: 4.3,
        numReviews: 10,
      },
      {
        name: 'Running Shoes',
        description: 'Lightweight sneakers with cushioned support for daily runs.',
        price: 89.0,
        brand: 'SprintX',
        countInStock: 16,
        category: categoryMap['Sports & Outdoors'],
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
        rating: 4.6,
        numReviews: 14,
      },
      {
        name: 'Ceramic Coffee Mug Set',
        description: 'Premium ceramic mugs perfect for morning coffee or tea.',
        price: 24.95,
        brand: 'Homecraft',
        countInStock: 30,
        category: categoryMap['Home & Kitchen'],
        image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=80',
        rating: 4.2,
        numReviews: 6,
      },
      {
        name: 'Skincare Essentials Kit',
        description: 'Hydrating and nourishing skincare essentials for daily rituals.',
        price: 34.5,
        brand: 'GlowCare',
        countInStock: 14,
        category: categoryMap['Beauty & Personal Care'],
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=80',
        rating: 4.8,
        numReviews: 9,
      },
      {
        name: '4K Smart TV',
        description: 'Crisp 4K visuals with built-in streaming apps and voice control.',
        price: 549.99,
        brand: 'VisionPro',
        countInStock: 9,
        category: categoryMap['Electronics'],
        image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=900&q=80',
        rating: 4.7,
        numReviews: 11,
      },
      {
        name: 'Leather Crossbody Bag',
        description: 'Compact and stylish bag with ample space for daily essentials.',
        price: 64.0,
        brand: 'UrbanStyle',
        countInStock: 17,
        category: categoryMap['Fashion'],
        image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80',
        rating: 4.4,
        numReviews: 7,
      },
      {
        name: 'Camping Backpack',
        description: 'Durable backpack built for weekend trips and outdoor adventures.',
        price: 74.99,
        brand: 'TrailBlaze',
        countInStock: 13,
        category: categoryMap['Sports & Outdoors'],
        image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
        rating: 4.5,
        numReviews: 5,
      },
      {
        name: 'Minimalist Desk Lamp',
        description: 'A modern desk lamp with adjustable brightness and warm lighting.',
        price: 39.99,
        brand: 'LumaHouse',
        countInStock: 22,
        category: categoryMap['Home & Kitchen'],
        image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=900&q=80',
        rating: 4.1,
        numReviews: 4,
      },
      {
        name: 'Hair Styling Tool Set',
        description: 'Professional styling tools for smooth, polished results at home.',
        price: 49.0,
        brand: 'Glossy',
        countInStock: 15,
        category: categoryMap['Beauty & Personal Care'],
        image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=80',
        rating: 4.6,
        numReviews: 8,
      },
      {
        name: 'Portable Bluetooth Speaker',
        description: 'Compact waterproof speaker with rich bass and 12-hour playback.',
        price: 59.99,
        brand: 'AudioWave',
        countInStock: 20,
        category: categoryMap['Electronics'],
        image: 'https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?auto=format&fit=crop&w=900&q=80',
        rating: 4.4,
        numReviews: 6,
      },
    ];

    await Product.insertMany(products);

    const productCount = await Product.countDocuments();
    const categoryCount = await Category.countDocuments();

    console.log(`✅ Seeded ${productCount} products across ${categoryCount} categories.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
