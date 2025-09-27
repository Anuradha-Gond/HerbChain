# 🌿 HerbChain - Local Setup Guide

## ✅ Final Error Check Results

**Status: READY TO RUN** - All configurations verified and no errors found!

### Dependencies Status
- ✅ All required packages present in package.json
- ✅ MongoDB driver (6.20.0) configured
- ✅ Authentication libraries (bcryptjs, jsonwebtoken) ready
- ✅ IPFS client (60.0.1) for file storage
- ✅ Next.js 14.2.25 with React 19
- ✅ TypeScript and build tools configured

### Configuration Status
- ✅ Environment variables template ready (.env.example)
- ✅ Database setup scripts functional
- ✅ Demo data and users prepared
- ✅ All API routes implemented and tested

---

## 🚀 Step-by-Step Local Setup

### Step 1: Prerequisites
Make sure you have these installed:
\`\`\`bash
# Check Node.js version (requires 18+)
node --version

# Check npm version
npm --version

# Install MongoDB (if not installed)
# macOS:
brew install mongodb-community

# Ubuntu/Debian:
sudo apt-get install mongodb

# Windows: Download from https://www.mongodb.com/try/download/community
\`\`\`

### Step 2: Clone and Install Dependencies
\`\`\`bash
# Navigate to your project directory
cd herbchain-project

# Install all dependencies
npm install
\`\`\`

### Step 3: Environment Configuration
\`\`\`bash
# Copy environment template
cp .env.example .env.local

# Edit environment variables (optional - defaults work for local development)
nano .env.local
\`\`\`

**Default Environment Variables (already configured):**
\`\`\`env
MONGODB_URI=mongodb://localhost:27017/herbchain
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NEXT_PUBLIC_API_URL=http://localhost:3000/api
\`\`\`

### Step 4: Start MongoDB
\`\`\`bash
# Start MongoDB service
# macOS/Linux:
mongod

# Or if using brew:
brew services start mongodb-community

# Windows: Start MongoDB service from Services panel
# Or run: net start MongoDB
\`\`\`

### Step 5: Initialize Database
\`\`\`bash
# Run database setup (creates collections and demo users)
npm run setup-db
\`\`\`

**Expected Output:**
\`\`\`
🌿 HerbChain Database Setup
==================================================
Starting database setup...
✅ Connected to MongoDB
✅ Created users collection
✅ Created batches collection
✅ Demo users created successfully
✅ Database setup completed successfully!

📋 Demo Login Credentials:
┌─────────────────────────────────────────┐
│ Role         │ Email              │ Pass │
├─────────────────────────────────────────┤
│ Farmer       │ farmer@demo.com    │ demo123 │
│ Manufacturer │ manufacturer@demo.com │ demo123 │
│ Regulator    │ regulator@demo.com │ demo123 │
└─────────────────────────────────────────┘
\`\`\`

### Step 6: Start the Application
\`\`\`bash
# Start development server
npm run dev
\`\`\`

**Application will be available at:**
- 🌐 **Frontend**: http://localhost:3000
- 🔌 **API**: http://localhost:3000/api

### Step 7: Test the Application
1. **Open Browser**: Navigate to http://localhost:3000
2. **Login**: Use demo credentials (farmer@demo.com / demo123)
3. **Create Batch**: Test batch creation functionality
4. **Verify QR**: Test QR code generation and scanning

---

## 🧪 Testing Different User Roles

### Farmer Dashboard
\`\`\`
Email: farmer@demo.com
Password: demo123
Features: Create batches, upload photos, track harvest data
\`\`\`

### Manufacturer Dashboard
\`\`\`
Email: manufacturer@demo.com
Password: demo123
Features: Process batches, upload lab reports, quality control
\`\`\`

### Regulator Dashboard
\`\`\`
Email: regulator@demo.com
Password: demo123
Features: Verify batches, issue certifications, audit trail
\`\`\`

---

## 🔧 Troubleshooting

### MongoDB Connection Issues
\`\`\`bash
# Check if MongoDB is running
ps aux | grep mongod

# Check MongoDB logs
tail -f /usr/local/var/log/mongodb/mongo.log

# Restart MongoDB
brew services restart mongodb-community
\`\`\`

### Port Already in Use
\`\`\`bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- -p 3001
\`\`\`

### Database Reset
\`\`\`bash
# Reset database and recreate demo data
npm run reset-db
npm run setup-db
\`\`\`

### Clear Node Modules
\`\`\`bash
# If dependencies are corrupted
rm -rf node_modules package-lock.json
npm install
\`\`\`

---

## 📱 Mobile Testing

The application is fully responsive. Test on mobile by:
1. **Local Network**: Use your IP address (e.g., http://192.168.1.100:3000)
2. **ngrok**: `npx ngrok http 3000` for external testing
3. **Browser DevTools**: Use mobile device simulation

---

## 🎯 Key Features to Test

### ✅ Authentication System
- [x] User registration with role selection
- [x] Login with proper error messages
- [x] JWT token-based sessions
- [x] Role-based dashboard access

### ✅ Batch Management
- [x] Create new batches with photos
- [x] Generate QR codes automatically
- [x] Track batch status through supply chain
- [x] View batch history and details

### ✅ Supply Chain Tracking
- [x] Farmer → Manufacturer → Distributor → Consumer
- [x] Status updates and timestamps
- [x] Document uploads (photos, certificates)
- [x] Audit trail for regulators

### ✅ QR Code System
- [x] Generate unique QR codes for each batch
- [x] Scan QR codes to verify authenticity
- [x] Public verification without login
- [x] Mobile-friendly scanning interface

---

## 🚀 Production Deployment

When ready for production:

1. **Environment Variables**: Update JWT_SECRET and MongoDB URI
2. **Database**: Use MongoDB Atlas or production MongoDB instance
3. **IPFS**: Configure production IPFS node or use Pinata
4. **SSL**: Enable HTTPS for secure authentication
5. **Deploy**: Use Vercel, Netlify, or your preferred platform

---

**🎉 Your HerbChain application is now ready to run locally!**

For support or questions, check the troubleshooting section above or review the API documentation in the `/app/api` directory.
