# HerbChain Setup Guide

## 🚀 Quick Setup (5 minutes)

### 1. Prerequisites
Make sure you have these installed:
- **Node.js 18+** - [Download here](https://nodejs.org/)
- **MongoDB** - [Download here](https://www.mongodb.com/try/download/community)

### 2. Start MongoDB
\`\`\`bash
# On macOS with Homebrew
brew services start mongodb-community

# On Ubuntu/Debian
sudo systemctl start mongod

# On Windows
net start MongoDB

# Or run manually
mongod --dbpath /path/to/your/data/directory
\`\`\`

### 3. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 4. Environment Setup
\`\`\`bash
cp .env.example .env.local
\`\`\`

Edit `.env.local` with your settings (the defaults work for local development).

### 5. Initialize Database
\`\`\`bash
npm run setup-db
\`\`\`

### 6. Start the Application
\`\`\`bash
npm run dev
\`\`\`

### 7. Open Your Browser
Go to [http://localhost:3000](http://localhost:3000)

## 🔑 Demo Login Credentials

| Role | Email | Password |
|------|-------|----------|
| **Farmer** | farmer@demo.com | demo123 |
| **Manufacturer** | manufacturer@demo.com | demo123 |
| **Regulator** | regulator@demo.com | demo123 |

## 🧪 Test the Complete Flow

### As a Farmer:
1. Login with farmer@demo.com / demo123
2. Go to "Add New Batch" tab
3. Fill in herb details (Turmeric, 50kg)
4. Click "Get Location" to add GPS coordinates
5. Submit the batch
6. Go to "My Batches" and generate a QR code

### As a Manufacturer:
1. Login with manufacturer@demo.com / demo123
2. View available batches from farmers
3. Process batches and upload lab reports
4. Update batch status through processing stages

### As a Regulator:
1. Login with regulator@demo.com / demo123
2. Audit batches for compliance
3. Verify authenticity and issue certifications

### As a Consumer:
1. No login required
2. Go to /consumer to browse verified batches
3. Scan QR codes to see complete supply chain history

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

### Database Reset
If you need to start fresh:
\`\`\`bash
npm run reset-db
npm run setup-db
\`\`\`

### Port Issues
If port 3000 is busy:
\`\`\`bash
npm run dev -- -p 3001
\`\`\`

### Clear Browser Data
If you see authentication issues:
1. Open browser dev tools (F12)
2. Go to Application/Storage tab
3. Clear localStorage and cookies for localhost

## 📱 Features to Test

- ✅ **User Authentication** - Login/Register with different roles
- ✅ **Batch Creation** - Add herb batches with photos and GPS
- ✅ **QR Code Generation** - Generate and download QR codes
- ✅ **Supply Chain Tracking** - Track batches through all stages
- ✅ **File Upload** - IPFS integration for photos and documents
- ✅ **Real-time Updates** - Status changes reflect immediately
- ✅ **Mobile Responsive** - Works on phones and tablets
- ✅ **Error Handling** - Proper error messages and validation

## 🎯 Next Steps

1. **Customize for Your Use Case** - Modify herb types, roles, and workflows
2. **Add Real Blockchain** - Integrate with Ethereum, Hyperledger, or other networks
3. **Production Deployment** - Deploy to Vercel, AWS, or your preferred platform
4. **Scale the Database** - Move to MongoDB Atlas or other cloud databases
5. **Add More Features** - Payments, notifications, advanced analytics

## 📞 Need Help?

- Check the main README.md for detailed documentation
- Look at the code comments for implementation details
- Open an issue on GitHub for bugs or feature requests

Happy coding! 🌿
