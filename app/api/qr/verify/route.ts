import { type NextRequest, NextResponse } from "next/server"
import { QRCodeGenerator } from "@/lib/qr-generator"

export async function POST(request: NextRequest) {
  try {
    const { encodedData } = await request.json()

    if (!encodedData) {
      return NextResponse.json({ error: "Missing QR code data" }, { status: 400 })
    }

    const generator = QRCodeGenerator.getInstance()
    const verificationResult = await generator.verifyQRCode(encodedData)

    return NextResponse.json(verificationResult)
  } catch (error) {
    console.error("QR verification error:", error)
    return NextResponse.json({ error: "Verification failed" }, { status: 500 })
  }
}
