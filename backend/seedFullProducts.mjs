import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import Category from './models/categoryModel.js';
import Product from './models/productModel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const products = [
  { name: 'Wireless Headphones', description: 'Immersive sound with noise cancellation and 30-hour battery life.', price: 129.99, brand: 'SoundMax', countInStock: 18, category: 'Electronics', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80', rating: 4.7, numReviews: 12 },
  { name: 'Smart Watch', description: 'Track fitness, sleep, and notifications from a sleek wearable.', price: 199.5, brand: 'FitTech', countInStock: 12, category: 'Electronics', image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=900&q=80', rating: 4.5, numReviews: 8 },
  { name: '4K Smart TV', description: 'Crisp 4K visuals with built-in streaming apps and voice control.', price: 549.99, brand: 'VisionPro', countInStock: 9, category: 'Electronics', image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=900&q=80', rating: 4.7, numReviews: 11 },
  { name: 'Portable Bluetooth Speaker', description: 'Compact waterproof speaker with rich bass and 12-hour playback.', price: 59.99, brand: 'AudioWave', countInStock: 20, category: 'Electronics', image: 'https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?auto=format&fit=crop&w=900&q=80', rating: 4.4, numReviews: 6 },
  { name: 'Laptop Sleeve', description: 'Protective and lightweight sleeve for everyday travel.', price: 29.99, brand: 'CaseMate', countInStock: 15, category: 'Electronics', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80', rating: 4.3, numReviews: 5 },
  { name: 'Ergonomic Keyboard', description: 'Comfortable typing with responsive tactile switches.', price: 79.0, brand: 'KeyFlow', countInStock: 10, category: 'Electronics', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80', rating: 4.6, numReviews: 7 },
  { name: 'Classic Denim Jacket', description: 'A timeless jacket designed for everyday comfort and style.', price: 79.99, brand: 'Northwind', countInStock: 21, category: 'Fashion', image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80', rating: 4.3, numReviews: 10 },
  { name: 'Leather Crossbody Bag', description: 'Compact and stylish bag with ample space for daily essentials.', price: 64.0, brand: 'UrbanStyle', countInStock: 17, category: 'Fashion', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80', rating: 4.4, numReviews: 7 },
  { name: 'Slim Fit Shirt', description: 'Polished everyday shirt with a modern tailored fit.', price: 44.5, brand: 'Crestline', countInStock: 19, category: 'Fashion', image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80', rating: 4.2, numReviews: 6 },
  { name: 'Minimalist Sneakers', description: 'Clean and versatile sneakers for all-day wear.', price: 69.99, brand: 'SoleMate', countInStock: 22, category: 'Fashion', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80', rating: 4.5, numReviews: 8 },
  { name: 'Wool Knit Scarf', description: 'Soft and cozy scarf to complete winter outfits.', price: 34.0, brand: 'WinterLane', countInStock: 14, category: 'Fashion', image: 'https://images.unsplash.com/photo-1487412912498-0447578fcca8?auto=format&fit=crop&w=900&q=80', rating: 4.1, numReviews: 4 },
  { name: 'Ceramic Coffee Mug Set', description: 'Premium ceramic mugs perfect for morning coffee or tea.', price: 24.95, brand: 'Homecraft', countInStock: 30, category: 'Home & Kitchen', image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=80', rating: 4.2, numReviews: 6 },
  { name: 'Minimalist Desk Lamp', description: 'A modern desk lamp with adjustable brightness and warm lighting.', price: 39.99, brand: 'LumaHouse', countInStock: 22, category: 'Home & Kitchen', image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=900&q=80', rating: 4.1, numReviews: 4 },
  { name: 'Nonstick Cookware Set', description: 'Durable cookware designed for effortless cooking and cleanup.', price: 119.0, brand: 'CookEase', countInStock: 11, category: 'Home & Kitchen', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=900&q=80', rating: 4.6, numReviews: 9 },
  { name: 'Memory Foam Pillow', description: 'Supportive and breathable pillow for better rest.', price: 49.5, brand: 'SleepWell', countInStock: 16, category: 'Home & Kitchen', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80', rating: 4.4, numReviews: 5 },
  { name: 'Glass Food Storage Set', description: 'Stackable containers that keep your kitchen organized.', price: 29.0, brand: 'FreshBox', countInStock: 18, category: 'Home & Kitchen', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=80', rating: 4.3, numReviews: 5 },
  { name: 'Skincare Essentials Kit', description: 'Hydrating and nourishing skincare essentials for daily rituals.', price: 34.5, brand: 'GlowCare', countInStock: 14, category: 'Beauty & Personal Care', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=80', rating: 4.8, numReviews: 9 },
  { name: 'Hair Styling Tool Set', description: 'Professional styling tools for smooth, polished results at home.', price: 49.0, brand: 'Glossy', countInStock: 15, category: 'Beauty & Personal Care', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=80', rating: 4.6, numReviews: 8 },
  { name: 'Facial Roller Set', description: 'Gentle massage tools for a refreshing skincare routine.', price: 19.99, brand: 'PureGlow', countInStock: 20, category: 'Beauty & Personal Care', image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=900&q=80', rating: 4.2, numReviews: 4 },
  { name: 'Body Lotion Duo', description: 'Lightweight hydration for smooth, soft skin.', price: 24.0, brand: 'Velora', countInStock: 17, category: 'Beauty & Personal Care', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=80', rating: 4.4, numReviews: 6 },
  { name: 'Organic Lip Balm', description: 'Nourishing lip care with a subtle natural scent.', price: 8.99, brand: 'MintLeaf', countInStock: 25, category: 'Beauty & Personal Care', image: 'https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?auto=format&fit=crop&w=900&q=80', rating: 4.3, numReviews: 3 },
  { name: 'Running Shoes', description: 'Lightweight sneakers with cushioned support for daily runs.', price: 89.0, brand: 'SprintX', countInStock: 16, category: 'Sports & Outdoors', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80', rating: 4.6, numReviews: 14 },
  { name: 'Camping Backpack', description: 'Durable backpack built for weekend trips and outdoor adventures.', price: 74.99, brand: 'TrailBlaze', countInStock: 13, category: 'Sports & Outdoors', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80', rating: 4.5, numReviews: 5 },
  { name: 'Yoga Mat', description: 'Non-slip mat designed for comfort and stability.', price: 34.99, brand: 'FlexiFit', countInStock: 21, category: 'Sports & Outdoors', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80', rating: 4.4, numReviews: 7 },
  { name: 'Cycling Helmet', description: 'Lightweight protection for everyday rides and commuting.', price: 54.0, brand: 'RideSafe', countInStock: 12, category: 'Sports & Outdoors', image: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=900&q=80', rating: 4.7, numReviews: 6 },
  { name: 'Hiking Water Bottle', description: 'Insulated bottle that keeps drinks cold or hot.', price: 22.5, brand: 'TrailQuench', countInStock: 19, category: 'Sports & Outdoors', image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=80', rating: 4.2, numReviews: 4 },
  { name: 'Resistance Bands Set', description: 'Portable workout bands for strength training at home.', price: 19.99, brand: 'FitLoop', countInStock: 24, category: 'Sports & Outdoors', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80', rating: 4.3, numReviews: 5 },
  { name: 'Wireless Mouse', description: 'Reliable, ergonomic mouse with smooth tracking.', price: 24.99, brand: 'ClickLite', countInStock: 14, category: 'Electronics', image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=900&q=80', rating: 4.1, numReviews: 4 },
  { name: 'Travel Backpack', description: 'Compact design with smart compartments for everyday travel.', price: 54.99, brand: 'NomadPack', countInStock: 13, category: 'Fashion', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80', rating: 4.4, numReviews: 5 },
  { name: 'Ceramic Vase', description: 'Elegant decor piece for modern interiors.', price: 39.0, brand: 'DecorHouse', countInStock: 10, category: 'Home & Kitchen', image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=900&q=80', rating: 4.2, numReviews: 4 },
  { name: 'Aromatherapy Diffuser', description: 'Quiet diffuser with soft LED lighting for peaceful spaces.', price: 44.99, brand: 'CalmNest', countInStock: 12, category: 'Home & Kitchen', image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=900&q=80', rating: 4.5, numReviews: 6 },
  { name: 'Satin Sleep Mask', description: 'Soft and comfortable eye mask for restful sleep.', price: 14.99, brand: 'DreamEase', countInStock: 18, category: 'Beauty & Personal Care', image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=80', rating: 4.3, numReviews: 3 },
  { name: 'Trail Running Socks', description: 'Breathable socks designed for comfort on the move.', price: 15.0, brand: 'PeakStride', countInStock: 26, category: 'Sports & Outdoors', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80', rating: 4.4, numReviews: 4 },
  { name: 'Compact Instant Camera', description: 'Capture memories with a fun and portable instant camera.', price: 89.99, brand: 'Polaroid', countInStock: 8, category: 'Electronics', image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=900&q=80', rating: 4.6, numReviews: 7 },
  { name: 'Bamboo Cutting Board', description: 'Durable and stylish board for everyday meal prep.', price: 29.99, brand: 'EcoCraft', countInStock: 15, category: 'Home & Kitchen', image: 'https://images.unsplash.com/photo-1584269600517-1f7f6b6f1f12?auto=format&fit=crop&w=900&q=80', rating: 4.3, numReviews: 4 },
  { name: 'Daily Facial Cleanser', description: 'Gentle cleanser for fresh, balanced, and healthy-looking skin.', price: 18.5, brand: 'PureSkin', countInStock: 20, category: 'Beauty & Personal Care', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=80', rating: 4.5, numReviews: 5 },
  { name: 'Foldable Camping Chair', description: 'Portable chair built for convenience and comfort outdoors.', price: 49.99, brand: 'CampNest', countInStock: 11, category: 'Sports & Outdoors', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80', rating: 4.4, numReviews: 4 },
  { name: 'Leather Wallet', description: 'Minimalist wallet crafted for daily carry.', price: 39.0, brand: 'DapperCo', countInStock: 16, category: 'Fashion', image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=80', rating: 4.2, numReviews: 3 },
  { name: 'Smart Coffee Maker', description: 'Program your coffee routine from your phone.', price: 129.0, brand: 'BrewBot', countInStock: 7, category: 'Home & Kitchen', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80', rating: 4.8, numReviews: 8 },
];

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const categories = await Category.find({});
    const categoryMap = Object.fromEntries(categories.map((category) => [category.name, category._id]));
    const normalized = products.map((product) => ({
      ...product,
      category: categoryMap[product.category],
    }));
    await Product.deleteMany({});
    await Product.insertMany(normalized);
    const count = await Product.countDocuments();
    console.log(`✅ Seeded ${count} products.`);
    await mongoose.disconnect();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

run();
