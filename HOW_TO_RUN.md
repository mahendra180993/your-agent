# How to Run the Project

Complete guide to run the AI Chatbot application locally and understand the project flow.

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ installed
- **MongoDB Atlas** account (free) or local MongoDB
- **AI API Key** (OpenRouter, HuggingFace, or Ollama)

### Step 1: Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Install embed script dependencies (optional)
cd ../embed
npm install
```

### Step 2: Configure Environment

**Backend Configuration** (`backend/.env`):

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-chatbot?retryWrites=true&w=majority

# Server
PORT=5000
NODE_ENV=development

# AI Provider
AI_PROVIDER=openrouter
OPENROUTER_API_KEY=your-api-key-here

# Authentication
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123

# CORS (for local development)
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

**Frontend Configuration** (`frontend/.env`):

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### Step 3: Start the Application

**Option 1: Using the Start Script**

```bash
# From project root
bash START_SERVERS.sh
```

**Option 2: Manual Start**

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Step 4: Access the Application

- **Frontend**: http://localhost:5173
- **Admin Panel**: http://localhost:5173/admin/login
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/health

---

## 📊 Project Flow

### Application Architecture

```
┌─────────────────┐
│   Client Site   │
│  (Any Website)  │
└────────┬────────┘
         │
         │ <script src="chatbot.js">
         │
         ▼
┌─────────────────┐
│  Embed Script   │
│  (chatbot.js)   │
└────────┬────────┘
         │
         │ API Calls
         │
         ▼
┌─────────────────┐      ┌──────────────┐
│   Backend API   │◄─────┤  MongoDB     │
│   (Express)     │      │  Atlas       │
└────────┬────────┘      └──────────────┘
         │
         │ AI API Calls
         │
         ▼
┌─────────────────┐
│  AI Provider    │
│ (OpenRouter/    │
│  HuggingFace)   │
└─────────────────┘
```

### User Flow

1. **Client Website Integration**
   - Website owner adds `<script src="chatbot.js">` to their site
   - Chatbot widget appears on the website

2. **User Interaction**
   - Visitor clicks chat button
   - Types a message
   - Message sent to backend API

3. **Backend Processing**
   - Backend receives message
   - Identifies client website from domain
   - Loads client configuration (tone, prompt, etc.)
   - Calls AI API with custom prompt
   - Saves conversation to MongoDB

4. **Response Delivery**
   - AI response sent back to frontend
   - Message displayed in chat widget
   - Conversation saved in browser localStorage

### Admin Flow

1. **Login**
   - Admin accesses `/admin/login`
   - Authenticates with JWT

2. **Dashboard**
   - View statistics (total chats, active clients, etc.)

3. **Client Management**
   - Add new client websites
   - Configure AI personality per client
   - Enable/disable clients

4. **Chat History**
   - View all conversations
   - Filter by website or session
   - Export data

---

## 🔄 Development Workflow

### Local Development

1. **Start Backend**
   ```bash
   cd backend
   npm run dev  # Uses nodemon for auto-reload
   ```

2. **Start Frontend**
   ```bash
   cd frontend
   npm run dev  # Vite dev server with HMR
   ```

3. **Build Embed Script** (when needed)
   ```bash
   cd embed
   npm run build
   cp dist/chatbot.js ../backend/public/chatbot.js
   ```

### Testing Flow

1. **Test Backend API**
   ```bash
   curl http://localhost:5000/health
   ```

2. **Test Frontend**
   - Open http://localhost:5173
   - Check admin panel login
   - Test chatbot widget

3. **Test Embed Script**
   - Build embed script
   - Create test HTML page
   - Include script tag
   - Test chatbot functionality

---

## 📁 Project Structure Flow

```
AI-BOT/
├── backend/                 # Express API Server
│   ├── src/
│   │   ├── server.js       # Main server entry point
│   │   ├── routes/         # API route handlers
│   │   ├── controllers/    # Business logic
│   │   ├── models/         # MongoDB schemas
│   │   ├── services/       # AI service, client service
│   │   └── middleware/     # Auth, CORS, rate limiting
│   ├── config/             # Database configuration
│   ├── public/             # Static files (chatbot.js)
│   └── scripts/            # Utility scripts
│
├── frontend/               # React Application
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── ChatWidget/ # Chatbot widget
│   │   │   └── AdminPanel/ # Admin dashboard
│   │   ├── hooks/          # Custom React hooks
│   │   ├── utils/          # Utilities
│   │   └── App.jsx         # Main app component
│   └── dist/               # Built files (after npm run build)
│
└── embed/                  # Embeddable Script
    ├── src/
    │   └── chatbot.js      # Standalone chatbot script
    └── dist/               # Compiled script
```

---

## 🔧 Common Tasks

### Add a New Client

1. Login to admin panel
2. Go to "Client Management"
3. Click "Add Client"
4. Enter:
   - Website domain
   - Business type
   - System prompt
   - Tone (formal/friendly/sales)
   - Welcome message
5. Save

### View Chat History

1. Login to admin panel
2. Go to "Chat History"
3. Filter by:
   - Website domain
   - Session ID
   - Date range
4. View conversations

### Update AI Configuration

1. Edit `backend/.env`
2. Change `AI_PROVIDER` (openrouter/huggingface/ollama)
3. Update API key
4. Restart backend

### Build for Production

```bash
# Build frontend
cd frontend
npm run build

# Build embed script
cd ../embed
npm run build
cp dist/chatbot.js ../backend/public/chatbot.js

# Start production server
cd ../backend
npm start
```

---

## 🐛 Troubleshooting

### Backend won't start
- Check MongoDB connection string
- Verify all environment variables are set
- Check port 5000 is not in use

### Frontend shows errors
- Verify backend is running
- Check `VITE_API_BASE_URL` in frontend/.env
- Clear browser cache

### Chatbot not responding
- Check AI API key is valid
- Verify client is registered in database
- Check backend logs for errors

### CORS errors
- Update `ALLOWED_ORIGINS` in backend/.env
- Include your frontend URL

---

## 📝 Next Steps

1. **Set up MongoDB Atlas** (if not done)
2. **Get AI API Key** from OpenRouter or HuggingFace
3. **Configure environment variables**
4. **Start the application**
5. **Test the chatbot**
6. **Deploy to production** (see DEPLOYMENT.md)

---

**Need help?** Check the README.md or deployment guide.
