// scripts/create-user.js
// Script to create admin users
// Usage: node scripts/create-user.js <email> <password> <name> [role]

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/User.js';

dotenv.config({ path: './.env' });

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
