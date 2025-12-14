// IPFS file retrieval API endpoint
export const runtime = "nodejs"

import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { ipfs } = await import("@/lib/ipfs") // lazy-load inside handler

    const { searchParams } = new URL(request.url)
    const hash = searchParams.get("hash")
    const type = searchParams.get("type") // 'file' or 'metadata'

    if (!hash) {
      return NextResponse.json({ error: "Hash parameter required" }, { status: 400 })
    }

    if (type === "metadata") {
      // Return metadata as JSON
      const data = await ipfs.getFile(hash)
      const metadata = JSON.parse(data.toString())
      return NextResponse.json(metadata)
    } else {
      // Return file data
      const fileData = await ipfs.getFile(hash)

      // Determine content type based on file extension or metadata
      let contentType = "application/octet-stream"
      if (hash.includes(".jpg") || hash.includes(".jpeg")) {
        contentType = "image/jpeg"
      } else if (hash.includes(".png")) {
        contentType = "image/png"
      } else if (hash.includes(".pdf")) {
        contentType = "application/pdf"
      }

      return new NextResponse(fileData, {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=31536000", // Cache for 1 year
        },
      })
    }
  } catch (error) {
    console.error("IPFS retrieval error:", error)
    return NextResponse.json({ error: "Failed to retrieve from IPFS" }, { status: 500 })
  }
}
