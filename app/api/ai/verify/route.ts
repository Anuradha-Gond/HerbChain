import { type NextRequest, NextResponse } from "next/server"
import { AIAuthenticityVerifier, FraudPatternDetector } from "@/lib/ai-authenticity"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image = formData.get("image") as File
    const batchData = JSON.parse(formData.get("batchData") as string)
    const gpsCoordinates = JSON.parse(formData.get("gpsCoordinates") as string)

    if (!image || !batchData || !gpsCoordinates) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const verifier = AIAuthenticityVerifier.getInstance()
    const patternDetector = new FraudPatternDetector()

    // Convert image to buffer
    const imageBuffer = Buffer.from(await image.arrayBuffer())

    // Analyze image
    const imageAnalysis = await verifier.analyzeHerbImage(imageBuffer)

    // Detect fraud
    const authenticityCheck = await verifier.detectFraud(batchData, imageAnalysis, gpsCoordinates)

    // Analyze patterns (mock batch history)
    const mockBatchHistory = [{ ...batchData, created_at: new Date().toISOString(), gps_coordinates: gpsCoordinates }]
    const patternAnalysis = patternDetector.analyzePattern(mockBatchHistory)

    // Verify blockchain integrity
    const blockchainVerified = await verifier.verifyBlockchainIntegrity(batchData.id)

    const response = {
      authenticity_check: authenticityCheck,
      image_analysis: imageAnalysis,
      pattern_analysis: patternAnalysis,
      blockchain_verified: blockchainVerified,
      overall_status: authenticityCheck.verification_status,
      confidence_score: authenticityCheck.authenticity_score,
      recommendations: generateRecommendations(authenticityCheck, patternAnalysis),
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("AI verification error:", error)
    return NextResponse.json({ error: "Verification failed" }, { status: 500 })
  }
}

function generateRecommendations(authenticityCheck: any, patternAnalysis: any): string[] {
  const recommendations: string[] = []

  if (authenticityCheck.verification_status === "fraudulent") {
    recommendations.push("Immediate investigation required")
    recommendations.push("Block batch from further processing")
    recommendations.push("Alert regulatory authorities")
  } else if (authenticityCheck.verification_status === "suspicious") {
    recommendations.push("Manual verification recommended")
    recommendations.push("Request additional documentation")
    recommendations.push("Conduct on-site inspection")
  }

  if (patternAnalysis.risk_score > 0.7) {
    recommendations.push("Monitor farmer activity closely")
    recommendations.push("Implement additional verification steps")
  }

  if (authenticityCheck.fraud_indicators.length > 0) {
    recommendations.push("Address identified fraud indicators")
    recommendations.push("Provide farmer training on proper documentation")
  }

  return recommendations
}
