# AI Chatbot Application

A full-stack, production-ready AI chatbot application that can be integrated into multiple client websites. Built with React, Node.js, Express, and MongoDB.

## Features

- 🤖 **AI-Powered Chat** - Integrates with OpenRouter, HuggingFace, or Ollama
- 🎨 **Modern UI** - WhatsApp/Intercom-style chat interface
- 📱 **Fully Responsive** - Works perfectly on mobile, tablet, and desktop
- 🌓 **Dark Mode** - Built-in light and dark theme support
- 🔒 **Secure** - Rate limiting, CORS, spam protection
- 👥 **Multi-Client** - Support for multiple websites with custom configurations
- 📊 **Admin Panel** - Dashboard for managing clients and viewing chat history
- 🚀 **Embeddable** - Single script tag integration for clients
- 💾 **Local Storage** - Conversations saved in browser
- ⚡ **Performance** - Optimized API calls and lazy loading

## Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router

### Backend
- Node.js
- Express
- MongoDB (Mongoose)
- JWT Authentication

### AI Integration
- OpenRouter (default)
- HuggingFace Inference API
- Ollama (local)

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- AI API key (OpenRouter, HuggingFace, or Ollama)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AI-BOT
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   # Create .env file with VITE_API_BASE_URL=http://localhost:5000/api
   npm run dev
   ```

4. **Build Embed Script** (optional)
   ```bash
   cd embed
   npm install
   npm run build
   ```

## Project Structure

```
AI-BOT/
├── backend/          # Express API server
├── frontend/         # React admin panel and chat widget
├── embed/            # Embeddable chatbot script
├── docs/             # Documentation
└── README.md
```

See project folders for complete structure.

## Configuration

### Backend Environment Variables

See `backend/.env.example` for all required variables:

- `MONGODB_URI` - MongoDB connection string
- `AI_PROVIDER` - openrouter, huggingface, or ollama
- `OPENROUTER_API_KEY` - Your OpenRouter API key
- `JWT_SECRET` - Secret for JWT tokens
- `ADMIN_EMAIL` - Admin login email
- `ADMIN_PASSWORD` - Admin login password

### Frontend Environment Variables

- `VITE_API_BASE_URL` - Backend API URL (default: http://localhost:5000/api)

## Usage

### For Administrators

1. **Access Admin Panel**
   - Navigate to `http://localhost:5173/admin`
   - Login with admin credentials

2. **Add a Client**
   - Go to "Clients" tab
   - Click "Add Client"
   - Enter website domain and configuration
   - Save

3. **View Chat History**
   - Go to "Chat History" tab
   - Filter by website or session ID
   - View all conversations

### For Clients (Website Owners)

1. **Get Integration Code**
   ```html
   <script src="https://your-backend-url.com/chatbot.js"></script>
   ```

2. **Add to Website**
   - Place script tag before closing `</body>` tag
   - Chatbot will automatically appear

See [HOW_TO_RUN.md](./HOW_TO_RUN.md) for project flow and usage guide.

## API Documentation

API endpoints are documented in the backend README and code comments.

### Quick API Examples

**Send a message:**
```bash
curl -X POST https://your-backend-url.com/api/chat/ \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello",
    "website": "example.com"
  }'
```

**Get client config:**
```bash
curl https://your-backend-url.com/api/chat/config/example.com
```

## Deployment

**100% Free Deployment Available!**

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment guide.

### Quick Deploy (Single Server)

1. Push code to GitHub
2. Deploy on Render (see DEPLOYMENT.md)
3. Add environment variables
4. Done!

**Total Cost**: $0/month (Render Free + MongoDB Atlas Free)

## Features in Detail

### Multi-Client Support
Each website can have:
- Custom system prompt
- Different tone (formal, friendly, sales, etc.)
- Custom welcome message
- Custom styling (colors, position)
- Enable/disable toggle

### Security Features
- Rate limiting (prevents abuse)
- CORS protection
- Input validation
- Spam protection
- JWT authentication for admin

### Performance Optimizations
- Lazy loading
- Debounced input
- Local storage caching
- Optimized database queries
- Efficient API calls

## Development

### Running in Development

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev

# Terminal 3 - Build embed (watch mode)
cd embed
npm run dev
```

### Testing

```bash
# Backend tests (when implemented)
cd backend
npm test

# Frontend tests (when implemented)
cd frontend
npm test
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Documentation

- **[HOW_TO_RUN.md](./HOW_TO_RUN.md)** - How to run locally and project flow
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Production deployment guide
- **[SKILLS.md](./SKILLS.md)** - Technologies and skills used

## Support

For issues, questions, or contributions:
- Check documentation files
- Review code comments
- Open an issue on GitHub

## Roadmap

- [ ] Webhook support
- [ ] Analytics dashboard
- [ ] Multi-language support
- [ ] Voice input/output
- [ ] File upload support
- [ ] Custom AI model training
- [ ] A/B testing for prompts
- [ ] Export chat history
- [ ] Email notifications

## Acknowledgments

- Built with modern web technologies
- Inspired by Intercom and WhatsApp chat interfaces
- Uses free AI APIs for cost-effective operation
