import { type NextRequest, NextResponse } from "next/server"
import { DatabaseOperations } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    // Get recent verified batches for consumer browsing
    const recentBatches = await DatabaseOperations.getRecentVerifiedBatches(10)

    const publicBatches = recentBatches.map((batch) => ({
      batchId: batch.id,
      herbType: batch.herb_type,
      status: batch.status,
      collectedAt: batch.harvest_date,
      verified: batch.status === "verified" || batch.status === "delivered",
      quantityKg: batch.quantity_kg,
    }))

    return NextResponse.json({
      success: true,
      data: publicBatches,
      message: "Recent verified batches retrieved successfully",
    })
  } catch (error) {
    console.error("Consumer API error:", error)
    return NextResponse.json({ success: false, message: "Failed to retrieve batch information" }, { status: 500 })
  }
}
