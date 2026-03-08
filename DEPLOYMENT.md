# Deployment Guide

Complete guide to deploy your AI Chatbot application to production (100% FREE).

---

## 🎯 Deployment Options

### Option 1: Single Server (Recommended for Simplicity)
Deploy everything on **Render** - Backend + Frontend + Chatbot Script

### Option 2: Separate Servers
Deploy Backend on **Render** and Frontend on **Netlify**

---

## 🚀 Option 1: Single Server Deployment (Render)

Deploy everything on one server - simplest approach.

### Prerequisites

- ✅ GitHub account
- ✅ MongoDB Atlas account (free)
- ✅ OpenRouter API key
- ✅ Code pushed to GitHub

### Step 1: MongoDB Atlas Setup

1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Create free M0 cluster
3. Create database user
4. Whitelist IP: `0.0.0.0/0`
5. Get connection string:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ai-chatbot?retryWrites=true&w=majority
   ```

### Step 2: Deploy on Render

1. **Create Account**: https://render.com (Sign up with GitHub)

2. **Create Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select your repo

3. **Configure Settings**:
   - **Name**: `ai-chatbot`
   - **Root Directory**: Leave **empty** (repo root)
   - **Runtime**: `Node`
   - **Build Command**: 
     ```
     cd frontend && npm install && npm run build && cd ../backend && npm install
     ```
   - **Start Command**: 
     ```
     cd backend && npm start
     ```
   - **Plan**: **Free**

4. **Add Environment Variables**:
   ```
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/ai-chatbot?retryWrites=true&w=majority
   PORT=10000
   NODE_ENV=production
   AI_PROVIDER=openrouter
   OPENROUTER_API_KEY=your-api-key-here
   JWT_SECRET=your-32-char-secret-key
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=secure-password
   ```

5. **Deploy**: Click "Create Web Service"
   - Wait 10-15 minutes for first deployment

### Step 3: Access Your Application

Once deployed, everything is available at one URL:

- **Frontend**: `https://your-app.onrender.com`
- **Admin Panel**: `https://your-app.onrender.com/admin`
- **API**: `https://your-app.onrender.com/api`
- **Chatbot Script**: `https://your-app.onrender.com/chatbot.js`

### Step 4: Build and Deploy Embed Script

```bash
# Build embed script locally
cd embed
npm install
npm run build

# Copy to backend
cp dist/chatbot.js ../backend/public/chatbot.js

# Commit and push
git add backend/public/chatbot.js
git commit -m "Add chatbot embed script"
git push
```

---

## 🌐 Option 2: Separate Servers (Render + Netlify)

Deploy backend and frontend separately for better scaling.

### Backend on Render

1. **Create Web Service** on Render
2. **Settings**:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
3. **Environment Variables** (same as Option 1, plus):
   ```
   ALLOWED_ORIGINS=https://your-app.netlify.app,http://localhost:5173
   ```

### Frontend on Netlify

1. **Create Account**: https://netlify.com
2. **Import from GitHub**:
   - Select your repository
3. **Build Settings**:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`
4. **Environment Variables**:
   ```
   VITE_API_BASE_URL=https://your-backend.onrender.com/api
   ```
5. **Deploy**

### Update CORS

After Netlify deployment, update `ALLOWED_ORIGINS` in Render with your Netlify URL.

---

## 📋 Environment Variables Reference

### Backend (Render)

```env
# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/ai-chatbot?retryWrites=true&w=majority

# Server
PORT=10000
NODE_ENV=production

# AI Provider
AI_PROVIDER=openrouter
OPENROUTER_API_KEY=sk-or-v1-your-key-here

# Authentication
JWT_SECRET=your-super-secret-random-string-minimum-32-characters
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=secure-password

# CORS (only for separate servers)
ALLOWED_ORIGINS=https://your-frontend.netlify.app,http://localhost:5173
```

### Frontend (Netlify/Vercel)

```env
# For single server: use relative URL
VITE_API_BASE_URL=/api

# For separate servers: use full URL
VITE_API_BASE_URL=https://your-backend.onrender.com/api
```

---

## ✅ Deployment Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user created
- [ ] IP whitelisted (0.0.0.0/0)
- [ ] Connection string saved
- [ ] Code pushed to GitHub
- [ ] Render account created
- [ ] Backend deployed
- [ ] All environment variables set
- [ ] Backend health check works
- [ ] Frontend deployed (if separate)
- [ ] CORS configured (if separate)
- [ ] Embed script built and deployed
- [ ] Tested complete flow

---

## 🔧 Troubleshooting

### Build Fails
- Check Node version (should be 18+)
- Verify all dependencies in package.json
- Check build logs for specific errors

### Backend Not Starting
- Verify MongoDB connection string
- Check all environment variables are set
- Review Render logs for errors

### Frontend Not Loading
- Verify build completed successfully
- Check environment variables
- Verify API URL is correct

### CORS Errors
- Update `ALLOWED_ORIGINS` with your frontend URL
- Check backend CORS configuration

---

## 📊 Free Tier Limits

### Render
- ✅ 750 hours/month (enough for 24/7)
- ⚠️ Sleeps after 15 minutes inactivity
- ✅ Free SSL certificate
- ✅ Auto-deploy from GitHub

### Netlify
- ✅ 100GB bandwidth/month
- ✅ 300 build minutes/month
- ✅ Free SSL certificate
- ✅ Custom domain support

### MongoDB Atlas
- ✅ 512MB storage
- ✅ Shared RAM/CPU
- ✅ Perfect for small projects

---

## 🎉 You're Live!

Your chatbot is now deployed and ready to use!

**Add to any website:**
```html
<script src="https://your-backend.onrender.com/chatbot.js"></script>
```

---

**Need help?** Check the build logs in Render/Netlify dashboards for specific errors.
