// Force Node runtime to allow Buffer, crypto, etc.
export const runtime = "nodejs"

import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth-utils"

export async function POST(request: NextRequest) {
  try {
    // Lazy-load IPFS inside handler
    const { ipfs } = await import("@/lib/ipfs")

    // Verify user
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    const user = await verifyToken(token)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get form data
    const formData = await request.formData()
    const file = formData.get("file") as File
    const fileType = formData.get("fileType") as string // 'image', 'document', 'lab-report'
    const metadata = formData.get("metadata") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Convert file to buffer inside handler
    const buffer = Buffer.from(await file.arrayBuffer())

    // Upload file to IPFS
    const fileHash = await ipfs.uploadFile(buffer, file.name)

    // Create metadata object
    const metadataObj = {
      filename: file.name,
      fileType: fileType,
      size: file.size,
      uploadedBy: user.userId,
      uploadedAt: new Date().toISOString(),
      ...(metadata ? JSON.parse(metadata) : {}),
    }

    // Upload metadata to IPFS
    const metadataHash = await ipfs.uploadJSON(metadataObj)

    // Pin files
    await ipfs.pinFile(fileHash)
    await ipfs.pinFile(metadataHash)

    return NextResponse.json({
      success: true,
      fileHash,
      metadataHash,
      fileUrl: ipfs.getFileURL(fileHash),
      metadataUrl: ipfs.getFileURL(metadataHash),
    })
  } catch (error) {
    console.error("IPFS upload error:", error)
    return NextResponse.json({ error: "Failed to upload to IPFS" }, { status: 500 })
  }
}
