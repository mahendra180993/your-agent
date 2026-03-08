#!/bin/bash

echo "🚀 AI Chatbot - Quick Start"
echo "============================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Navigate to project
PROJECT_DIR="/home/goodfolkmedia-22/Pictures/small projects websites/AI-BOT"
cd "$PROJECT_DIR" || exit

echo "📦 Step 1: Installing Backend Dependencies..."
cd backend
if [ ! -d "node_modules" ]; then
    npm install
else
    echo "   ✅ Backend dependencies already installed"
fi

echo ""
echo "📦 Step 2: Installing Frontend Dependencies..."
cd ../frontend
if [ ! -d "node_modules" ]; then
    npm install
else
    echo "   ✅ Frontend dependencies already installed"
fi

echo ""
echo "⚙️  Step 3: Checking Environment Files..."

# Check backend .env
cd ../backend
if [ ! -f .env ]; then
    echo "   ⚠️  Backend .env not found, creating from template..."
    cp .env.example .env 2>/dev/null || echo "   ⚠️  .env.example not found, please create .env manually"
    echo "   📝 Please edit backend/.env with your configuration"
else
    echo "   ✅ Backend .env exists"
fi

# Check frontend .env
cd ../frontend
if [ ! -f .env ]; then
    echo "   ⚠️  Frontend .env not found, creating..."
    echo "VITE_API_BASE_URL=http://localhost:5000/api" > .env
    echo "   ✅ Frontend .env created"
else
    echo "   ✅ Frontend .env exists"
fi

echo ""
echo "🛑 Step 4: Stopping any existing servers..."
pkill -f "vite" 2>/dev/null
pkill -f "nodemon" 2>/dev/null
sleep 2

echo ""
echo "🔧 Step 5: Starting Backend Server..."
cd ../backend
npm run dev > ../backend.log 2>&1 &
BACKEND_PID=$!
echo "   Backend PID: $BACKEND_PID"

# Wait for backend
sleep 3

# Check backend
if curl -s http://localhost:5000/health > /dev/null 2>&1; then
    echo -e "   ${GREEN}✅ Backend is running on http://localhost:5000${NC}"
else
    echo -e "   ${YELLOW}⚠️  Backend may still be starting...${NC}"
fi

echo ""
echo "🎨 Step 6: Starting Frontend Server..."
cd ../frontend
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
echo "   Frontend PID: $FRONTEND_PID"

# Wait for frontend
sleep 5

# Check frontend
if curl -s http://localhost:5173 > /dev/null 2>&1; then
    echo -e "   ${GREEN}✅ Frontend is running on http://localhost:5173${NC}"
else
    echo -e "   ${YELLOW}⚠️  Frontend may still be starting...${NC}"
fi

echo ""
echo "=========================================="
echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo ""
echo "📍 Access Points:"
echo "   Frontend:  http://localhost:5173"
echo "   Admin:     http://localhost:5173/admin/login"
echo "   Backend:   http://localhost:5000"
echo "   Health:    http://localhost:5000/health"
echo ""
echo "🔑 Default Login:"
echo "   Email:    admin@example.com"
echo "   Password: admin123"
echo ""
echo "📝 Logs:"
echo "   Backend:  tail -f $PROJECT_DIR/backend.log"
echo "   Frontend: tail -f $PROJECT_DIR/frontend.log"
echo ""
echo "🛑 To stop servers:"
echo "   pkill -f 'vite|nodemon'"
echo "=========================================="
