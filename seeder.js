import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

import connectDB from './backend/config/db.js';
import Category from './backend/models/categoryModel.js';
import Product from './backend/models/productModel.js';
import User from './backend/models/userModel.js';
import Order from './backend/models/orderModel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

dotenv.config({ path: path.resolve(__dirname, 'backend/.env') });

const categorySeedData = [
  { name: 'Electronics' },
  { name: 'Fashion' },
  { name: 'Home & Kitchen' },
  { name: 'Beauty & Personal Care' },
  { name: 'Sports & Outdoors' },
];

const productSeedData = [
  {
    name: 'Wireless Headphones',
    description: 'Immersive sound with noise cancellation and 30-hour battery life.',
    price: 129.99,
    brand: 'SoundMax',
    countInStock: 18,
    categoryName: 'Electronics',
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
    categoryName: 'Electronics',
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
    categoryName: 'Fashion',
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
    categoryName: 'Sports & Outdoors',
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
    categoryName: 'Home & Kitchen',
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
    categoryName: 'Beauty & Personal Care',
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
    categoryName: 'Electronics',
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
    categoryName: 'Fashion',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80',
    rating: 4.4,
    numReviews: 7,
  },
];

const userSeedData = [
  {
    username: 'admin',
    email: 'admin@example.com',
    password: 'Admin123!',
    isAdmin: true,
  },
  {
    username: 'jane',
    email: 'jane@example.com',
    password: 'Password123!',
    isAdmin: false,
  },
  {
    username: 'mike',
    email: 'mike@example.com',
    password: 'Password123!',
    isAdmin: false,
  },
];

const seed = async () => {
  await connectDB();

  await Category.deleteMany({});
  await Product.deleteMany({});
  await Order.deleteMany({});
  await User.deleteMany({});

  const categories = await Category.insertMany(categorySeedData);
  const categoryMap = Object.fromEntries(categories.map((category) => [category.name, category._id]));

  const products = await Product.insertMany(
    productSeedData.map((product) => ({
      ...product,
      category: categoryMap[product.categoryName],
    }))
  );

  const users = await User.insertMany(
    await Promise.all(
      userSeedData.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10),
      }))
    )
  );

  const orderItems = [
    {
      name: products[0].name,
      qty: 1,
      image: products[0].image,
      price: products[0].price,
      product: products[0]._id,
    },
    {
      name: products[2].name,
      qty: 2,
      image: products[2].image,
      price: products[2].price,
      product: products[2]._id,
    },
  ];

  const orders = await Order.insertMany([
    {
      user: users[1]._id,
      orderItems,
      shippingAddress: {
        fullName: 'Jane Doe',
        phoneNumber: '03001234567',
        address: '123 Main Street',
        city: 'Lahore',
        postalCode: '54000',
        province: 'Punjab',
        nearestLandmark: 'Near City Park',
      },
      paymentMethod: 'COD',
      itemsPrice: Number((products[0].price + products[2].price * 2).toFixed(2)),
      shippingPrice: 0,
      totalPrice: Number((products[0].price + products[2].price * 2).toFixed(2)),
      isPaid: true,
      paidAt: new Date(),
      isDelivered: false,
    },
    {
      user: users[2]._id,
      orderItems: [
        {
          name: products[4].name,
          qty: 1,
          image: products[4].image,
          price: products[4].price,
          product: products[4]._id,
        },
      ],
      shippingAddress: {
        fullName: 'Mike Smith',
        phoneNumber: '03009876543',
        address: '45 Market Road',
        city: 'Karachi',
        postalCode: '75200',
        province: 'Sindh',
        nearestLandmark: 'Near Railway Station',
      },
      paymentMethod: 'Bank Transfer',
      itemsPrice: Number(products[4].price.toFixed(2)),
      shippingPrice: 10,
      totalPrice: Number((products[4].price + 10).toFixed(2)),
      isPaid: false,
      isDelivered: false,
    },
  ]);

  console.log(
    JSON.stringify(
      {
        categories: categories.length,
        products: products.length,
        users: users.length,
        orders: orders.length,
      },
      null,
      2
    )
  );
};

seed()
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  })
  .finally(() => {
    mongoose.disconnect();
  });
