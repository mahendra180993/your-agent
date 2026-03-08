#!/bin/bash

echo "📦 MongoDB Installation Script for Ubuntu/Debian"
echo "=============================================="
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "⚠️  This script needs sudo privileges"
    echo "Please run: sudo ./install-mongodb.sh"
    exit 1
fi

# Detect Ubuntu version
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$ID
    VERSION=$VERSION_ID
    CODENAME=$(lsb_release -cs 2>/dev/null || echo "unknown")
else
    echo "❌ Cannot detect OS version"
    exit 1
fi

echo "Detected: $OS $VERSION ($CODENAME)"
echo ""

# Check if MongoDB is already installed
if command -v mongod &> /dev/null; then
    echo "✅ MongoDB is already installed"
    echo ""
    echo "Checking if it's running..."
    if systemctl is-active --quiet mongod; then
        echo "✅ MongoDB is running"
        exit 0
    else
        echo "⚠️  MongoDB is installed but not running"
        echo "Starting MongoDB..."
        systemctl start mongod
        systemctl enable mongod
        echo "✅ MongoDB started"
        exit 0
    fi
fi

echo "⚠️  MongoDB is not installed"
echo ""
echo "This script will install MongoDB Community Edition"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Installation cancelled"
    exit 1
fi

echo ""
echo "📥 Installing dependencies..."
apt-get update
apt-get install -y wget curl gnupg2 software-properties-common apt-transport-https ca-certificates lsb-release

echo ""
echo "🔑 Adding MongoDB GPG key..."
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | apt-key add -

echo ""
echo "📝 Adding MongoDB repository..."

# Determine repository based on Ubuntu version
if [ "$CODENAME" = "jammy" ]; then
    echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-7.0.list
elif [ "$CODENAME" = "focal" ]; then
    echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-7.0.list
elif [ "$CODENAME" = "bionic" ]; then
    echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/7.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-7.0.list
else
    echo "⚠️  Unknown Ubuntu version: $CODENAME"
    echo "Trying with jammy (Ubuntu 22.04)..."
    echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-7.0.list
fi

echo ""
echo "📦 Installing MongoDB..."
apt-get update
apt-get install -y mongodb-org

echo ""
echo "🚀 Starting MongoDB service..."
systemctl start mongod
systemctl enable mongod

echo ""
echo "⏳ Waiting for MongoDB to start..."
sleep 3

echo ""
echo "✅ Verifying installation..."
if systemctl is-active --quiet mongod; then
    echo "✅ MongoDB is running!"
    echo ""
    echo "Test connection:"
    echo "  mongosh --eval 'db.version()'"
    echo ""
    echo "✅ Installation complete!"
    echo ""
    echo "Now restart your backend:"
    echo "  cd backend && npm run dev"
else
    echo "❌ MongoDB failed to start"
    echo "Check status: sudo systemctl status mongod"
    exit 1
fi
