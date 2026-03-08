// src/controllers/clientController.js
import clientService from '../services/clientService.js';
import logger from '../utils/logger.js';

export const createClient = async (req, res) => {
  try {
    // Check if MongoDB is connected
    const mongoose = (await import('mongoose')).default;
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        error: 'Database not connected. Please ensure MongoDB is running and restart the backend server.',
        details: 'MongoDB connection is required to create clients. See MONGODB_FIX.md for setup instructions.',
      });
    }

    const client = await clientService.createClient(req.body);
    res.status(201).json({
      success: true,
      data: client,
    });
  } catch (error) {
    logger.error(`Create Client Error: ${error.message}`);
    
    // Provide helpful error message for timeout
    if (error.message.includes('buffering timed out') || error.message.includes('timeout')) {
      return res.status(503).json({
        success: false,
        error: 'Database connection timeout. MongoDB is not running or not accessible.',
        details: 'Please install MongoDB locally or use MongoDB Atlas. See MONGODB_FIX.md for instructions.',
      });
    }
    
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

export const getAllClients = async (req, res) => {
  try {
    const clients = await clientService.getAllClients();
    res.json({
      success: true,
      data: clients,
    });
  } catch (error) {
    logger.error(`Get All Clients Error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

export const getClient = async (req, res) => {
  try {
    const { website } = req.params;
    const client = await clientService.getClientByWebsite(website);
    
    if (!client) {
      return res.status(404).json({
        success: false,
        error: 'Client not found',
      });
    }
    
    res.json({
      success: true,
      data: client,
    });
  } catch (error) {
    logger.error(`Get Client Error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

export const updateClient = async (req, res) => {
  try {
    const { website } = req.params;
    const client = await clientService.updateClient(website, req.body);
    res.json({
      success: true,
      data: client,
    });
  } catch (error) {
    logger.error(`Update Client Error: ${error.message}`);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

export const deleteClient = async (req, res) => {
  try {
    const { website } = req.params;
    await clientService.deleteClient(website);
    res.json({
      success: true,
      message: 'Client deleted successfully',
    });
  } catch (error) {
    logger.error(`Delete Client Error: ${error.message}`);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};
