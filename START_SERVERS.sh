#!/bin/bash

# AI Chatbot - Start Servers Script

echo "🚀 Starting AI Chatbot Application..."
echo ""

# Kill any existing processes
echo "Cleaning up old processes..."
pkill -f "vite" 2>/dev/null
pkill -f "nodemon" 2>/dev/null
sleep 2

# Start Backend
echo "📦 Starting Backend Server (Port 5000)..."
cd backend
npm run dev > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Wait for backend
sleep 3

# Check backend
if curl -s http://localhost:5000/health > /dev/null; then
    echo "✅ Backend is running on http://localhost:5000"
else
    echo "⚠️  Backend may still be starting..."
fi

# Start Frontend
echo "🎨 Starting Frontend Server (Port 5173)..."
cd frontend
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

# Wait for frontend
sleep 5

# Check frontend
if curl -s http://localhost:5173 > /dev/null; then
    echo "✅ Frontend is running on http://localhost:5173"
else
    echo "⚠️  Frontend may still be starting..."
fi

echo ""
echo "=========================================="
echo "🎉 Servers are starting!"
echo ""
echo "📍 Access Points:"
echo "   Frontend:  http://localhost:5173"
echo "   Admin:     http://localhost:5173/admin/login"
echo "   Backend:   http://localhost:5000"
echo "   Health:    http://localhost:5000/health"
echo ""
echo "📝 Logs:"
echo "   Backend:   tail -f backend.log"
echo "   Frontend:  tail -f frontend.log"
echo ""
echo "🛑 To stop servers:"
echo "   pkill -f 'vite|nodemon'"
echo "=========================================="
