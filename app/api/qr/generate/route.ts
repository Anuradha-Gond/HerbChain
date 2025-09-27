import { type NextRequest, NextResponse } from "next/server"
import { QRCodeGenerator } from "@/lib/qr-generator"

export async function POST(request: NextRequest) {
  try {
    const batchData = await request.json()

    if (!batchData.id || !batchData.herb_name) {
      return NextResponse.json({ error: "Missing required batch data" }, { status: 400 })
    }

    const generator = QRCodeGenerator.getInstance()
    const { qrCodeUrl, qrData } = await generator.generateQRCode(batchData)

    return NextResponse.json({
      qrCodeUrl,
      qrData,
      verificationUrl: qrData.verificationUrl,
    })
  } catch (error) {
    console.error("QR generation error:", error)
    return NextResponse.json({ error: "Failed to generate QR code" }, { status: 500 })
  }
}
