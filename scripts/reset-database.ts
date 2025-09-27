// Database reset script for HerbChain demo
import { connectToDatabase } from "../lib/database"

async function resetDatabase() {
  try {
    console.log("Resetting HerbChain database...")

    const db = await connectToDatabase()

    // Drop all collections
    const collections = await db.listCollections().toArray()

    for (const collection of collections) {
      await db.collection(collection.name).drop()
      console.log(`Dropped collection: ${collection.name}`)
    }

    console.log("Database reset completed successfully!")
    console.log("Run 'npm run setup-db' to reinitialize with demo data")
  } catch (error) {
    console.error("Database reset failed:", error)
    process.exit(1)
  }
}

// Run reset if this script is executed directly
if (require.main === module) {
  resetDatabase()
    .then(() => {
      console.log("Reset complete!")
      process.exit(0)
    })
    .catch((error) => {
      console.error("Reset failed:", error)
      process.exit(1)
    })
}

export { resetDatabase }
