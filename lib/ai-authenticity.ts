// AI-powered authenticity verification system
import { createHash } from "crypto"

export interface AuthenticityCheck {
  id: string
  batchId: string
  imageHash: string
  documentHash: string
  gpsCoordinates: { lat: number; lng: number }
  timestamp: Date
  authenticity_score: number
  fraud_indicators: string[]
  verification_status: "authentic" | "suspicious" | "fraudulent"
}

export interface ImageAnalysis {
  quality_score: number
  herb_species_confidence: number
  freshness_indicator: number
  contamination_detected: boolean
  color_analysis: {
    dominant_colors: string[]
    color_consistency: number
  }
}

export class AIAuthenticityVerifier {
  private static instance: AIAuthenticityVerifier

  public static getInstance(): AIAuthenticityVerifier {
    if (!AIAuthenticityVerifier.instance) {
      AIAuthenticityVerifier.instance = new AIAuthenticityVerifier()
    }
    return AIAuthenticityVerifier.instance
  }

  // Mock AI image analysis - in production would use TensorFlow.js or cloud AI
  async analyzeHerbImage(imageBuffer: Buffer): Promise<ImageAnalysis> {
    const imageHash = createHash("sha256").update(imageBuffer).digest("hex")

    // Simulate AI analysis with realistic mock data
    const mockAnalysis: ImageAnalysis = {
      quality_score: Math.random() * 0.3 + 0.7, // 70-100%
      herb_species_confidence: Math.random() * 0.2 + 0.8, // 80-100%
      freshness_indicator: Math.random() * 0.4 + 0.6, // 60-100%
      contamination_detected: Math.random() < 0.1, // 10% chance
      color_analysis: {
        dominant_colors: ["#4a5d23", "#6b7c32", "#8fbc8f"],
        color_consistency: Math.random() * 0.2 + 0.8,
      },
    }

    return mockAnalysis
  }

  // Fraud detection algorithm
  async detectFraud(
    batchData: any,
    imageAnalysis: ImageAnalysis,
    gpsCoordinates: { lat: number; lng: number },
  ): Promise<AuthenticityCheck> {
    const fraudIndicators: string[] = []
    let authenticityScore = 1.0

    // Check image quality
    if (imageAnalysis.quality_score < 0.6) {
      fraudIndicators.push("Low image quality detected")
      authenticityScore -= 0.2
    }

    // Check species confidence
    if (imageAnalysis.herb_species_confidence < 0.7) {
      fraudIndicators.push("Uncertain herb species identification")
      authenticityScore -= 0.3
    }

    // Check contamination
    if (imageAnalysis.contamination_detected) {
      fraudIndicators.push("Potential contamination detected")
      authenticityScore -= 0.4
    }

    // GPS validation (mock - would validate against known farm locations)
    if (this.isGPSLocationSuspicious(gpsCoordinates)) {
      fraudIndicators.push("GPS location inconsistent with registered farm")
      authenticityScore -= 0.3
    }

    // Time-based validation
    if (this.isTimestampSuspicious(new Date())) {
      fraudIndicators.push("Unusual timestamp pattern detected")
      authenticityScore -= 0.2
    }

    // Determine verification status
    let verificationStatus: "authentic" | "suspicious" | "fraudulent"
    if (authenticityScore >= 0.8) {
      verificationStatus = "authentic"
    } else if (authenticityScore >= 0.5) {
      verificationStatus = "suspicious"
    } else {
      verificationStatus = "fraudulent"
    }

    return {
      id: this.generateId(),
      batchId: batchData.id,
      imageHash: createHash("sha256").update(JSON.stringify(imageAnalysis)).digest("hex"),
      documentHash: createHash("sha256").update(JSON.stringify(batchData)).digest("hex"),
      gpsCoordinates,
      timestamp: new Date(),
      authenticity_score: Math.max(0, authenticityScore),
      fraud_indicators: fraudIndicators,
      verification_status: verificationStatus,
    }
  }

  private isGPSLocationSuspicious(coords: { lat: number; lng: number }): boolean {
    // Mock GPS validation - in production would check against registered farm locations
    const knownFarmRegions = [
      { lat: 28.6139, lng: 77.209, radius: 100 }, // Delhi region
      { lat: 19.076, lng: 72.8777, radius: 150 }, // Mumbai region
      { lat: 13.0827, lng: 80.2707, radius: 120 }, // Chennai region
    ]

    return !knownFarmRegions.some((region) => {
      const distance = this.calculateDistance(coords, region)
      return distance <= region.radius
    })
  }

