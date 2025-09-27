// QR Code generation and verification system
import QRCode from "qrcode"
import { createHash } from "crypto"

export interface QRCodeData {
  batchId: string
  productName: string
  farmerName: string
  harvestDate: string
  expiryDate: string
  certifications: string[]
  blockchainHash: string
  verificationUrl: string
  timestamp: string
}

export interface VerificationResult {
  isValid: boolean
  batchInfo: any
  traceabilityChain: any[]
  authenticity: {
    score: number
    status: "verified" | "suspicious" | "invalid"
    lastVerified: string
  }
  certifications: any[]
  warnings: string[]
}

export class QRCodeGenerator {
  private static instance: QRCodeGenerator
  private baseUrl: string

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
  }

  public static getInstance(): QRCodeGenerator {
    if (!QRCodeGenerator.instance) {
      QRCodeGenerator.instance = new QRCodeGenerator()
    }
    return QRCodeGenerator.instance
  }

  // Generate QR code for a batch
  async generateQRCode(batchData: any): Promise<{ qrCodeUrl: string; qrData: QRCodeData }> {
    const qrData: QRCodeData = {
      batchId: batchData.id,
      productName: batchData.herb_name,
      farmerName: batchData.farmer_name,
      harvestDate: batchData.harvest_date,
      expiryDate: batchData.expiry_date,
      certifications: batchData.certifications || [],
      blockchainHash: this.generateBlockchainHash(batchData),
      verificationUrl: `${this.baseUrl}/batch/${batchData.id}`,
      timestamp: new Date().toISOString(),
    }

    const qrCodeContent = `${this.baseUrl}/batch/${batchData.id}`

    try {
      const qrCodeUrl = await QRCode.toDataURL(qrCodeContent, {
        errorCorrectionLevel: "M",
        type: "image/png",
        quality: 0.92,
        margin: 1,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
        width: 256,
      })

      return { qrCodeUrl, qrData }
    } catch (error) {
      console.error("QR Code generation failed:", error)
      throw new Error("Failed to generate QR code")
    }
  }

  // Generate batch QR codes for printing
  async generateBatchQRCodes(batchData: any, quantity: number): Promise<string[]> {
    const qrCodes: string[] = []

    for (let i = 0; i < quantity; i++) {
      const individualData = {
        ...batchData,
        id: `${batchData.id}_${i + 1}`,
        serialNumber: i + 1,
      }

      const { qrCodeUrl } = await this.generateQRCode(individualData)
      qrCodes.push(qrCodeUrl)
    }

    return qrCodes
  }

  // Verify QR code data
  async verifyQRCode(encodedData: string): Promise<VerificationResult> {
    try {
      const qrData: QRCodeData = JSON.parse(Buffer.from(encodedData, "base64").toString())

      // Fetch batch information from database
      const batchInfo = await this.fetchBatchInfo(qrData.batchId)

      if (!batchInfo) {
        return {
          isValid: false,
          batchInfo: null,
          traceabilityChain: [],
          authenticity: {
            score: 0,
            status: "invalid",
            lastVerified: new Date().toISOString(),
          },
          certifications: [],
          warnings: ["Batch not found in database"],
        }
      }

      // Verify blockchain integrity
      const blockchainValid = await this.verifyBlockchainIntegrity(qrData.blockchainHash, batchInfo)

      // Build traceability chain
      const traceabilityChain = await this.buildTraceabilityChain(qrData.batchId)

      // Calculate authenticity score
      const authenticityScore = this.calculateAuthenticityScore(qrData, batchInfo, blockchainValid)

      // Check for warnings
      const warnings = this.checkForWarnings(qrData, batchInfo)

      return {
        isValid: true,
        batchInfo,
        traceabilityChain,
        authenticity: {
          score: authenticityScore,
          status: authenticityScore > 0.8 ? "verified" : authenticityScore > 0.5 ? "suspicious" : "invalid",
          lastVerified: new Date().toISOString(),
        },
        certifications: batchInfo.certifications || [],
        warnings,
      }
    } catch (error) {
      console.error("QR verification failed:", error)
      return {
        isValid: false,
        batchInfo: null,
        traceabilityChain: [],
        authenticity: {
          score: 0,
          status: "invalid",
          lastVerified: new Date().toISOString(),
        },
        certifications: [],
        warnings: ["Invalid QR code format"],
      }
    }
  }

  private generateBlockchainHash(batchData: any): string {
    const dataString = JSON.stringify({
      id: batchData.id,
      farmer_id: batchData.farmer_id,
      harvest_date: batchData.harvest_date,
      herb_name: batchData.herb_name,
    })
    return createHash("sha256").update(dataString).digest("hex")
  }

  private async fetchBatchInfo(batchId: string): Promise<any> {
    // Mock database fetch - in production would query actual database
    const mockBatches = [
      {
        id: "BATCH001",
        herb_name: "Ashwagandha",
        farmer_name: "Rajesh Kumar",
        farmer_id: "FARMER001",
        harvest_date: "2024-01-15",
        expiry_date: "2025-01-15",
        location: "Rajasthan, India",
        certifications: ["Organic", "Fair Trade"],
        processing_date: "2024-01-20",
        quality_grade: "A",
        moisture_content: "8%",
        active_compounds: {
          withanolides: "2.5%",
        },
      },
    ]

    return mockBatches.find((batch) => batch.id === batchId) || null
  }

  private async verifyBlockchainIntegrity(hash: string, batchInfo: any): Promise<boolean> {
    // Mock blockchain verification
    const expectedHash = this.generateBlockchainHash(batchInfo)
    return hash === expectedHash
  }

  private async buildTraceabilityChain(batchId: string): Promise<any[]> {
    // Mock traceability chain - in production would query blockchain
    return [
      {
        stage: "Cultivation",
        actor: "Rajesh Kumar (Farmer)",
        location: "Rajasthan, India",
        date: "2024-01-15",
        actions: ["Planting", "Organic farming practices", "Harvest"],
        certifications: ["Organic Certificate"],
        gps_coordinates: { lat: 27.0238, lng: 74.2179 },
      },
      {
        stage: "Processing",
        actor: "Ayurvedic Herbs Pvt Ltd",
        location: "Gujarat, India",
        date: "2024-01-20",
        actions: ["Cleaning", "Drying", "Quality testing"],
        certifications: ["GMP Certificate"],
        gps_coordinates: { lat: 23.0225, lng: 72.5714 },
      },
      {
        stage: "Packaging",
        actor: "Green Pack Industries",
        location: "Maharashtra, India",
        date: "2024-01-25",
        actions: ["Packaging", "Labeling", "QR code generation"],
        certifications: ["ISO 22000"],
        gps_coordinates: { lat: 19.076, lng: 72.8777 },
      },
    ]
  }

  private calculateAuthenticityScore(qrData: QRCodeData, batchInfo: any, blockchainValid: boolean): number {
    let score = 1.0

    // Check blockchain integrity
    if (!blockchainValid) {
      score -= 0.4
    }

    // Check expiry date
    const expiryDate = new Date(qrData.expiryDate)
    const now = new Date()
    if (expiryDate < now) {
      score -= 0.3
    }

    // Check data consistency
    if (qrData.productName !== batchInfo.herb_name) {
      score -= 0.2
    }

    if (qrData.farmerName !== batchInfo.farmer_name) {
      score -= 0.2
    }

    // Check timestamp validity
    const qrTimestamp = new Date(qrData.timestamp)
    const harvestDate = new Date(qrData.harvestDate)
    if (qrTimestamp < harvestDate) {
      score -= 0.3
    }

    return Math.max(0, score)
  }

  private checkForWarnings(qrData: QRCodeData, batchInfo: any): string[] {
    const warnings: string[] = []

    // Check expiry
    const expiryDate = new Date(qrData.expiryDate)
    const now = new Date()
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    if (daysUntilExpiry < 0) {
      warnings.push("Product has expired")
    } else if (daysUntilExpiry < 30) {
      warnings.push(`Product expires in ${daysUntilExpiry} days`)
    }

    // Check for recalls
    if (this.isProductRecalled(qrData.batchId)) {
      warnings.push("This batch has been recalled")
    }

    // Check storage conditions
    if (this.hasStorageIssues(batchInfo)) {
      warnings.push("Storage condition violations detected")
    }

    return warnings
  }

  private isProductRecalled(batchId: string): boolean {
    // Mock recall check - in production would check recall database
    const recalledBatches = ["BATCH999", "BATCH888"]
    return recalledBatches.includes(batchId)
  }

  private hasStorageIssues(batchInfo: any): boolean {
    // Mock storage condition check
    if (batchInfo.moisture_content) {
      const moisture = Number.parseFloat(batchInfo.moisture_content.replace("%", ""))
      return moisture > 12 // Too high moisture content
    }
    return false
  }
}

