#!/usr/bin/env node

// Script to set up the HerbChain database with demo data
import { setupDatabase } from "./setup-database"

async function main() {
  console.log("🌿 HerbChain Database Setup")
  console.log("=".repeat(50))

  try {
    console.log("Starting database setup...")
    await setupDatabase()

    console.log("\n✅ Database setup completed successfully!")
    console.log("\n📋 Demo Login Credentials:")
    console.log("┌─────────────────────────────────────────┐")
    console.log("│ Role         │ Email              │ Pass │")
    console.log("├─────────────────────────────────────────┤")
    console.log("│ Farmer       │ farmer@demo.com    │ demo123 │")
    console.log("│ Manufacturer │ manufacturer@demo.com │ demo123 │")
    console.log("│ Regulator    │ regulator@demo.com │ demo123 │")
    console.log("└─────────────────────────────────────────┘")

    console.log("\n🚀 You can now start the application:")
    console.log("   npm run dev")

    process.exit(0)
  } catch (error) {
    console.error("\n❌ Database setup failed:")
    console.error(error)

    console.log("\n🔧 Troubleshooting:")
    console.log("1. Make sure MongoDB is running on localhost:27017")
    console.log("2. Check your MONGODB_URI environment variable")
    console.log("3. Ensure you have proper MongoDB permissions")

    process.exit(1)
  }
}

// Run the setup if this script is executed directly
if (require.main === module) {
  main()
}

export { main as runSetup }
