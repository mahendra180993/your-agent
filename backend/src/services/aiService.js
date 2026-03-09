// src/services/aiService.js
import axios from 'axios';
import logger from '../utils/logger.js';

class AIService {
  constructor() {
    this.provider = process.env.AI_PROVIDER || 'openrouter';
    this.setupProvider();
  }

  setupProvider() {
    switch (this.provider) {
      case 'openrouter':
        this.apiKey = process.env.OPENROUTER_API_KEY?.trim();
        this.model = process.env.OPENROUTER_MODEL || 'openai/gpt-3.5-turbo';
        this.baseURL = 'https://openrouter.ai/api/v1';
        if (!this.apiKey || this.apiKey === 'demo_key' || this.apiKey.length < 10) {
          logger.warn(`OpenRouter API key is missing or invalid. Key length: ${this.apiKey?.length || 0}`);
        } else {
          logger.info(`OpenRouter API key loaded (length: ${this.apiKey.length})`);
        }
        break;
      case 'huggingface':
        this.apiKey = process.env.HUGGINGFACE_API_KEY;
        this.model = process.env.HUGGINGFACE_MODEL || 'microsoft/DialoGPT-medium';
        this.baseURL = 'https://api-inference.huggingface.co/models';
        break;
      case 'ollama':
        this.model = process.env.OLLAMA_MODEL || 'llama2';
        this.baseURL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
        break;
      case 'gemini':
        this.apiKey = process.env.GEMINI_API_KEY;
        this.model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
        this.baseURL = 'https://generativelanguage.googleapis.com/v1beta';
        if (!this.apiKey || this.apiKey.length < 20) {
          logger.warn(
            `Gemini API key is missing or looks invalid. Length: ${this.apiKey?.length || 0}`,
          );
        } else {
          logger.info(`Gemini API key loaded (length: ${this.apiKey.length})`);
        }
        break;
      default:
        this.provider = 'openrouter';
        this.setupProvider();
    }
  }

  async generateResponse(userMessage, clientConfig) {
    try {
      logger.info(`[AI Service] Generating response with provider: ${this.provider}`);
      logger.info(`[AI Service] API Key present: ${!!this.apiKey}, length: ${this.apiKey?.length || 0}`);
      const systemPrompt = this.buildSystemPrompt(clientConfig);
      logger.info(`[AI Service] System prompt length: ${systemPrompt.length}`);
      
      switch (this.provider) {
        case 'openrouter':
          logger.info(`[AI Service] Calling OpenRouter...`);
          const result = await this.callOpenRouter(userMessage, systemPrompt);
          logger.info(`[AI Service] OpenRouter returned: ${result?.substring(0, 50)}...`);
          return result;
        case 'huggingface':
          return await this.callHuggingFace(userMessage, systemPrompt);
        case 'ollama':
          return await this.callOllama(userMessage, systemPrompt);
        case 'gemini':
          return await this.callGemini(userMessage, systemPrompt);
        default:
          throw new Error('Unsupported AI provider');
      }
    } catch (error) {
      logger.error(`[AI Service] Error in generateResponse: ${error.message}`);
      logger.error(`[AI Service] Error stack: ${error.stack}`);
      throw error;
    }
  }

  buildSystemPrompt(clientConfig) {
    const toneInstructions = {
      formal: 'Use formal language and professional tone.',
      friendly: 'Use warm, friendly, and conversational language.',
      sales: 'Be persuasive, highlight benefits, and encourage action.',
      casual: 'Use casual, relaxed language like talking to a friend.',
      professional: 'Be professional yet approachable.',
    };

    const toneInstruction = toneInstructions[clientConfig.tone] || toneInstructions.friendly;
    const businessContext = clientConfig.businessType 
      ? `The business type is: ${clientConfig.businessType}. `
      : '';

    return `${clientConfig.systemPrompt || 'You are a helpful assistant.'} ${businessContext}${toneInstruction} Keep responses concise and helpful.`;
  }

