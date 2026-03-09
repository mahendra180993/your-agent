// src/models/Client.js
import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema(
  {
    website: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    businessType: {
      type: String,
      default: 'general',
    },
    systemPrompt: {
      type: String,
      default: 'You are a helpful assistant. Provide friendly and professional responses.',
    },
    tone: {
      type: String,
      enum: ['formal', 'friendly', 'sales', 'casual', 'professional'],
      default: 'friendly',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    welcomeMessage: {
      type: String,
      default: 'Hello! How can I help you today?',
    },
    launcherText: {
      type: String,
      default: '',
    },
    headerTitle: {
      type: String,
      default: 'Chat Support',
    },
    logoUrl: {
      type: String,
      default: '',
    },
    autoGreetDelay: {
      type: Number,
      default: 5000, // 5 seconds in milliseconds
    },
    offlineMessage: {
      type: String,
      default: 'Sorry, I\'m currently offline. Please try again later.',
    },
    customStyles: {
      primaryColor: {
        type: String,
        default: '#007bff',
      },
      position: {
        type: String,
        enum: ['bottom-right', 'bottom-left'],
        default: 'bottom-right',
      },
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster lookups
clientSchema.index({ website: 1, isActive: 1 });

const Client = mongoose.model('Client', clientSchema);

export default Client;
