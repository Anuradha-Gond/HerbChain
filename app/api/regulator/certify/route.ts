export const runtime = "nodejs"

import { type NextRequest, NextResponse } from "next/server"
import { DatabaseOperations } from "@/lib/database"
import { verifyToken } from "@/lib/auth-utils"
import { ipfs } from "@/lib/ipfs"

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    const user = await verifyToken(token)

    if (!user || user.role !== "regulator") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const { batchId, certified, notes } = await request.json()

    if (!batchId || typeof certified !== "boolean") {
      return NextResponse.json(
        { success: false, message: "Batch ID and certification status are required" },
        { status: 400 },
      )
    }

    const batch = await DatabaseOperations.getBatchById(batchId)
    if (!batch) {
      return NextResponse.json({ success: false, message: "Batch not found" }, { status: 404 })
    }

    let certificateHash = null
    if (certified) {
      // Generate digital certificate
      const certificate = {
        batchId,
        herbType: batch.herb_type,
        certificationDate: new Date().toISOString(),
        certifiedBy: user.userId,
        regulatorName: user.name,
        validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
        certificateNumber: `CERT_${Date.now()}_${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        status: "CERTIFIED",
        complianceStandards: ["Organic Certification", "Quality Standards", "Safety Regulations"],
      }

      certificateHash = await ipfs.uploadJSON(certificate)
    }

    // Create audit record for certification
    const auditRecord = {
      id: `cert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      batch_id: batchId,
      auditor_id: user.userId,
      audit_type: "authenticity" as const,
      audit_date: new Date(),
      findings: notes || (certified ? "Batch certified for market distribution" : "Batch certification denied"),
      certification_status: certified ? ("approved" as const) : ("rejected" as const),
      certificate_ipfs: certificateHash,
      created_at: new Date(),
    }

    await DatabaseOperations.createAuditRecord(auditRecord)

    return NextResponse.json({
      success: true,
      message: `Batch ${certified ? "certified" : "certification denied"} successfully`,
      data: {
        batchId,
        certified,
        notes,
        auditId: auditRecord.id,
        certificateHash,
        certificateUrl: certificateHash ? ipfs.getFileURL(certificateHash) : null,
      },
    })
  } catch (error) {
    console.error("Regulator certify error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
