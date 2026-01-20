export const runtime = "nodejs"

import { type NextRequest, NextResponse } from "next/server"
import { DatabaseOperations } from "@/lib/database"
import { verifyToken } from "@/lib/auth-utils"
//import { ipfs } from "@/lib/ipfs"

export async function POST(request: NextRequest) {
  try {
    // Verify distributor/manufacturer token
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    const user = await verifyToken(token)

    if (!user || user.role !== "manufacturer") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    // Parse form data
    const formData = await request.formData()
    const batchId = formData.get("batchId") as string
    const labReport = formData.get("labReport") as File

    if (!batchId || !labReport) {
      return NextResponse.json(
        { success: false, message: "Batch ID and lab report are required" },
        { status: 400 }
      )
    }

    const batch = await DatabaseOperations.getBatchById(batchId)
    if (!batch) {
      return NextResponse.json({ success: false, message: "Batch not found" }, { status: 404 })
    }

    // Convert file to buffer and handle missing name
    const buffer = Buffer.from(await labReport.arrayBuffer())
    const labReportName = labReport.name || `lab_report_${Date.now()}.pdf`
    const labReportHash = await ipfs.uploadFile(buffer, labReportName)

    // Create processing record
    const processingRecord = {
      id: `proc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      batch_id: batchId,
      processor_id: user.userId,
      processing_type: "formulation" as const,
      processing_date: new Date(),
      lab_report_ipfs: labReportHash,
      quality_grade: "A" as const,
      moisture_content: 8.5,
      purity_percentage: 95.2,
      pesticide_free: true,
      created_at: new Date(),
    }

    await DatabaseOperations.createProcessingRecord(processingRecord)

    return NextResponse.json({
      success: true,
      message: "Lab report uploaded successfully",
      data: {
        batchId,
        labReportHash,
        labReportUrl: ipfs.getFileURL(labReportHash),
      },
    })
  } catch (error) {
    console.error("Lab report upload error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
