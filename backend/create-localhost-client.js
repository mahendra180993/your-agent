import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Client from './src/models/Client.js';

dotenv.config();

const createClient = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if client exists
    const existing = await Client.findOne({ website: 'localhost' });
    if (existing) {
      console.log('✅ Client for localhost already exists');
      console.log('   Status:', existing.isActive ? 'Active' : 'Inactive');
      if (!existing.isActive) {
        existing.isActive = true;
        await existing.save();
        console.log('✅ Activated client');
      }
      process.exit(0);
    }

    // Create new client
    const client = new Client({
      website: 'localhost',
      businessType: 'Testing',
      systemPrompt: 'You are a helpful assistant. Provide friendly and professional responses.',
      tone: 'friendly',
      welcomeMessage: 'Hello! How can I help you today?',
      isActive: true,
    });

    await client.save();
    console.log('✅ Client created for localhost');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

createClient();
