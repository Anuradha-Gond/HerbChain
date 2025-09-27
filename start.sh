#!/bin/bash

# HerbChain Application Startup Script

echo "🌿 Starting HerbChain Application..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

# Check if MongoDB is running (optional - can use cloud MongoDB)
if command -v mongod &> /dev/null; then
    if ! pgrep -x "mongod" > /dev/null; then
        echo "⚠️  MongoDB is not running. Starting MongoDB..."
        mongod --fork --logpath /var/log/mongodb.log --dbpath /data/db
    fi
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Create .env.local if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo "⚙️  Creating environment configuration..."
    cat > .env.local << EOL
# Database
MONGODB_URI=mongodb://localhost:27017/herbchain

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000

# IPFS Configuration
IPFS_HOST=localhost
IPFS_PORT=5001
IPFS_PROTOCOL=http
IPFS_GATEWAY=http://localhost:8080

# Authentication
JWT_SECRET=herbchain-super-secret-jwt-key-2024

# Blockchain (Mock configuration)
BLOCKCHAIN_NETWORK_URL=http://localhost:7051
BLOCKCHAIN_CHANNEL=herbchain-channel
BLOCKCHAIN_CHAINCODE=herbchain-contract

# AI Services (Mock configuration)
GOOGLE_CLOUD_PROJECT_ID=herbchain-ai-project
GOOGLE_CLOUD_KEY_FILE=./config/google-cloud-key.json
EOL
    echo "✅ Environment configuration created at .env.local"
fi

# Seed database with dummy data
echo "🌱 Seeding database with dummy data..."
npm run seed

# Start the development server
echo "🚀 Starting HerbChain development server..."
echo "📱 Application will be available at: http://localhost:3000"
echo ""
echo "🎯 Quick Access Links:"
echo "   • Home Page: http://localhost:3000"
echo "   • Farmer Dashboard: http://localhost:3000/farmer"
echo "   • Manufacturer Dashboard: http://localhost:3000/manufacturer"
echo "   • Distributor Dashboard: http://localhost:3000/distributor"
echo "   • Regulator Dashboard: http://localhost:3000/regulator"
echo "   • Product Verification: http://localhost:3000/verify"
echo ""
echo "🛑 Press Ctrl+C to stop the server"
echo ""

npm run dev
