export const runtime = "nodejs"
export const dynamic = "force-dynamic"


import { type NextRequest, NextResponse } from "next/server"
import { DatabaseOperations } from "@/lib/database"
import { verifyToken } from "@/lib/auth-utils"

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    const user = await verifyToken(token)

    if (!user || user.role !== "distributor") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    // Get batches that are ready for distribution (processed/packaged)
    const batches = await DatabaseOperations.getBatchesByStatus("processed")
    const packagedBatches = await DatabaseOperations.getBatchesByStatus("packaged")

    const allAvailableBatches = [...batches, ...packagedBatches]

    const responseData = allAvailableBatches.map((batch) => ({
      _id: batch._id,
      batchId: batch.id,
      farmer: batch.farmer_id,
      herbType: batch.herb_type,
      quantityKg: batch.quantity_kg,
      status: batch.status,
      collectedAt: batch.harvest_date.toISOString(),
      createdAt: batch.created_at.toISOString(),
      updatedAt: batch.updated_at.toISOString(),
    }))

    return NextResponse.json({
      success: true,
      data: responseData,
    })
  } catch (error) {
    console.error("Get available batches error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
