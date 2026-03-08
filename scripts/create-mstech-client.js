// scripts/create-mstech-client.js
// Script to create MS Tech Solution client configuration
// Run with: node scripts/create-mstech-client.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Client from '../backend/src/models/Client.js';

dotenv.config({ path: './backend/.env' });

const createMSTechClient = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if client already exists
    const existingClient = await Client.findOne({ website: 'mstechsolution.in' });
    
    if (existingClient) {
      console.log('Client already exists. Updating...');
      existingClient.businessType = 'Corporate IT & Software Services';
      existingClient.systemPrompt = `You are a helpful customer support assistant for MS Tech Solution, a leading corporate IT and software services company based in Kukatpally, Hyderabad. 

Your role is to:
- Provide information about our services: Website Designing, Web Development, Digital Marketing, and Enterprise Solutions
- Answer questions about our company and expertise
- Help potential clients understand how we can transform their business with cutting-edge technology
- Schedule consultations or connect clients with our team
- Provide information about our 24/7 support services

Be professional, friendly, and solution-oriented. Always emphasize our commitment to scalable, secure, and high-performance solutions.`;
      existingClient.tone = 'professional';
      existingClient.welcomeMessage = 'Hello! Welcome to MS Tech Solution. I\'m here to help you learn about our enterprise-grade software solutions, web development, and digital transformation services. How can I assist you today?';
      existingClient.isActive = true;
      await existingClient.save();
      console.log('✅ Client updated successfully!');
    } else {
      // Create new client
      const client = new Client({
        website: 'mstechsolution.in',
        businessType: 'Corporate IT & Software Services',
        systemPrompt: `You are a helpful customer support assistant for MS Tech Solution, a leading corporate IT and software services company based in Kukatpally, Hyderabad. 

Your role is to:
- Provide information about our services: Website Designing, Web Development, Digital Marketing, and Enterprise Solutions
- Answer questions about our company and expertise
- Help potential clients understand how we can transform their business with cutting-edge technology
- Schedule consultations or connect clients with our team
- Provide information about our 24/7 support services

Be professional, friendly, and solution-oriented. Always emphasize our commitment to scalable, secure, and high-performance solutions.`,
        tone: 'professional',
        welcomeMessage: 'Hello! Welcome to MS Tech Solution. I\'m here to help you learn about our enterprise-grade software solutions, web development, and digital transformation services. How can I assist you today?',
        autoGreetDelay: 5000,
        offlineMessage: 'Sorry, I\'m currently offline. Please contact us at support@mstechsolution.in or visit our website for more information.',
        isActive: true,
        customStyles: {
          primaryColor: '#007bff',
          position: 'bottom-right',
        },
      });

      await client.save();
      console.log('✅ Client created successfully!');
    }

    console.log('\n📋 Client Configuration:');
    console.log('Website: mstechsolution.in');
    console.log('Business Type: Corporate IT & Software Services');
    console.log('Tone: Professional');
    console.log('Status: Active\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

createMSTechClient();
