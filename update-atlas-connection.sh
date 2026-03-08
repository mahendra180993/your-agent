#!/bin/bash

echo "🔧 MongoDB Atlas Connection String Updater"
echo "=========================================="
echo ""

cd "/home/goodfolkmedia-22/Pictures/small projects websites/AI-BOT/backend"

if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    exit 1
fi

echo "📝 Steps to get your connection string:"
echo "1. Go to MongoDB Atlas Dashboard"
echo "2. Click 'Database' → 'Connect' on your cluster"
echo "3. Choose 'Connect your application'"
echo "4. Copy the connection string"
echo ""
echo "Example format:"
echo "mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority"
echo ""

read -p "Paste your connection string here: " CONN_STRING

if [ -z "$CONN_STRING" ]; then
    echo "❌ Connection string cannot be empty"
    exit 1
fi

# Check if it contains <password>
if echo "$CONN_STRING" | grep -q "<password>"; then
    echo ""
    echo "⚠️  Your connection string contains <password>"
    read -p "Enter your actual password: " PASSWORD
    
    # Replace <password> with actual password
    CONN_STRING=$(echo "$CONN_STRING" | sed "s/<password>/$PASSWORD/g")
fi

# Add database name if not present
if ! echo "$CONN_STRING" | grep -q "/ai-chatbot"; then
    # Replace the ? with /ai-chatbot?
    CONN_STRING=$(echo "$CONN_STRING" | sed "s|/?|/ai-chatbot?|g")
    # Or if it ends with /, add ai-chatbot
    CONN_STRING=$(echo "$CONN_STRING" | sed "s|/$|/ai-chatbot|g")
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
echo "📋 Updated connection string:"
grep "^MONGODB_URI" .env | head -1
echo ""
echo "🔄 Next step: Restart your backend server"
echo "   pkill -f nodemon"
echo "   cd backend && npm run dev"
echo ""
echo "✅ Look for: [INFO] MongoDB Connected"
