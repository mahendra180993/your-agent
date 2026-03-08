#!/bin/bash

echo "🔍 Testing MongoDB Connection"
echo "============================"
echo ""

cd "/home/goodfolkmedia-22/Pictures/small projects websites/AI-BOT/backend"

if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    exit 1
fi

MONGODB_URI=$(grep "^MONGODB_URI=" .env | cut -d '=' -f2- | tr -d '"' | tr -d "'")

if [ -z "$MONGODB_URI" ]; then
    echo "❌ MONGODB_URI not found in .env"
    exit 1
fi

echo "Current MONGODB_URI: $MONGODB_URI"
echo ""

# Check if it's localhost
if echo "$MONGODB_URI" | grep -q "localhost"; then
    echo "⚠️  Using localhost MongoDB"
    echo ""
    echo "Testing local connection..."
    
    # Try to connect
    if command -v mongosh &> /dev/null; then
        mongosh --eval "db.version()" 2>&1 | head -3
    else
        echo "❌ MongoDB not installed locally"
        echo ""
        echo "💡 Solutions:"
        echo "   1. Install MongoDB: sudo apt-get install -y mongodb"
        echo "   2. Or use MongoDB Atlas (free cloud): https://www.mongodb.com/cloud/atlas/register"
    fi
else
    echo "✅ Using MongoDB Atlas (cloud)"
    echo ""
    echo "Testing connection..."
    
    # Extract connection details
    if echo "$MONGODB_URI" | grep -q "mongodb+srv://"; then
        echo "Connection string format looks correct"
        echo ""
        echo "To test connection, run:"
        echo "  mongosh \"$MONGODB_URI\""
    fi
fi

echo ""
echo "📝 Check backend logs for connection status"
echo "   Look for: [INFO] MongoDB Connected"
