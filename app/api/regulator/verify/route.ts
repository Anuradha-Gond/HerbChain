import { type NextRequest, NextResponse } from "next/server"
import { DatabaseOperations } from "@/lib/database"
import { verifyToken } from "@/lib/auth-utils"

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    const user = await verifyToken(token)

    if (!user || user.role !== "regulator") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const { batchId, verified, notes } = await request.json()

    if (!batchId || typeof verified !== "boolean") {
      return NextResponse.json(
        { success: false, message: "Batch ID and verification status are required" },
        { status: 400 },
      )
    }

    const batch = await DatabaseOperations.getBatchById(batchId)
    if (!batch) {
      return NextResponse.json({ success: false, message: "Batch not found" }, { status: 404 })
    }

    // Create audit record
    const auditRecord = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      batch_id: batchId,
      auditor_id: user.userId,
      audit_type: "compliance" as const,
      audit_date: new Date(),
      findings: notes || (verified ? "Batch meets all regulatory requirements" : "Batch failed compliance check"),
      certification_status: verified ? ("approved" as const) : ("rejected" as const),
      created_at: new Date(),
    }

    await DatabaseOperations.createAuditRecord(auditRecord)

    // Update batch status based on verification
    const newStatus = verified ? "verified" : "harvested" // Reset to harvested if rejected
    await DatabaseOperations.updateBatchStatus(batchId, newStatus)

    return NextResponse.json({
      success: true,
      message: `Batch ${verified ? "verified" : "rejected"} successfully`,
      data: { batchId, verified, notes, auditId: auditRecord.id },
    })
  } catch (error) {
    console.error("Regulator verify error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
