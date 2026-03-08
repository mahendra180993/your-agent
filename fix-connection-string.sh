#!/bin/bash

echo "🔧 MongoDB Connection String Fixer"
echo "==================================="
echo ""

cd "/home/goodfolkmedia-22/Pictures/small projects websites/AI-BOT/backend"

if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    exit 1
fi

echo "Current connection string:"
grep "^MONGODB_URI" .env
echo ""

if grep -q "<db_password>" .env; then
    echo "⚠️  Found <db_password> - needs to be replaced"
    echo ""
    read -p "Enter your MongoDB database password: " -s PASSWORD
    echo ""
    
    # Backup
    cp .env .env.backup
    echo "✅ Backup created: .env.backup"
    
    # Replace password
    sed -i "s|<db_password>|$PASSWORD|g" .env
    
    # Fix connection string format
    sed -i 's|/?appName=Cluster0|/ai-chatbot?retryWrites=true\&w=majority|g' .env
    sed -i 's|?appName=Cluster0|/ai-chatbot?retryWrites=true\&w=majority|g' .env
    
    echo ""
    echo "✅ Connection string updated!"
    echo ""
    echo "Updated connection string:"
    grep "^MONGODB_URI" .env
    echo ""
    echo "🔄 Next: Restart your backend"
    echo "   pkill -f nodemon"
    echo "   cd backend && npm run dev"
else
    echo "✅ Connection string looks good (no <db_password> found)"
    echo ""
    echo "Current connection string:"
    grep "^MONGODB_URI" .env
fi
