// Seed data for MongoDB database
import { DatabaseOperations } from "./database"
import type { User, Farm, HerbBatch } from "./database"

export async function seedDatabase() {
  console.log("Seeding database with dummy data...")

  // Create dummy users
  const users: Omit<User, "_id">[] = [
    {
      id: "FARMER001",
      email: "rajesh.kumar@example.com",
      password_hash: "$2b$10$dummy.hash.for.password123",
      role: "farmer",
      name: "Rajesh Kumar",
      phone: "+91-9876543210",
      address: "Village Khejroli, Rajasthan, India",
      aadhaar_id: "1234-5678-9012",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: "MANUFACTURER001",
      email: "ayurvedic.herbs@example.com",
      password_hash: "$2b$10$dummy.hash.for.password123",
      role: "manufacturer",
      name: "Ayurvedic Herbs Pvt Ltd",
      phone: "+91-9876543211",
      address: "Industrial Area, Ahmedabad, Gujarat, India",
      license_number: "MFG-GJ-2024-001",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: "DISTRIBUTOR001",
      email: "green.distribution@example.com",
      password_hash: "$2b$10$dummy.hash.for.password123",
      role: "distributor",
      name: "Green Distribution Network",
      phone: "+91-9876543212",
      address: "Warehouse Complex, Mumbai, Maharashtra, India",
      license_number: "DIST-MH-2024-001",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: "REGULATOR001",
      email: "ayush.regulator@gov.in",
      password_hash: "$2b$10$dummy.hash.for.password123",
      role: "regulator",
      name: "AYUSH Ministry Inspector",
      phone: "+91-9876543213",
      address: "AYUSH Bhawan, New Delhi, India",
      license_number: "REG-DL-2024-001",
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]

  // Create dummy farms
  const farms: Omit<Farm, "_id">[] = [
    {
      id: "FARM001",
      farmer_id: "FARMER001",
      name: "Kumar Organic Farm",
      location: {
        latitude: 27.0238,
        longitude: 74.2179,
        address: "Village Khejroli, Rajasthan, India",
      },
      area_hectares: 5.5,
      soil_type: "Sandy loam",
      organic_certified: true,
      created_at: new Date(),
    },
  ]

  // Create dummy herb batches
  const batches: Omit<HerbBatch, "_id">[] = [
    {
      id: "BATCH001",
      farmer_id: "FARMER001",
      farm_id: "FARM001",
      herb_type: "Ashwagandha",
      sanskrit_name: "Withania somnifera",
      quantity_kg: 100,
      harvest_date: new Date("2024-01-15"),
      cultivation_method: "organic",
      location: {
        latitude: 27.0238,
        longitude: 74.2179,
      },
      photos: ["QmHash1", "QmHash2"], // Mock IPFS hashes
      blockchain_hash: "abc123def456",
      status: "harvested",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: "BATCH002",
      farmer_id: "FARMER001",
      farm_id: "FARM001",
      herb_type: "Turmeric",
      sanskrit_name: "Curcuma longa",
      quantity_kg: 75,
      harvest_date: new Date("2024-01-20"),
      cultivation_method: "organic",
      location: {
        latitude: 27.0238,
        longitude: 74.2179,
      },
      photos: ["QmHash3", "QmHash4"],
      blockchain_hash: "def456ghi789",
      status: "processed",
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]

  try {
    // Seed users
    for (const user of users) {
      await DatabaseOperations.createUser(user)
    }

    // Seed batches
    for (const batch of batches) {
      await DatabaseOperations.createBatch(batch)
    }

    console.log("Database seeded successfully!")
  } catch (error) {
    console.error("Error seeding database:", error)
  }
}
