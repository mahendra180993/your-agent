// src/models/ChatMessage.js
import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    website: {
      type: String,
      required: true,
      index: true,
    },
    message: {
      type: String,
      required: true,
    },
    reply: {
      type: String,
      required: function() {
        // Only required for bot messages
        return this.sender === 'bot';
      },
      default: '',
    },
    sender: {
      type: String,
      enum: ['user', 'bot'],
      required: true,
    },
    metadata: {
      userAgent: String,
      ipAddress: String,
      referrer: String,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient queries
chatMessageSchema.index({ website: 1, sessionId: 1, createdAt: -1 });
chatMessageSchema.index({ createdAt: -1 });

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

export default ChatMessage;
