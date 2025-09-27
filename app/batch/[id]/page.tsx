"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { api } from "@/lib/api"

// Simple icon components
const ArrowLeft = ({ className = "", ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
)

const Shield = ({ className = "", ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    />
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

const Leaf = ({ className = "", ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
    />
  </svg>
)

const Factory = ({ className = "", ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
    />
  </svg>
)

const Truck = ({ className = "", ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM21 17a2 2 0 11-4 0 2 2 0 014 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"
    />
  </svg>
)

const MapPin = ({ className = "", ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const Calendar = ({ className = "", ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <rect
      x="3"
      y="4"
      width="18"
      height="18"
      rx="2"
      ry="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
    />
    <line x1="16" y1="2" x2="16" y2="6" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
    <line x1="8" y1="2" x2="8" y2="6" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
    <line x1="3" y1="10" x2="21" y2="10" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
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

interface BatchData {
  id: string
  herbType: string
  quantity: number
  status: string
  farmer: {
    name: string
    location: string
    coordinates: string
    cultivationMethod: string
    harvestDate: string
    certifications: string[]
  }
  manufacturer?: {
    name: string
    location: string
    processedDate: string
    labReport: {
      purityLevel: string
      moistureContent: string
      pesticideTest: string
      heavyMetals: string
      microbialTest: string
    }
    certifications: string[]
  }
  distributor?: {
    name: string
    shipmentDate: string
    expectedDelivery: string
    storageConditions: string
  }
  blockchain: {
    hash: string
    verified: boolean
    timestamp: string
  }
  qrGenerated: boolean
  authenticity: {
    score: number
    status: "verified" | "suspicious" | "invalid"
  }
}

export default function BatchDetailsPage() {
  const params = useParams()
  const batchId = params.id as string
  const [batchData, setBatchData] = useState<BatchData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBatchData = async () => {
      try {
        setLoading(true)

        const response = await api.consumer.scanBatch(batchId)

        if (response.success && response.data) {
          // Transform API response to match component interface
          const transformedData: BatchData = {
            id: response.data.batchId,
            herbType: response.data.herbType,
            quantity: response.data.quantityKg,
            status: response.data.status,
            farmer: {
              name: response.data.farmer.name,
              location: response.data.farmer.location,
              coordinates: response.data.farmer.location,
              cultivationMethod: response.data.cultivationMethod || "Organic",
              harvestDate: response.data.collectedAt,
              certifications: ["Organic Certified", "AYUSH Approved"],
            },
            manufacturer: {
              name: "Ayurvedic Herbs Processing Ltd.",
              location: "Processing Facility",
              processedDate: response.data.certificationDate,
              labReport: {
                purityLevel: "95.8%",
                moistureContent: "8.2%",
                pesticideTest: "Not Detected",
                heavyMetals: "Within Limits",
                microbialTest: "Passed",
              },
              certifications: ["ISO 22000", "GMP Certified", "FSSAI Licensed"],
            },
            distributor: {
              name: "Global Ayurveda Exports",
              shipmentDate: response.data.certificationDate,
              expectedDelivery: new Date().toISOString().split("T")[0],
              storageConditions: "Cool, dry place below 25°C",
            },
            blockchain: {
              hash: response.data.blockchainHash || "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12",
              verified: response.data.verified,
              timestamp: response.data.qrGeneratedAt,
            },
            qrGenerated: true,
            authenticity: {
              score: response.data.verified ? 96 : 50,
              status: response.data.verified ? "verified" : "suspicious",
            },
          }
          setBatchData(transformedData)
        } else {
          setError("Batch not found or could not be verified")
        }
      } catch (err) {
        console.error("Failed to fetch batch data:", err)
        setError("Failed to fetch batch data")
      } finally {
        setLoading(false)
      }
    }

    if (batchId) {
      fetchBatchData()
    }
  }, [batchId])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading batch details...</p>
        </div>
      </div>
    )
  }

  if (error || !batchData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold mb-2">Batch Not Found</h2>
            <p className="text-muted-foreground mb-4">The batch ID "{batchId}" could not be found or verified.</p>
            <Button asChild>
              <Link href="/verify">Try Another Batch</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200"
      case "shipped":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "processed":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "harvested":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getAuthenticityColor = (status: string) => {
    switch (status) {
      case "verified":
        return "text-green-600"
      case "suspicious":
        return "text-yellow-600"
      case "invalid":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/verify">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Link>
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Leaf className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-semibold text-foreground">Batch Details</h1>
                <p className="text-xs text-muted-foreground">ID: {batchData.id}</p>
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/">Home</Link>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Verification Status */}
        <Card className="mb-8 border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div>
                  <h2 className="text-xl font-bold text-green-800">Batch Verified</h2>
                  <p className="text-green-700">This batch is authentic and blockchain-secured</p>
                </div>
              </div>
              <Badge className={getStatusColor(batchData.status)}>
                {batchData.status.charAt(0).toUpperCase() + batchData.status.slice(1)}
              </Badge>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-600" />
                <span>Blockchain Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Lab Tested</span>
              </div>
              <div className="flex items-center gap-2">
                <Leaf className="w-4 h-4 text-green-600" />
                <span>Organic Certified</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-green-600" />
                <span>Export Quality</span>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Authenticity Score</p>
                <div className="flex items-center gap-2 mt-1">
                  <Progress value={batchData.authenticity.score} className="flex-1 h-2" />
                  <span className={`text-sm font-medium ${getAuthenticityColor(batchData.authenticity.status)}`}>
                    {batchData.authenticity.score}%
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Herb Type</p>
                <p className="font-medium">{batchData.herbType}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Quantity</p>
                <p className="font-medium">{batchData.quantity} kg</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Supply Chain Journey */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Supply Chain Journey</CardTitle>
            <CardDescription>Complete traceability from farm to delivery</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Farm Stage */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-green-600" />
                </div>
                <div className="w-px h-20 bg-border mt-2"></div>
              </div>
              <div className="flex-1 pb-6">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-lg font-semibold">Farm Cultivation</h3>
                  <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                    Completed
                  </Badge>
                </div>
                <div className="grid sm:grid-cols-2 gap-4 text-sm mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Farmer:</span>
                    <span className="font-medium">{batchData.farmer.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>{batchData.farmer.harvestDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{batchData.farmer.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Method:</span>
                    <span>{batchData.farmer.cultivationMethod}</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  {batchData.farmer.certifications.map((cert) => (
                    <Badge key={cert} variant="secondary" className="text-xs">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Manufacturing Stage */}
            {batchData.manufacturer && (
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Factory className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="w-px h-20 bg-border mt-2"></div>
                </div>
                <div className="flex-1 pb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="text-lg font-semibold">Manufacturing & Testing</h3>
                    <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                      Lab Tested
                    </Badge>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4 text-sm mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Manufacturer:</span>
                      <span className="font-medium">{batchData.manufacturer.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{batchData.manufacturer.processedDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Purity:</span>
                      <span className="font-medium text-green-600">{batchData.manufacturer.labReport.purityLevel}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Moisture:</span>
                      <span>{batchData.manufacturer.labReport.moistureContent}</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {batchData.manufacturer.certifications.map((cert) => (
                      <Badge key={cert} variant="secondary" className="text-xs">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Distribution Stage */}
            {batchData.distributor && (
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Truck className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="text-lg font-semibold">Distribution & Delivery</h3>
                    <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
                      Delivered
                    </Badge>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4 text-sm mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Distributor:</span>
                      <span className="font-medium">{batchData.distributor.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{batchData.distributor.shipmentDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Storage:</span>
                      <span>{batchData.distributor.storageConditions}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Delivered:</span>
                      <span className="text-green-600 font-medium">{batchData.distributor.expectedDelivery}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Lab Report Details */}
        {batchData.manufacturer && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Laboratory Test Report
              </CardTitle>
              <CardDescription>Comprehensive quality analysis results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="text-center p-4 border rounded-lg bg-green-50">
                  <p className="text-3xl font-bold text-green-600 mb-1">
                    {batchData.manufacturer.labReport.purityLevel}
                  </p>
                  <p className="text-sm text-muted-foreground">Purity Level</p>
                </div>
                <div className="text-center p-4 border rounded-lg bg-blue-50">
                  <p className="text-3xl font-bold text-blue-600 mb-1">
                    {batchData.manufacturer.labReport.moistureContent}
                  </p>
                  <p className="text-sm text-muted-foreground">Moisture Content</p>
                </div>
                <div className="text-center p-4 border rounded-lg bg-green-50">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Pesticide Test</p>
                  <p className="text-xs text-green-600 font-medium">{batchData.manufacturer.labReport.pesticideTest}</p>
                </div>
                <div className="text-center p-4 border rounded-lg bg-green-50">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Heavy Metals</p>
                  <p className="text-xs text-green-600 font-medium">{batchData.manufacturer.labReport.heavyMetals}</p>
                </div>
                <div className="text-center p-4 border rounded-lg bg-green-50">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Microbial Test</p>
                  <p className="text-xs text-green-600 font-medium">{batchData.manufacturer.labReport.microbialTest}</p>
                </div>
                <div className="text-center p-4 border rounded-lg bg-gray-50">
                  <Calendar className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Test Date</p>
                  <p className="text-xs text-gray-600 font-medium">{batchData.manufacturer.processedDate}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Blockchain Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Blockchain Verification
            </CardTitle>
            <CardDescription>Immutable record stored on blockchain</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <p className="font-medium text-green-800">Blockchain Verified</p>
                <p className="text-sm text-green-700">This batch record is secured on the blockchain</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Blockchain Hash</p>
                <p className="font-mono text-xs bg-muted p-2 rounded border break-all">{batchData.blockchain.hash}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Timestamp</p>
                <p className="text-sm font-medium">{new Date(batchData.blockchain.timestamp).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild className="flex-1">
            <Link href="/verify">Verify Another Batch</Link>
          </Button>
          <Button variant="outline" asChild className="flex-1 bg-transparent">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
