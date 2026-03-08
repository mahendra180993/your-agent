# AI Chatbot Backend

Backend API server for the AI Chatbot application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
   - MongoDB connection string
   - AI API keys (OpenRouter, HuggingFace, or Ollama)
   - JWT secret
   - Admin credentials

4. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Chat Endpoints
- `POST /api/chat/` - Send a message
- `GET /api/chat/history?sessionId=xxx&website=xxx` - Get chat history
- `GET /api/chat/config/:website` - Get client configuration

### Client Management (Protected)
- `POST /api/clients/` - Create a new client
- `GET /api/clients/` - Get all clients
- `GET /api/clients/:website` - Get a specific client
- `PUT /api/clients/:website` - Update a client
- `DELETE /api/clients/:website` - Delete a client

### Admin Endpoints
- `POST /api/admin/login` - Admin login
- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/admin/chats` - Get all chat messages
- `GET /api/admin/sessions` - Get all sessions

## Environment Variables

See `.env.example` for all required environment variables.
