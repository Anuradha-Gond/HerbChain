import { type NextRequest, NextResponse } from "next/server"
import { DatabaseOperations } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const batchId = params.id

    if (!batchId) {
      return NextResponse.json({ success: false, message: "Batch ID is required" }, { status: 400 })
    }

    // Get batch information for consumer verification
    const batch = await DatabaseOperations.getBatchById(batchId)

    if (!batch) {
      return NextResponse.json({ success: false, message: "Batch not found" }, { status: 404 })
    }

    const publicBatchInfo = {
      batchId: batch.id,
      herbType: batch.herb_type,
      quantityKg: batch.quantity_kg,
      status: batch.status,
      collectedAt: batch.harvest_date,
      cultivationMethod: batch.cultivation_method,
      location: batch.location,
      // Include farmer info (public)
      farmer: {
        name: batch.farmer_name || "Verified Farmer",
        location: `${batch.location.latitude}, ${batch.location.longitude}`,
      },
      // Include verification status
      verified: batch.status === "verified" || batch.status === "delivered",
      certificationDate: batch.updated_at,
      // QR generation timestamp
      qrGeneratedAt: batch.created_at,
      blockchainHash: batch.blockchain_hash,
      detailsUrl: `/batch/${batch.id}`,
    }

    return NextResponse.json({
      success: true,
      data: publicBatchInfo,
      message: "Batch information retrieved successfully",
    })
  } catch (error) {
    console.error("Consumer scan error:", error)
    return NextResponse.json({ success: false, message: "Failed to retrieve batch information" }, { status: 500 })
  }
}
