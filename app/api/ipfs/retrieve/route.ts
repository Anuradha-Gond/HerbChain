// IPFS file retrieval API endpoint
export const runtime = "nodejs"
export const dynamic = "force-dynamic"

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
      const data = await ipfs.getFile(hash)
      const metadata = JSON.parse(data.toString())
      return NextResponse.json(metadata)
    }

    const fileData = await ipfs.getFile(hash)

    let contentType = "application/octet-stream"
    if (hash.endsWith(".jpg") || hash.endsWith(".jpeg")) contentType = "image/jpeg"
    else if (hash.endsWith(".png")) contentType = "image/png"
    else if (hash.endsWith(".pdf")) contentType = "application/pdf"

    return new NextResponse(fileData, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000",
      },
    })
  } catch (error) {
    console.error("IPFS retrieval error:", error)
    return NextResponse.json({ error: "Failed to retrieve from IPFS" }, { status: 500 })
  }
}
