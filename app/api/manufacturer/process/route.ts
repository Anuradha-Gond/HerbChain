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

    const { batchId, status, notes } = await request.json()

    if (!batchId || !status) {
      return NextResponse.json({ success: false, message: "Batch ID and status are required" }, { status: 400 })
    }

    const batch = await DatabaseOperations.getBatchById(batchId)
    if (!batch) {
      return NextResponse.json({ success: false, message: "Batch not found" }, { status: 404 })
    }

    // Update batch status
    await DatabaseOperations.updateBatchStatus(batchId, status)

    return NextResponse.json({
      success: true,
      message: "Batch processing updated successfully",
      data: { batchId, status, notes },
    })
  } catch (error) {
    console.error("Manufacturer process error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
