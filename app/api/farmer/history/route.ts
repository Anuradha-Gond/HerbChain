export const runtime = "nodejs"

import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { DatabaseOperations } from "@/lib/database"

const JWT_SECRET = process.env.JWT_SECRET || "herbchain-secret-key"

export async function GET(request: NextRequest) {
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

    const batches = await DatabaseOperations.getBatchesByFarmer(decoded.userId)

    const responseData = batches.map((batch) => ({
      _id: batch._id,
      batchId: batch.id,
      farmer: decoded.userId,
      herbType: batch.herb_type,
      quantityKg: batch.quantity_kg,
      gps: { lat: batch.location.latitude, lng: batch.location.longitude },
      collectedAt: batch.harvest_date.toISOString(),
      status: batch.status === "harvested" ? "created" : batch.status,
      transportLogs: [],
      labReports: [],
      createdAt: batch.created_at.toISOString(),
      updatedAt: batch.updated_at.toISOString(),
    }))

    return NextResponse.json({
      success: true,
      data: responseData,
    })
  } catch (error) {
    console.error("Get farmer history error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
