# Next Steps to Deploy Your Chatbot

Follow these steps to deploy your AI Chatbot application to production.

---

## ✅ What's Already Done

- ✅ Backend configured to serve frontend
- ✅ Build scripts created
- ✅ Deployment documentation ready
- ✅ Single server deployment setup

---

## 🚀 Step-by-Step Deployment Guide

### Step 1: Prepare Your Code (5 minutes)

#### 1.1 Build Embed Script

```bash
cd embed
npm install
npm run build
cp dist/chatbot.js ../backend/public/chatbot.js
```

#### 1.2 Verify Files

```bash
# Check backend/public/chatbot.js exists
ls -la backend/public/chatbot.js

# If it doesn't exist, create the directory
mkdir -p backend/public
```

#### 1.3 Commit Everything

```bash
# From project root
git add .
git commit -m "Ready for deployment - single server setup"
```

---

### Step 2: Push to GitHub (2 minutes)

#### 2.1 Check if GitHub Repo Exists

```bash
# Check if remote exists
git remote -v
```

#### 2.2 Create GitHub Repository (if needed)

1. Go to: https://github.com/new
2. Repository name: `ai-chatbot` (or your choice)
3. Set to **Public** or **Private**
4. **Don't** initialize with README (you already have one)
5. Click **"Create repository"**

#### 2.3 Push Code

```bash
# If remote doesn't exist, add it
git remote add origin https://github.com/YOUR_USERNAME/ai-chatbot.git

# Push code
git branch -M main
git push -u origin main
```

**Replace `YOUR_USERNAME` with your GitHub username!**

---

### Step 3: Set Up MongoDB Atlas (5 minutes)

#### 3.1 Create Account

1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up with email or Google
3. Verify your email

#### 3.2 Create Free Cluster

1. Click **"Build a Database"**
2. Select **"M0 FREE"** (Free tier)
3. Choose cloud provider: **AWS** (recommended)
4. Select region closest to you
5. Click **"Create"**
6. Wait 3-5 minutes for cluster creation

#### 3.3 Create Database User

1. Click **"Database Access"** (left sidebar)
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Enter:
   - **Username**: `chatbot-admin` (or your choice)
   - **Password**: Click **"Autogenerate Secure Password"** or create your own
   - **⚠️ SAVE THE PASSWORD** - You'll need it!
5. Set privileges: **"Atlas Admin"**
6. Click **"Add User"**

#### 3.4 Whitelist IP Address

1. Click **"Network Access"** (left sidebar)
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (adds `0.0.0.0/0`)
4. Click **"Confirm"**

#### 3.5 Get Connection String

1. Click **"Database"** (left sidebar)
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace:
   - `<username>` with your database username
   - `<password>` with your database password
   - Add database name: `/ai-chatbot` before `?`
   
   **Final format:**
   ```
   mongodb+srv://chatbot-admin:YourPassword@cluster0.xxxxx.mongodb.net/ai-chatbot?retryWrites=true&w=majority
   ```
   
   **Important**: If password has special characters, URL encode them:
   - `@` → `%40`
   - `#` → `%23`
   - `$` → `%24`

6. **Save this connection string** - You'll need it for Render!

---

### Step 4: Get AI API Key (2 minutes)

#### Option A: OpenRouter (Recommended)

1. Go to: https://openrouter.ai
2. Sign up or login
3. Go to: https://openrouter.ai/keys
4. Click **"Create Key"**
5. Copy the API key: `sk-or-v1-...`
6. **Save this key** - You'll need it!

#### Option B: HuggingFace

1. Go to: https://huggingface.co
2. Sign up and create account
3. Go to: https://huggingface.co/settings/tokens
4. Create new token
5. Copy the token

---

### Step 5: Deploy on Render (10 minutes)

#### 5.1 Create Render Account

1. Go to: https://render.com
2. Click **"Get Started for Free"**
3. Sign up with **GitHub** (recommended)
4. Authorize Render to access your GitHub account

#### 5.2 Create Web Service

1. In Render dashboard, click **"New +"** (top right)
2. Select **"Web Service"**
3. Connect your GitHub repository:
   - If not connected, click **"Configure account"** and authorize
   - Select your repository: `ai-chatbot` (or your repo name)
   - Click **"Connect"**

#### 5.3 Configure Service

**Basic Settings:**
- **Name**: `ai-chatbot` (or your choice)
- **Region**: Choose closest to you (Oregon, Frankfurt, etc.)
- **Branch**: `main` (or `master`)
- **Root Directory**: Leave **empty** (repo root) ⚠️ **IMPORTANT!**
- **Runtime**: `Node`
- **Build Command**: 
  ```
  cd frontend && npm install && npm run build && cd ../backend && npm install
  ```
- **Start Command**: 
  ```
  cd backend && npm start
  ```
- **Plan**: **Free** (select this)

**Advanced Settings** (click to expand):
- **Auto-Deploy**: `Yes` (deploys on every push)
- **Health Check Path**: `/health`

#### 5.4 Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"** and add these one by one:

```
MONGODB_URI=mongodb+srv://chatbot-admin:YourPassword@cluster0.xxxxx.mongodb.net/ai-chatbot?retryWrites=true&w=majority
```
*(Replace with your actual MongoDB connection string)*

```
PORT=10000
```

```
NODE_ENV=production
```

```
AI_PROVIDER=openrouter
```

```
OPENROUTER_API_KEY=sk-or-v1-your-actual-api-key-here
```
*(Replace with your OpenRouter API key)*

