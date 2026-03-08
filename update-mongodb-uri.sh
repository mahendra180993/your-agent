#!/bin/bash

echo "🔧 MongoDB Connection String Updater"
echo "====================================="
echo ""
echo "This script will help you update your MongoDB connection string"
echo ""

cd "/home/goodfolkmedia-22/Pictures/small projects websites/AI-BOT/backend"

if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    exit 1
fi

echo "Current MONGODB_URI:"
grep "^MONGODB_URI" .env | head -1
echo ""

echo "Enter your MongoDB Atlas connection string:"
echo "(Format: mongodb+srv://username:password@cluster.mongodb.net/ai-chatbot)"
read -p "Connection string: " CONN_STRING

if [ -z "$CONN_STRING" ]; then
    echo "❌ Connection string cannot be empty"
    exit 1
fi

# Backup .env
cp .env .env.backup
echo "✅ Backup created: .env.backup"

# Update MONGODB_URI
if grep -q "^MONGODB_URI=" .env; then
    # Replace existing
    sed -i "s|^MONGODB_URI=.*|MONGODB_URI=$CONN_STRING|" .env
    echo "✅ MONGODB_URI updated"
else
    # Add new
    echo "MONGODB_URI=$CONN_STRING" >> .env
    echo "✅ MONGODB_URI added"
fi

echo ""
echo "Updated MONGODB_URI:"
grep "^MONGODB_URI" .env | head -1
echo ""
echo "🔄 Please restart your backend server:"
echo "   pkill -f nodemon"
echo "   cd backend && npm run dev"
