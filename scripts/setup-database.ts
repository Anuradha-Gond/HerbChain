// Database setup script for HerbChain demo
import { connectToDatabase, DatabaseOperations } from "../lib/database"
import bcrypt from "bcryptjs"

async function setupDatabase() {
  try {
    console.log("Setting up HerbChain database...")

    const db = await connectToDatabase()

    // Create indexes for better performance
    await db.collection("users").createIndex({ email: 1 }, { unique: true })
    await db.collection("batches").createIndex({ farmer_id: 1 })
    await db.collection("batches").createIndex({ id: 1 }, { unique: true })

    console.log("Database indexes created successfully")

    // Create demo users for testing
    const demoUsers = [
      {
        id: "farmer_demo_001",
        email: "farmer@demo.com",
        password_hash: await bcrypt.hash("demo123", 12),
        role: "farmer" as const,
        name: "Demo Farmer",
        phone: "+91-9876543210",
        address: "Demo Farm, Rural Area",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: "manufacturer_demo_001",
        email: "manufacturer@demo.com",
        password_hash: await bcrypt.hash("demo123", 12),
        role: "manufacturer" as const,
        name: "Demo Manufacturer",
        phone: "+91-9876543211",
        address: "Demo Manufacturing Unit",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: "regulator_demo_001",
        email: "regulator@demo.com",
        password_hash: await bcrypt.hash("demo123", 12),
        role: "regulator" as const,
        name: "Demo Regulator",
        phone: "+91-9876543212",
        address: "Regulatory Office",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]

    // Insert demo users (skip if they already exist)
    for (const user of demoUsers) {
      try {
        const existingUser = await DatabaseOperations.getUserByEmail(user.email)
        if (!existingUser) {
          await DatabaseOperations.createUser(user)
          console.log(`Created demo user: ${user.email}`)
        } else {
          console.log(`Demo user already exists: ${user.email}`)
        }
      } catch (error) {
        console.log(`User ${user.email} already exists or error occurred`)
      }
    }

    console.log("Database setup completed successfully!")
    console.log("\nDemo login credentials:")
    console.log("Farmer: farmer@demo.com / demo123")
    console.log("Manufacturer: manufacturer@demo.com / demo123")
    console.log("Regulator: regulator@demo.com / demo123")
  } catch (error) {
    console.error("Database setup failed:", error)
    process.exit(1)
  }
}

// Run setup if this script is executed directly
if (require.main === module) {
  setupDatabase()
    .then(() => {
      console.log("Setup complete!")
      process.exit(0)
    })
    .catch((error) => {
      console.error("Setup failed:", error)
      process.exit(1)
    })
}

export { setupDatabase }
