"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Leaf, Shield, Truck, Factory } from "@/lib/icon-fallbacks"
import Link from "next/link"
import QRScanner from "@/components/qr-scanner"

// Simple icon components for missing icons
const QrCode = ({ className = "", ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <rect
      x="3"
      y="3"
      width="18"
      height="18"
      rx="2"
      ry="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
    />
    <rect x="7" y="7" width="3" height="3" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
    <rect x="14" y="7" width="3" height="3" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
    <rect x="7" y="14" width="3" height="3" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
  </svg>
)

const CheckCircle = ({ className = "", ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
)

const Building2 = ({ className = "", ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
    />
  </svg>
)

const FileText = ({ className = "", ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
)

const Camera = ({ className = "", ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const AlertCircle = ({ className = "", ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
    <line x1="12" y1="8" x2="12" y2="12" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
    <line x1="12" y1="16" x2="12.01" y2="16" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
  </svg>
)

const Globe = ({ className = "", ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
    <line x1="2" y1="12" x2="22" y2="12" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"
    />
  </svg>
)

const Award = ({ className = "", ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <circle cx="12" cy="8" r="7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
    <polyline
      points="8.21,13.89 7,23 12,20 17,23 15.79,13.88"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
    />
  </svg>
)

// Mock product data
const mockProductData = {
  id: "HB001",
  productName: "Premium Ashwagandha Powder",
  herbType: "Ashwagandha",
  batchId: "HB001",
  isVerified: true,
  blockchainHash: "0x1a2b3c4d5e6f7890abcdef1234567890",

  // Farm details
  farmer: {
    name: "Rajesh Kumar",
    farmId: "F001",
    location: "Farm Plot A1, Rajasthan, India",
    coordinates: "26.9124° N, 75.7873° E",
    cultivationMethod: "Organic",
    harvestDate: "2024-01-15",
    certifications: ["Organic", "AYUSH Certified"],
  },

  // Manufacturing details
  manufacturer: {
    name: "Ayurvedic Herbs Processing Ltd.",
    location: "Jaipur, Rajasthan",
    processedDate: "2024-01-18",
    batchSize: "50 kg",
    labReport: {
      testDate: "2024-01-17",
      purityLevel: "95.8%",
      moistureContent: "8.2%",
      pesticideTest: "Not Detected",
      heavyMetals: "Within Limits",
      microbialTest: "Passed",
    },
    certifications: ["ISO 22000", "GMP Certified", "FSSAI Licensed"],
  },

  // Distribution details
  distributor: {
    name: "Global Ayurveda Exports",
    shipmentId: "SH001",
    packagedDate: "2024-01-20",
    expiryDate: "2024-07-20",
    storageConditions: "Cool, dry place below 25°C",
  },

  // Regulatory approval
  regulatory: {
    approvedBy: "AYUSH Ministry",
    certificationDate: "2024-01-21",
    complianceScore: 95,
    status: "Approved",
  },
}

export default function ConsumerVerifyPage() {
  const [qrInput, setQrInput] = useState("")
  const [productData, setProductData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showScanner, setShowScanner] = useState(false)

  const handleVerifyProduct = async () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      if (qrInput === "HB001" || qrInput.includes("HB001")) {
        setProductData(mockProductData)
      } else {
        setProductData(null)
      }
      setIsLoading(false)
    }, 1500)
  }

  const handleQRScan = (result: string) => {
    setQrInput(result)
    setShowScanner(false)
    // Auto-verify after scanning
    setTimeout(() => {
      handleVerifyProduct()
    }, 100)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 hover:bg-muted rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-semibold text-foreground">Product Verification</h1>
                <p className="text-xs text-muted-foreground">Verify Ayurvedic Product Authenticity</p>
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Verification Input */}
        <Card className="mb-8">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <QrCode className="w-6 h-6" />
              Verify Your Product
            </CardTitle>
            <CardDescription>
              Scan the QR code on your product or enter the batch ID to verify authenticity and view complete supply
              chain information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 space-y-2">
                <Label htmlFor="qr-input">Product QR Code or Batch ID</Label>
                <Input
                  id="qr-input"
                  placeholder="Enter batch ID (e.g., HB001) or scan QR code"
                  value={qrInput}
                  onChange={(e) => setQrInput(e.target.value)}
                  className="text-center"
                />
              </div>
              <div className="flex gap-2 sm:flex-col sm:justify-end">
                <Button onClick={handleVerifyProduct} disabled={!qrInput || isLoading} className="flex-1 sm:flex-none">
                  {isLoading ? "Verifying..." : "Verify Product"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowScanner(true)}
                  className="flex-1 sm:flex-none bg-transparent"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Scan QR
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <QRScanner isOpen={showScanner} onScan={handleQRScan} onClose={() => setShowScanner(false)} />

        {/* Product Verification Results */}
        {productData && (
          <div className="space-y-6">
            {/* Verification Status */}
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <div>
                    <h2 className="text-xl font-bold text-green-800">Product Verified</h2>
                    <p className="text-green-700">This product is authentic and blockchain-secured</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span>Blockchain Verified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-green-600" />
                    <span>AYUSH Certified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Lab Tested</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-green-600" />
                    <span>Export Quality</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="w-5 h-5" />
                  Product Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Product Name</Label>
                      <p className="font-semibold">{productData.productName}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Herb Type</Label>
                      <p>{productData.herbType}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Batch ID</Label>
                      <p className="font-mono">{productData.batchId}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Expiry Date</Label>
                      <p>{productData.distributor.expiryDate}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Storage Conditions</Label>
                      <p>{productData.distributor.storageConditions}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Blockchain Hash</Label>
                      <p className="font-mono text-xs break-all">{productData.blockchainHash}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Supply Chain Journey */}
            <Card>
              <CardHeader>
                <CardTitle>Supply Chain Journey</CardTitle>
                <CardDescription>Complete traceability from farm to your hands</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Farm Stage */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Leaf className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="w-px h-16 bg-border mt-2"></div>
                  </div>
                  <div className="flex-1 pb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">Farm Cultivation</h3>
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                        Verified
                      </Badge>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Farmer</p>
                        <p className="font-medium">{productData.farmer.name}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Harvest Date</p>
                        <p>{productData.farmer.harvestDate}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Location</p>
                        <p>{productData.farmer.location}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Method</p>
                        <p>{productData.farmer.cultivationMethod}</p>
                      </div>
                    </div>
                    <div className="flex gap-1 mt-2">
                      {productData.farmer.certifications.map((cert: string) => (
                        <Badge key={cert} variant="secondary" className="text-xs">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Manufacturing Stage */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Factory className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="w-px h-16 bg-border mt-2"></div>
                  </div>
                  <div className="flex-1 pb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">Manufacturing & Testing</h3>
                      <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                        Lab Tested
                      </Badge>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Manufacturer</p>
                        <p className="font-medium">{productData.manufacturer.name}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Processed Date</p>
                        <p>{productData.manufacturer.processedDate}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Batch Size</p>
                        <p>{productData.manufacturer.batchSize}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Purity Level</p>
                        <p>{productData.manufacturer.labReport.purityLevel}</p>
                      </div>
                    </div>
                    <div className="flex gap-1 mt-2">
                      {productData.manufacturer.certifications.map((cert: string) => (
                        <Badge key={cert} variant="secondary" className="text-xs">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Distribution Stage */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Truck className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="w-px h-16 bg-border mt-2"></div>
                  </div>
                  <div className="flex-1 pb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">Distribution & Packaging</h3>
                      <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
                        Tracked
                      </Badge>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Distributor</p>
                        <p className="font-medium">{productData.distributor.name}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Packaged Date</p>
                        <p>{productData.distributor.packagedDate}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Shipment ID</p>
                        <p className="font-mono">{productData.distributor.shipmentId}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Regulatory Approval */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Shield className="w-5 h-5 text-yellow-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">Regulatory Approval</h3>
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                        {productData.regulatory.status}
                      </Badge>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Approved By</p>
                        <p className="font-medium">{productData.regulatory.approvedBy}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Certification Date</p>
                        <p>{productData.regulatory.certificationDate}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Compliance Score</p>
                        <p>{productData.regulatory.complianceScore}%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lab Report Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Laboratory Test Report
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-green-600">
                      {productData.manufacturer.labReport.purityLevel}
                    </p>
                    <p className="text-sm text-muted-foreground">Purity Level</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">
                      {productData.manufacturer.labReport.moistureContent}
                    </p>
                    <p className="text-sm text-muted-foreground">Moisture Content</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-green-600">✓</p>
                    <p className="text-sm text-muted-foreground">Pesticide Test</p>
                    <p className="text-xs text-green-600">{productData.manufacturer.labReport.pesticideTest}</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-green-600">✓</p>
                    <p className="text-sm text-muted-foreground">Heavy Metals</p>
                    <p className="text-xs text-green-600">{productData.manufacturer.labReport.heavyMetals}</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-green-600">✓</p>
                    <p className="text-sm text-muted-foreground">Microbial Test</p>
                    <p className="text-xs text-green-600">{productData.manufacturer.labReport.microbialTest}</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-sm font-medium">Test Date</p>
                    <p className="text-sm text-muted-foreground">{productData.manufacturer.labReport.testDate}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trust Indicators */}
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 text-green-800">Trust & Safety Indicators</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm">Blockchain secured and immutable</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm">Government certified and approved</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm">Laboratory tested for purity</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm">Complete supply chain transparency</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* No Product Found */}
        {qrInput && !productData && !isLoading && (
          <Card className="border-l-4 border-l-red-500">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-8 h-8 text-red-600" />
                <div>
                  <h2 className="text-xl font-bold text-red-800">Product Not Found</h2>
                  <p className="text-red-700">
                    The QR code or batch ID you entered could not be verified. Please check the code and try again.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
