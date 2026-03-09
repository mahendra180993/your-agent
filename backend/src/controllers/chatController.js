// src/controllers/chatController.js
import mongoose from 'mongoose';
import ChatMessage from '../models/ChatMessage.js';
import Session from '../models/Session.js';
import clientService from '../services/clientService.js';
import aiService from '../services/aiService.js';
import logger from '../utils/logger.js';
import { v4 as uuidv4 } from 'uuid';

// Generate or get session ID
const getOrCreateSession = async (sessionId, website, req) => {
  if (sessionId) {
    let session = await Session.findOne({ sessionId });
    if (session) {
      // Update last activity
      session.metadata.lastActivity = new Date();
      await session.save();
      return session;
    }
  }

  // Create new session
  const newSessionId = sessionId || uuidv4();
  const session = new Session({
    sessionId: newSessionId,
    website: website.toLowerCase().trim(),
    metadata: {
      userAgent: req.headers['user-agent'],
      ipAddress: req.ip || req.connection.remoteAddress,
      referrer: req.headers.referer,
    },
  });
  await session.save();
  return session;
};

export const sendMessage = async (req, res) => {
  try {
    const { message, website, sessionId } = req.body;

    // Validate input
    if (!message || !website) {
      return res.status(400).json({
        success: false,
        error: 'Message and website are required',
      });
    }

    // Avoid hanging when MongoDB is not connected (e.g. cold start)
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        error: 'Service is starting up. Please try again in a moment.',
      });
    }

    // Get or create session
    const session = await getOrCreateSession(sessionId, website, req);

    // Get client configuration
    const client = await clientService.getClientByWebsite(website);
    
    if (!client) {
      return res.status(404).json({
        success: false,
        error: 'Client not found or inactive',
      });
    }

    // Basic spam protection - check message length and content
    if (message.length > 1000) {
      return res.status(400).json({
        success: false,
        error: 'Message too long',
      });
    }

    // Save user message (no reply needed for user messages)
    const userMessage = new ChatMessage({
      sessionId: session.sessionId,
      website: website.toLowerCase().trim(),
      message,
      reply: '', // Empty for user messages
      sender: 'user',
      metadata: {
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip || req.connection.remoteAddress,
        referrer: req.headers.referer,
      },
    });
    await userMessage.save();

    // Generate AI response
    let aiReply;
    try {
      logger.info(`Generating AI response for message: "${message.substring(0, 50)}..."`);
      logger.info(`Client config: ${JSON.stringify({
        website: client.website,
        tone: client.tone,
        businessType: client.businessType,
        hasSystemPrompt: !!client.systemPrompt
      })}`);
      
      // Convert Mongoose document to plain object if needed
      const clientConfig = client.toObject ? client.toObject() : client;
      
      aiReply = await aiService.generateResponse(message, clientConfig);
      logger.info(`AI response generated successfully (length: ${aiReply?.length || 0})`);
    } catch (error) {
      logger.error(`AI Service Error: ${error.message}`);
      logger.error(`Error details: ${error.stack}`);
      logger.error(`Falling back to offline message`);
      aiReply = client.offlineMessage || aiService.getFallbackMessage();
    }

    // Save bot reply
    const botMessage = new ChatMessage({
      sessionId: session.sessionId,
      website: website.toLowerCase().trim(),
      message: message, // Keep user message for context
      reply: aiReply,
      sender: 'bot',
      metadata: {
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip || req.connection.remoteAddress,
        referrer: req.headers.referer,
      },
    });
    await botMessage.save();

    // Update session message count
    session.messageCount += 1;
    session.metadata.lastActivity = new Date();
    await session.save();

    res.json({
      success: true,
      reply: aiReply,
      sessionId: session.sessionId,
    });
  } catch (error) {
    logger.error(`Chat Controller Error: ${error.message}`);
    logger.error(`Stack: ${error.stack}`);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

export const getChatHistory = async (req, res) => {
  try {
    const { sessionId, website } = req.query;

    if (!sessionId || !website) {
      return res.status(400).json({
        success: false,
        error: 'Session ID and website are required',
      });
    }

    const messages = await ChatMessage.find({
      sessionId,
      website: website.toLowerCase().trim(),
    })
      .sort({ createdAt: 1 })
      .select('message reply sender createdAt')
      .limit(100);

    res.json({
      success: true,
      messages,
    });
  } catch (error) {
    logger.error(`Get Chat History Error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

export const getClientConfig = async (req, res) => {
  try {
    const { website } = req.params;

    if (!website) {
      return res.status(400).json({
        success: false,
        error: 'Website is required',
      });
    }

    const client = await clientService.getClientByWebsite(website);

    if (!client) {
      return res.status(404).json({
        success: false,
        error: 'Client not found',
      });
    }

    // Return only necessary config for frontend
    res.json({
      success: true,
      config: {
        welcomeMessage: client.welcomeMessage,
        headerTitle: client.headerTitle,
        logoUrl: client.logoUrl,
        launcherText: client.launcherText,
        autoGreetDelay: client.autoGreetDelay,
        offlineMessage: client.offlineMessage,
        customStyles: client.customStyles,
        isActive: client.isActive,
      },
    });
  } catch (error) {
    logger.error(`Get Client Config Error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};