```
JWT_SECRET=your-super-secret-random-string-minimum-32-characters-long
```
*(Generate a random string, at least 32 characters. Example: `openssl rand -hex 32`)*

```
ADMIN_EMAIL=admin@yourdomain.com
```
*(Your admin email)*

```
ADMIN_PASSWORD=your-secure-admin-password
```
*(Your admin password - make it strong!)*

#### 5.5 Deploy

1. Scroll down and click **"Create Web Service"**
2. Render will start building your application
3. **Wait 10-15 minutes** for first deployment
4. Watch the build logs in real-time

#### 5.6 Get Your URL

Once deployed:
1. You'll see: **"Your service is live at"**
2. Copy the URL: `https://ai-chatbot.onrender.com` (or your custom name)
3. **Save this URL** - This is your application URL!

---

### Step 6: Test Your Deployment (5 minutes)

#### 6.1 Test Backend

1. Open: `https://your-app.onrender.com/health`
2. You should see:
   ```json
   {
     "success": true,
     "message": "Server is running",
     "timestamp": "2024-01-01T12:00:00.000Z"
   }
   ```

#### 6.2 Test Frontend

1. Open: `https://your-app.onrender.com`
2. You should see your frontend
3. Try: `https://your-app.onrender.com/admin/login`
4. Login with your admin credentials

#### 6.3 Test Chatbot Script

1. Open: `https://your-app.onrender.com/chatbot.js`
2. You should see JavaScript code (not an error)

**Note**: First request after sleep takes ~30 seconds (cold start). This is normal for free tier.

---

### Step 7: Add Your First Client (2 minutes)

1. Go to: `https://your-app.onrender.com/admin/login`
2. Login with your admin credentials
3. Go to **"Client Management"**
4. Click **"Add Client"**
5. Enter:
   - **Website**: `localhost` (for testing) or your actual domain
   - **Business Type**: `Technology`
   - **System Prompt**: `You are a helpful assistant for a tech company.`
   - **Tone**: `friendly`
   - **Welcome Message**: `Hello! How can I help you today?`
6. Click **"Save"**

---

### Step 8: Test the Chatbot (2 minutes)

1. Go to: `https://your-app.onrender.com`
2. Click the chat button (bottom-right)
3. Type a message
4. You should get an AI response!

---

## ✅ Deployment Checklist

Use this checklist to track your progress:

- [ ] Code committed to Git
- [ ] Code pushed to GitHub
- [ ] Embed script built (`backend/public/chatbot.js` exists)
- [ ] MongoDB Atlas cluster created
- [ ] Database user created
- [ ] IP whitelisted (0.0.0.0/0)
- [ ] MongoDB connection string saved
- [ ] AI API key obtained (OpenRouter or HuggingFace)
- [ ] Render account created
- [ ] Render service created
- [ ] All environment variables added to Render
- [ ] Deployment started on Render
- [ ] Build completed successfully
- [ ] Backend health check works
- [ ] Frontend loads correctly
- [ ] Admin login works
- [ ] First client added
- [ ] Chatbot tested and working

---

## 🎉 You're Live!

Your chatbot is now deployed and ready to use!

### Your Application URLs

- **Frontend**: `https://your-app.onrender.com`
- **Admin Panel**: `https://your-app.onrender.com/admin`
- **API**: `https://your-app.onrender.com/api`
- **Chatbot Script**: `https://your-app.onrender.com/chatbot.js`

### Add to Your Website

Add this to any website (before `</body>` tag):

```html
<script src="https://your-app.onrender.com/chatbot.js"></script>
```

---

## 🔧 Troubleshooting

### Build Fails on Render

**Check:**
- Build logs in Render dashboard
- All dependencies in package.json
- Node version (should be 18+)

**Common fixes:**
- Verify build command is correct
- Check root directory is empty (not `backend`)
- Ensure all files are committed to Git

### Backend Not Starting

**Check:**
- Environment variables are all set
- MongoDB connection string is correct
- Password is URL-encoded if it has special characters

**Common fixes:**
- Verify MongoDB IP whitelist includes `0.0.0.0/0`
- Check connection string format
- Review Render logs for specific errors

### Frontend Not Loading

**Check:**
- Frontend build completed successfully
- Build logs show no errors
- URL is correct

**Common fixes:**
- Verify build command includes frontend build
- Check that `frontend/dist` folder exists after build
- Review build logs

### Chatbot Not Responding

**Check:**
- AI API key is valid
- Client is registered in database
- Backend logs for errors

**Common fixes:**
- Verify OpenRouter API key is correct
- Check client domain matches
- Review backend logs in Render

---

## 📚 Next Steps After Deployment

1. **Add Your Website as Client**
   - Register your actual domain in admin panel
   - Configure custom prompt and tone

2. **Add Chatbot to Your Website**
   - Add script tag to your website
   - Test on your live site

3. **Monitor Usage**
   - Check Render dashboard for logs
   - Monitor MongoDB Atlas for storage
   - Track API usage

4. **Customize**
   - Update system prompts per client
   - Adjust tone and personality
   - Add custom welcome messages

---

## 💡 Pro Tips

1. **Save All Credentials**: Keep MongoDB connection string, API keys, and admin password in a secure place
2. **Monitor Logs**: Check Render logs regularly for errors
3. **Test Locally First**: Make sure everything works locally before deploying
4. **Use Environment Variables**: Never commit secrets to GitHub
5. **Backup Database**: Regularly backup your MongoDB data

---

**Need Help?** Check the deployment logs in Render dashboard or refer to DEPLOYMENT.md for detailed instructions.

**Congratulations!** Your AI Chatbot is now live on the internet! 🎉
