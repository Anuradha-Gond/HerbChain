import { type NextRequest, NextResponse } from "next/server"
import { DatabaseOperations } from "@/lib/database"
import { verifyToken } from "@/lib/auth-utils"

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    const user = await verifyToken(token)

    if (!user || user.role !== "manufacturer") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const { batchId, notes } = await request.json()

    if (!batchId) {
      return NextResponse.json({ success: false, message: "Batch ID is required" }, { status: 400 })
    }

    const batch = await DatabaseOperations.getBatchById(batchId)
    if (!batch) {
      return NextResponse.json({ success: false, message: "Batch not found" }, { status: 404 })
    }

    // Update batch status to received by manufacturer
    await DatabaseOperations.updateBatchStatus(batchId, "processed")

    // Create processing record
    const processingRecord = {
      id: `proc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      batch_id: batchId,
      processor_id: user.userId,
      processing_type: "drying" as const,
      processing_date: new Date(),
      quality_grade: "A" as const,
      pesticide_free: true,
      created_at: new Date(),
    }

    await DatabaseOperations.createProcessingRecord(processingRecord)

    return NextResponse.json({
      success: true,
      message: "Batch received successfully",
      data: { batchId, status: "processed", notes },
    })
  } catch (error) {
    console.error("Manufacturer receive error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
