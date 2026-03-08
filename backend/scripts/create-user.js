// scripts/create-user.js
// Script to create admin users (stored in MongoDB; login uses these when DB is connected).
// Usage: npm run create-user -- <email> <password> <name> [role]
//        Or from backend folder: node scripts/create-user.js <email> <password> <name> [role]
// Example: npm run create-user -- second@example.com SecurePass123 "Second Admin" admin

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../src/models/User.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const createUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get arguments
    const args = process.argv.slice(2);
    if (args.length < 3) {
      console.log('Usage: node scripts/create-user.js <email> <password> <name> [role]');
      console.log('Example: node scripts/create-user.js admin@example.com password123 "Admin User" admin');
      process.exit(1);
    }

    const [email, password, name, role = 'admin'] = args;

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      console.log('❌ User with this email already exists');
      process.exit(1);
    }

    // Create user
    const user = new User({
      email: email.toLowerCase().trim(),
      password,
      name,
      role,
      isActive: true,
    });

    await user.save();

    console.log('✅ User created successfully!');
    console.log('');
    console.log('📋 User Details:');
    console.log(`   Email: ${user.email}`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Active: ${user.isActive}`);
    console.log('');
    console.log('🔑 You can now login with these credentials');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

createUser();
