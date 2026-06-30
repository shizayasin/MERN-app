import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import connectDB from './config/db.js';
import User from './models/userModel.js';
import bcrypt from 'bcryptjs';

await connectDB();

const email = process.argv[2] || 'admin@example.com';
const username = process.argv[3] || 'admin';
const password = process.argv[4] || 'Admin123!';

let user = await User.findOne({ email });
if (user) {
  user.isAdmin = true;
  await user.save();
  console.log(JSON.stringify({ action: 'updated', email: user.email, id: user._id }));
} else {
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);
  user = await User.create({ username, email, password: hashed, isAdmin: true });
  console.log(JSON.stringify({ action: 'created', email: user.email, id: user._id }));
}

process.exit(0);
