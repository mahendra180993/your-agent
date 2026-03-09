// src/services/clientService.js
import Client from '../models/Client.js';
import logger from '../utils/logger.js';

const normalizeWebsite = (website) => {
  if (!website) return '';
  let value = website.toString().toLowerCase().trim();
  // Strip protocol if admin accidentally includes full URL
  value = value.replace(/^https?:\/\//, '');
  // Remove trailing slashes
  value = value.replace(/\/+$/, '');
  return value;
};

class ClientService {
  async getClientByWebsite(website) {
    try {
      const normalizedWebsite = normalizeWebsite(website);
      const client = await Client.findOne({ 
        website: normalizedWebsite, 
        isActive: true 
      });
      
      if (!client) {
        logger.warn(`Client not found for website: ${normalizedWebsite}`);
      }
      
      return client;
    } catch (error) {
      logger.error(`Error fetching client: ${error.message}`);
      throw error;
    }
  }

  async createClient(clientData) {
    try {
      const normalizedWebsite = normalizeWebsite(clientData.website);
      const client = new Client({
        ...clientData,
        website: normalizedWebsite,
      });
      await client.save();
      logger.info(`Client created: ${normalizedWebsite}`);
      return client;
    } catch (error) {
      if (error.code === 11000) {
        throw new Error('Client with this website already exists');
      }
      logger.error(`Error creating client: ${error.message}`);
      throw error;
    }
  }

  async updateClient(website, updateData) {
    try {
      const rawWebsite = (website || '').toString().toLowerCase().trim();
      const normalizedWebsite = normalizeWebsite(rawWebsite);
      if (updateData.website) {
        updateData.website = normalizeWebsite(updateData.website);
      }
      const client = await Client.findOneAndUpdate(
        {
          $or: [
            { website: normalizedWebsite },
            { website: rawWebsite },
          ],
        },
        { $set: updateData },
        { new: true, runValidators: true }
      );
      
      if (!client) {
        throw new Error('Client not found');
      }
      
      logger.info(`Client updated: ${normalizedWebsite}`);
      return client;
    } catch (error) {
      logger.error(`Error updating client: ${error.message}`);
      throw error;
    }
  }

  async getAllClients() {
    try {
      return await Client.find().sort({ createdAt: -1 });
    } catch (error) {
      logger.error(`Error fetching all clients: ${error.message}`);
      throw error;
    }
  }

  async deleteClient(website) {
    try {
      const normalizedWebsite = normalizeWebsite(website);
      const client = await Client.findOneAndDelete({ website: normalizedWebsite });
      
      if (!client) {
        throw new Error('Client not found');
      }
      
      logger.info(`Client deleted: ${normalizedWebsite}`);
      return client;
    } catch (error) {
      logger.error(`Error deleting client: ${error.message}`);
      throw error;
    }
  }
}

export default new ClientService();