  private calculateDistance(point1: { lat: number; lng: number }, point2: { lat: number; lng: number }): number {
    const R = 6371 // Earth's radius in km
    const dLat = ((point2.lat - point1.lat) * Math.PI) / 180
    const dLng = ((point2.lng - point1.lng) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((point1.lat * Math.PI) / 180) *
        Math.cos((point2.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  private isTimestampSuspicious(timestamp: Date): boolean {
    const now = new Date()
    const hoursDiff = Math.abs(now.getTime() - timestamp.getTime()) / (1000 * 60 * 60)

    // Flag if timestamp is more than 24 hours in the future or past
    return hoursDiff > 24
  }

  private generateId(): string {
    return "auth_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9)
  }

  // Blockchain verification
  async verifyBlockchainIntegrity(batchId: string): Promise<boolean> {
    // Mock blockchain verification - would integrate with actual Hyperledger Fabric
    try {
      // Simulate blockchain query delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock verification result (95% success rate)
      return Math.random() > 0.05
    } catch (error) {
      console.error("Blockchain verification failed:", error)
      return false
    }
  }
}

// Machine learning model for pattern recognition
export class FraudPatternDetector {
  private suspiciousPatterns: Map<string, number> = new Map()

  constructor() {
    // Initialize with known fraud patterns
    this.suspiciousPatterns.set("rapid_batch_creation", 0.7)
    this.suspiciousPatterns.set("gps_jumping", 0.8)
    this.suspiciousPatterns.set("duplicate_images", 0.9)
    this.suspiciousPatterns.set("off_season_harvesting", 0.6)
  }

  analyzePattern(batchHistory: any[]): { risk_score: number; patterns: string[] } {
    const detectedPatterns: string[] = []
    let riskScore = 0

    // Check for rapid batch creation
    if (this.detectRapidBatchCreation(batchHistory)) {
      detectedPatterns.push("rapid_batch_creation")
      riskScore += this.suspiciousPatterns.get("rapid_batch_creation") || 0
    }

    // Check for GPS jumping
    if (this.detectGPSJumping(batchHistory)) {
      detectedPatterns.push("gps_jumping")
      riskScore += this.suspiciousPatterns.get("gps_jumping") || 0
    }

    // Check for duplicate images
    if (this.detectDuplicateImages(batchHistory)) {
      detectedPatterns.push("duplicate_images")
      riskScore += this.suspiciousPatterns.get("duplicate_images") || 0
    }

    return {
      risk_score: Math.min(riskScore, 1.0),
      patterns: detectedPatterns,
    }
  }

  private detectRapidBatchCreation(batches: any[]): boolean {
    if (batches.length < 3) return false

    const recentBatches = batches.filter(
      (b) => new Date(b.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000),
    ).length

    return recentBatches > 10 // More than 10 batches in 24 hours
  }

  private detectGPSJumping(batches: any[]): boolean {
    if (batches.length < 2) return false

    for (let i = 1; i < batches.length; i++) {
      const prev = batches[i - 1].gps_coordinates
      const curr = batches[i].gps_coordinates

      if (prev && curr) {
        const distance = this.calculateDistance(prev, curr)
        const timeDiff = new Date(batches[i].created_at).getTime() - new Date(batches[i - 1].created_at).getTime()
        const hoursDiff = timeDiff / (1000 * 60 * 60)

        // If distance > 100km in less than 1 hour
        if (distance > 100 && hoursDiff < 1) {
          return true
        }
      }
    }

    return false
  }

  private detectDuplicateImages(batches: any[]): boolean {
    const imageHashes = new Set()

    for (const batch of batches) {
      if (batch.image_hash) {
        if (imageHashes.has(batch.image_hash)) {
          return true
        }
        imageHashes.add(batch.image_hash)
      }
    }

    return false
  }

  private calculateDistance(point1: { lat: number; lng: number }, point2: { lat: number; lng: number }): number {
    const R = 6371
    const dLat = ((point2.lat - point1.lat) * Math.PI) / 180
    const dLng = ((point2.lng - point1.lng) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((point1.lat * Math.PI) / 180) *
        Math.cos((point2.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }
}