  async callOpenRouter(userMessage, systemPrompt) {
    try {
      // Re-check API key in case it wasn't loaded at initialization
      if (!this.apiKey || this.apiKey === 'demo_key') {
        // Try to reload from env
        this.apiKey = process.env.OPENROUTER_API_KEY?.trim();
        if (!this.apiKey || this.apiKey === 'demo_key') {
          logger.error(`OpenRouter API key is not configured. Check your .env file.`);
          throw new Error('OpenRouter API key is not configured');
        }
        logger.info(`OpenRouter API key reloaded (length: ${this.apiKey.length})`);
      }

      logger.info(`Calling OpenRouter API with model: ${this.model}`);
      
      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: this.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage },
          ],
          temperature: 0.7,
          max_tokens: 500,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': process.env.APP_URL || 'https://yourdomain.com',
            'X-Title': 'AI Chatbot',
          },
          timeout: 30000,
        }
      );

      if (!response.data || !response.data.choices || !response.data.choices[0]) {
        logger.error('OpenRouter API: Invalid response structure');
        throw new Error('Invalid API response');
      }
      return response.data.choices[0].message.content.trim();
    } catch (error) {
      if (error.response) {
        logger.error(`OpenRouter API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
        logger.error(`Request URL: ${this.baseURL}/chat/completions`);
        logger.error(`API Key present: ${!!this.apiKey}, length: ${this.apiKey?.length || 0}`);
      } else if (error.request) {
        logger.error(`OpenRouter API: No response received - ${error.message}`);
        logger.error(`Request was made but no response received`);
      } else {
        logger.error(`OpenRouter API Error: ${error.message}`);
        logger.error(`Error stack: ${error.stack}`);
      }
      throw error; // Re-throw the original error to preserve details
    }
  }

  async callHuggingFace(userMessage, systemPrompt) {
    try {
      const response = await axios.post(
        `${this.baseURL}/${this.model}`,
        {
          inputs: {
            past_user_inputs: [],
            generated_responses: [],
            text: `${systemPrompt}\n\nUser: ${userMessage}\nAssistant:`,
          },
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 30000,
        }
      );

      return response.data.generated_text || 'I apologize, but I could not generate a response.';
    } catch (error) {
      if (error.response) {
        logger.error(`HuggingFace API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
      }
      throw new Error('Failed to generate AI response');
    }
  }

  async callOllama(userMessage, systemPrompt) {
    try {
      const response = await axios.post(
        `${this.baseURL}/api/generate`,
        {
          model: this.model,
          prompt: `${systemPrompt}\n\nUser: ${userMessage}\nAssistant:`,
          stream: false,
        },
        {
          timeout: 60000, // Ollama can be slower
        }
      );

      return response.data.response || 'I apologize, but I could not generate a response.';
    } catch (error) {
      logger.error(`Ollama API Error: ${error.message}`);
      throw new Error('Failed to generate AI response');
    }
  }

  async callGemini(userMessage, systemPrompt) {
    try {
      if (!this.apiKey) {
        logger.error('Gemini API key is not configured. Check your .env / Render env.');
        throw new Error('Gemini API key is not configured');
      }

      const url = `${this.baseURL}/models/${this.model}:generateContent?key=${this.apiKey}`;

      const prompt = `${systemPrompt}\n\nUser: ${userMessage}\nAssistant:`;

      const response = await axios.post(
        url,
        {
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }],
            },
          ],
        },
        {
          timeout: 30000,
        },
      );

      const candidates = response.data?.candidates;
      const parts = candidates?.[0]?.content?.parts;
      const text = parts?.[0]?.text;

      if (!text) {
        logger.error('Gemini API: Invalid response structure');
        throw new Error('Invalid Gemini API response');
      }

      return text.trim();
    } catch (error) {
      if (error.response) {
        logger.error(`Gemini API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
      } else {
        logger.error(`Gemini API Error: ${error.message}`);
      }
      throw new Error('Failed to generate AI response');
    }
  }

  getFallbackMessage() {
    return "I'm sorry, I'm having trouble processing your request right now. Please try again in a moment.";
  }
}

export default new AIService();
