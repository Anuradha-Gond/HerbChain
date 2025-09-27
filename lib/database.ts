import { MongoClient, type Db, type Collection } from "mongodb"

// MongoDB connection
let client: MongoClient
let db: Db

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/herbchain"

export async function connectToDatabase(): Promise<Db> {
  if (db) {
    return db
  }

  try {
    client = new MongoClient(MONGODB_URI, {
      // Add connection options for better local development
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    })
    await client.connect()
    db = client.db("herbchain")
    console.log("Connected to MongoDB at:", MONGODB_URI)
    return db
  } catch (error) {
    console.error("MongoDB connection error:", error)
    console.log("Make sure MongoDB is running locally on port 27017")
    throw error
  }
}

export async function getCollection(name: string): Promise<Collection> {
  const database = await connectToDatabase()
  return database.collection(name)
}

// Database schema types (same as before but adapted for MongoDB)
export interface User {
  _id?: string
  id: string
  email: string
  password_hash: string
  role: "farmer" | "manufacturer" | "distributor" | "regulator"
  name: string
  phone?: string
  address?: string
  aadhaar_id?: string
  license_number?: string
  created_at: Date
  updated_at: Date
}

export interface Farm {
  _id?: string
  id: string
  farmer_id: string
  name: string
  location: {
    latitude: number
    longitude: number
    address: string
  }
  area_hectares: number
  soil_type?: string
  organic_certified: boolean
  created_at: Date
}

export interface HerbBatch {
  _id?: string
  id: string
  farmer_id: string
  farm_id: string
  herb_type: string
  sanskrit_name?: string
  quantity_kg: number
  harvest_date: Date
  cultivation_method: "organic" | "conventional"
  location: {
    latitude: number
    longitude: number
  }
  photos: string[] // IPFS hashes
  blockchain_hash?: string
  qr_code?: string
  status: "harvested" | "verified" | "processed" | "packaged" | "shipped" | "delivered"
  created_at: Date
  updated_at: Date
}

export interface ProcessingRecord {
  _id?: string
  id: string
  batch_id: string
  processor_id: string
  processing_type: "drying" | "grinding" | "extraction" | "formulation"
  processing_date: Date
  lab_report_ipfs?: string
  quality_grade: "A" | "B" | "C"
  moisture_content?: number
  purity_percentage?: number
  pesticide_free: boolean
  created_at: Date
}

export interface ShipmentRecord {
  _id?: string
  id: string
  batch_id: string
  distributor_id: string
  origin_location: {
    latitude: number
    longitude: number
    address: string
  }
  destination_location: {
    latitude: number
    longitude: number
    address: string
  }
  shipment_date: Date
  expected_delivery: Date
  actual_delivery?: Date
  transport_conditions?: {
    temperature_range: string
    humidity_range: string
  }
  tracking_checkpoints: {
    timestamp: Date
    location: { latitude: number; longitude: number }
    status: string
  }[]
  created_at: Date
}

export interface AuditRecord {
  _id?: string
  id: string
  batch_id: string
  auditor_id: string
  audit_type: "quality" | "compliance" | "authenticity"
  audit_date: Date
  findings: string
  certification_status: "approved" | "rejected" | "pending"
  certificate_ipfs?: string
  created_at: Date
}

// Database operations
export class DatabaseOperations {
  static async createUser(userData: Omit<User, "_id">): Promise<User> {
    const collection = await getCollection("users")
    const result = await collection.insertOne(userData)
    return { ...userData, _id: result.insertedId.toString() }
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    const collection = await getCollection("users")
    return await collection.findOne({ email })
  }

  static async createBatch(batchData: Omit<HerbBatch, "_id">): Promise<HerbBatch> {
    const collection = await getCollection("batches")
    const result = await collection.insertOne(batchData)
    return { ...batchData, _id: result.insertedId.toString() }
  }

  static async getBatchById(id: string): Promise<HerbBatch | null> {
    const collection = await getCollection("batches")
    return await collection.findOne({ id })
  }

  static async updateBatchStatus(id: string, status: HerbBatch["status"]): Promise<void> {
    const collection = await getCollection("batches")
    await collection.updateOne({ id }, { $set: { status, updated_at: new Date() } })
  }

  static async getBatchesByFarmer(farmerId: string): Promise<HerbBatch[]> {
    const collection = await getCollection("batches")
    return await collection.find({ farmer_id: farmerId }).toArray()
  }

  static async createProcessingRecord(recordData: Omit<ProcessingRecord, "_id">): Promise<ProcessingRecord> {
    const collection = await getCollection("processing_records")
    const result = await collection.insertOne(recordData)
    return { ...recordData, _id: result.insertedId.toString() }
  }

  static async createShipmentRecord(recordData: Omit<ShipmentRecord, "_id">): Promise<ShipmentRecord> {
    const collection = await getCollection("shipment_records")
    const result = await collection.insertOne(recordData)
    return { ...recordData, _id: result.insertedId.toString() }
  }

  static async createAuditRecord(recordData: Omit<AuditRecord, "_id">): Promise<AuditRecord> {
    const collection = await getCollection("audit_records")
    const result = await collection.insertOne(recordData)
    return { ...recordData, _id: result.insertedId.toString() }
  }

  static async getRecentVerifiedBatches(limit: number): Promise<HerbBatch[]> {
    const collection = await getCollection("batches")
    return await collection
      .find({ status: { $in: ["verified", "processed", "packaged", "shipped", "delivered"] } })
      .sort({ created_at: -1 })
      .limit(limit)
      .toArray()
  }

  static async getAllBatches(): Promise<HerbBatch[]> {
    const collection = await getCollection("batches")
    return await collection.find({}).sort({ created_at: -1 }).toArray()
  }

  static async getUserById(id: string): Promise<User | null> {
    const collection = await getCollection("users")
    return await collection.findOne({ id })
  }

  static async getBatchesByStatus(status: string): Promise<HerbBatch[]> {
    const collection = await getCollection("batches")
    return await collection.find({ status }).sort({ created_at: -1 }).toArray()
  }

  static async searchBatches(criteria: any): Promise<HerbBatch[]> {
    const collection = await getCollection("batches")
    return await collection.find(criteria).sort({ created_at: -1 }).toArray()
  }

  static async updateBatch(id: string, updateData: Partial<HerbBatch>): Promise<void> {
    const collection = await getCollection("batches")
    await collection.updateOne({ id }, { $set: { ...updateData, updated_at: new Date() } })
  }
}