// Consumer verification utilities
export class ConsumerVerification {
  static async scanQRCode(imageFile: File): Promise<string | null> {
    // Mock QR code scanning - in production would use a QR code scanning library
    // This would typically use jsQR or similar library to decode QR codes from images
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock successful scan
        const mockQRData = {
          batchId: "BATCH001",
          productName: "Ashwagandha",
          farmerName: "Rajesh Kumar",
          harvestDate: "2024-01-15",
          expiryDate: "2025-01-15",
          certifications: ["Organic", "Fair Trade"],
          blockchainHash: "abc123def456",
          verificationUrl: "http://localhost:3000/batch/BATCH001",
          timestamp: new Date().toISOString(),
        }

        const encodedData = Buffer.from(JSON.stringify(mockQRData)).toString("base64")
        resolve(encodedData)
      }, 1000)
    })
  }

  static generateConsumerReport(verificationResult: VerificationResult): any {
    return {
      productInfo: {
        name: verificationResult.batchInfo?.herb_name,
        farmer: verificationResult.batchInfo?.farmer_name,
        location: verificationResult.batchInfo?.location,
        harvestDate: verificationResult.batchInfo?.harvest_date,
        qualityGrade: verificationResult.batchInfo?.quality_grade,
      },
      authenticity: verificationResult.authenticity,
      certifications: verificationResult.certifications,
      traceabilityChain: verificationResult.traceabilityChain,
      warnings: verificationResult.warnings,
      verificationDate: new Date().toISOString(),
      reportId: `RPT_${Date.now()}`,
    }
  }
}
