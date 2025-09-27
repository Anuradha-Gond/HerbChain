import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { DatabaseOperations } from "@/lib/database"

const JWT_SECRET = process.env.JWT_SECRET || "herbchain-secret-key"

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, JWT_SECRET) as any

    if (decoded.role !== "farmer") {
      return NextResponse.json({ success: false, message: "Access denied" }, { status: 403 })
    }

    const { herbType, quantityKg, gps } = await request.json()

    if (!herbType || !quantityKg) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
    }

    const batchId = `BATCH_${Date.now()}_${Math.random().toString(36).substr(2, 6).toUpperCase()}`

    const batchData = {
      id: batchId,
      farmer_id: decoded.userId,
      farm_id: `farm_${decoded.userId}`, // Default farm for demo
      herb_type: herbType,
      quantity_kg: quantityKg,
      harvest_date: new Date(),
      cultivation_method: "organic" as const,
      location: gps || { latitude: 28.6139, longitude: 77.209 }, // Default to Delhi
      photos: [],
      status: "harvested" as const,
      created_at: new Date(),
      updated_at: new Date(),
    }

    const batch = await DatabaseOperations.createBatch(batchData)

    // Return in the expected format
    const responseData = {
      _id: batch._id,
      batchId: batch.id,
      farmer: decoded.userId,
      herbType: batch.herb_type,
      quantityKg: batch.quantity_kg,
      gps: { lat: batch.location.latitude, lng: batch.location.longitude },
      collectedAt: batch.harvest_date.toISOString(),
      status: batch.status,
      transportLogs: [],
      labReports: [],
      createdAt: batch.created_at.toISOString(),
      updatedAt: batch.updated_at.toISOString(),
    }

    return NextResponse.json({
      success: true,
      data: responseData,
    })
  } catch (error) {
    console.error("Add batch error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
