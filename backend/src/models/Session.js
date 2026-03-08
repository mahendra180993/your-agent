// src/models/Session.js
import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    website: {
      type: String,
      required: true,
      index: true,
    },
    metadata: {
      userAgent: String,
      ipAddress: String,
      referrer: String,
      firstVisit: {
        type: Date,
        default: Date.now,
      },
      lastActivity: {
        type: Date,
        default: Date.now,
      },
    },
    messageCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
sessionSchema.index({ website: 1, isActive: 1, 'metadata.lastActivity': -1 });

const Session = mongoose.model('Session', sessionSchema);

export default Session;
