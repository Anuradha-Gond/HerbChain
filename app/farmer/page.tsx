"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Leaf, Loader2 } from "@/lib/icon-fallbacks"
import { IPFSUploader } from "@/components/ipfs-uploader"

const Plus = ({ className = "", ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
)

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

const Weight = ({ className = "", ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
    />
  </svg>
)

const Mic = ({ className = "", ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
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

const Clock = ({ className = "", ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
    <polyline points="12,6 12,12 16,14" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
  </svg>
)

const AlertCircle = ({ className = "", ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
    <line x1="12" y1="8" x2="12" y2="12" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
    <line x1="12" y1="16" x2="12.01" y2="16" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
  </svg>
)

import { farmerAPI, type Batch } from "@/lib/api"
import { useAuth } from "@/components/auth-provider"
import { toast } from "@/hooks/use-toast"
import { RouteGuard } from "@/components/route-guard"
import { DashboardHeader } from "@/components/dashboard-header"

const herbTypes = [
  "Ashwagandha",
  "Turmeric",
  "Neem",
  "Brahmi",
  "Amla",
  "Giloy",
  "Tulsi",
  "Ginger",
  "Fenugreek",
  "Cinnamon",
]

export default function FarmerDashboard() {
  const [batches, setBatches] = useState<Batch[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const { user } = useAuth()

  const [newBatch, setNewBatch] = useState({
    herbType: "",
    quantity: "",
    cultivationMethod: "",
    harvestDate: "",
    location: "",
    notes: "",
    gps: { lat: 0, lng: 0 },
  })
  const [isRecording, setIsRecording] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("")
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null)
  const [generatingQR, setGeneratingQR] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [showImageUploader, setShowImageUploader] = useState(false)

  useEffect(() => {
    loadBatches()
  }, [])

  const loadBatches = async () => {
    try {
      setLoading(true)
      const response = await farmerAPI.getMyBatches()
      if (response.success && response.data) {
        setBatches(response.data)
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to load batches",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load batches",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setNewBatch({
            ...newBatch,
            gps: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          })
          toast({
            title: "Location captured",
            description: "GPS coordinates added to batch",
          })
        },
        (error) => {
          toast({
            title: "Location error",
            description: "Could not get current location",
            variant: "destructive",
          })
        },
      )
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "certified":
      case "exported":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "created":
      case "received":
        return <Clock className="w-4 h-4 text-yellow-600" />
      case "tested":
      case "processed":
      case "packaged":
        return <AlertCircle className="w-4 h-4 text-blue-600" />
      case "rejected":
        return <AlertCircle className="w-4 h-4 text-red-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "certified":
      case "exported":
        return "bg-green-100 text-green-800 border-green-200"
      case "created":
      case "received":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "tested":
      case "processed":
      case "packaged":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handleSubmitBatch = async () => {
    if (!newBatch.herbType || !newBatch.quantity) {
      toast({
        title: "Validation Error",
        description: "Please fill in herb type and quantity",
        variant: "destructive",
      })
      return
    }

    const quantity = Number.parseFloat(newBatch.quantity)
    if (isNaN(quantity) || quantity <= 0) {
      toast({
        title: "Invalid Quantity",
        description: "Please enter a valid quantity greater than 0",
        variant: "destructive",
      })
      return
    }

    try {
      setSubmitting(true)
      const batchData = {
        herbType: newBatch.herbType,
        quantityKg: quantity,
        gps: newBatch.gps.lat !== 0 ? newBatch.gps : undefined,
        photoUrl: uploadedImages.length > 0 ? `https://ipfs.io/ipfs/${uploadedImages[0]}` : undefined,
      }

      console.log("[v0] Submitting batch data:", batchData)

      const response = await farmerAPI.addBatch(batchData)

      if (response.success && response.data) {
        toast({
          title: "Success",
          description: `Batch ${response.data.batchId} registered successfully`,
        })

        setNewBatch({
          herbType: "",
          quantity: "",
          cultivationMethod: "",
          harvestDate: "",
          location: "",
          notes: "",
          gps: { lat: 0, lng: 0 },
        })

        setUploadedImages([])
        setShowImageUploader(false)

        await loadBatches()
        document.querySelector('[value="batches"]')?.click()
      } else {
        console.error("[v0] Batch submission failed:", response.message)
        toast({
          title: "Error",
          description: response.message || "Failed to register batch",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("[v0] Batch submission error:", error)
      toast({
        title: "Error",
        description: "Failed to register batch. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const verifiedCount = batches.filter((batch) => batch.status === "certified" || batch.status === "exported").length

  const generateQRCode = async (batch: Batch) => {
    try {
      setGeneratingQR(true)
      setSelectedBatch(batch)

      console.log("[v0] Generating QR code for batch:", batch.batchId)

      const qrData = {
        id: batch.batchId,
        herb_name: batch.herbType,
        farmer_name: user?.name || "Unknown Farmer",
        farmer_id: user?.id || "unknown",
        harvest_date: batch.collectedAt,
        quantity_kg: batch.quantityKg,
        status: batch.status,
        expiry_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        certifications: ["Organic", "AYUSH Certified"],
        location: batch.gps ? `${batch.gps.lat},${batch.gps.lng}` : undefined,
      }

      const response = await fetch("/api/qr/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(qrData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to generate QR code")
      }

      const data = await response.json()
      console.log("[v0] QR code generated successfully:", data.qrCodeUrl)
      setQrCodeUrl(data.qrCodeUrl)

      toast({
        title: "QR Code Generated",
        description: "QR code is ready for download and sharing",
      })
    } catch (error) {
      console.error("[v0] QR generation error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate QR code",
        variant: "destructive",
      })
    } finally {
      setGeneratingQR(false)
    }
  }

  const downloadQRCode = () => {
    if (qrCodeUrl && selectedBatch) {
      const link = document.createElement("a")
      link.href = qrCodeUrl
      link.download = `QR_${selectedBatch.batchId}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Downloaded",
        description: "QR code saved to your device",
      })
    }
  }

  const handleImageUploadComplete = (result: any) => {
    setUploadedImages((prev) => [...prev, result.fileHash])
    toast({
      title: "Image uploaded",
      description: "Image has been uploaded to IPFS successfully",
    })
  }

  const removeUploadedImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <RouteGuard allowedRoles={["farmer"]}>
      <div className="min-h-screen bg-background">
        <DashboardHeader
          title="Farmer Dashboard"
          description="Manage your herb batches and track their journey"
          icon={<Leaf className="w-6 h-6 text-emerald-600" />}
        />

        <div className="container mx-auto px-6 py-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Leaf className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{batches.length}</p>
                    <p className="text-sm text-muted-foreground">Total Batches</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{verifiedCount}</p>
                    <p className="text-sm text-muted-foreground">Verified</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{batches.length - verifiedCount}</p>
                    <p className="text-sm text-muted-foreground">In Progress</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="batches" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="batches">My Batches</TabsTrigger>
              <TabsTrigger value="add-batch">Add New Batch</TabsTrigger>
            </TabsList>

            {/* Batch History Tab */}
            <TabsContent value="batches" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Recent Batches</h2>
                <Button size="sm" variant="outline" onClick={loadBatches} disabled={loading}>
                  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Refresh
                </Button>
              </div>

              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : batches.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="p-12 text-center">
                    <Leaf className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No batches registered yet</h3>
                    <p className="text-muted-foreground mb-4">Add your first batch to get started with HerbChain</p>
                    <Button onClick={() => document.querySelector('[value="add-batch"]')?.click()}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Batch
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {batches.map((batch) => (
                    <Card key={batch._id} className="border-l-4 border-l-primary hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-lg text-foreground">{batch.herbType}</h3>
                            <p className="text-sm text-muted-foreground">Batch ID: {batch.batchId}</p>
                          </div>
                          <Badge className={getStatusColor(batch.status)} variant="outline">
                            <div className="flex items-center gap-1">
                              {getStatusIcon(batch.status)}
                              {batch.status}
                            </div>
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Weight className="w-4 h-4" />
                            <span>{batch.quantityKg} kg</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(batch.collectedAt).toLocaleDateString()}</span>
                          </div>
                          {batch.gps && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="w-4 h-4" />
                              <span className="text-xs">
                                {batch.gps?.lat !== undefined && batch.gps?.lng !== undefined
    ? `${batch.gps.lat.toFixed(4)}, ${batch.gps.lng.toFixed(4)}`
    : "No GPS available"}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1 bg-transparent"
                                onClick={() => generateQRCode(batch)}
                                disabled={generatingQR}
                              >
                                {generatingQR && selectedBatch?.batchId === batch.batchId ? (
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                  <QrCode className="w-4 h-4 mr-2" />
                                )}
                                QR Code
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle>Batch QR Code</DialogTitle>
                                <DialogDescription>
                                  Share this QR code with manufacturers and distributors to track your batch
                                </DialogDescription>
                              </DialogHeader>
                              <div className="flex justify-center p-6">
                                {qrCodeUrl && selectedBatch?.batchId === batch.batchId ? (
                                  <div className="text-center">
                                    <img
                                      src={qrCodeUrl || "/placeholder.svg"}
                                      alt={`QR Code for ${batch.batchId}`}
                                      className="w-48 h-48 border rounded-lg mx-auto mb-4"
                                    />
                                    <div className="text-xs text-muted-foreground space-y-1">
                                      <p>
                                        <strong>Herb:</strong> {batch.herbType}
                                      </p>
                                      <p>
                                        <strong>Quantity:</strong> {batch.quantityKg} kg
                                      </p>
                                      <p>
                                        <strong>Status:</strong> {batch.status}
                                      </p>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="w-48 h-48 bg-muted rounded-lg flex items-center justify-center">
                                    {generatingQR && selectedBatch?.batchId === batch.batchId ? (
                                      <div className="text-center">
                                        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mb-2" />
                                        <p className="text-sm text-muted-foreground">Generating QR...</p>
                                      </div>
                                    ) : (
                                      <QrCode className="w-24 h-24 text-muted-foreground" />
                                    )}
                                  </div>
                                )}
                              </div>
                              <div className="text-center space-y-2">
                                <p className="text-sm text-muted-foreground mb-2">Batch ID: {batch.batchId}</p>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    onClick={downloadQRCode}
                                    disabled={!qrCodeUrl || selectedBatch?.batchId !== batch.batchId}
                                    className="flex-1"
                                  >
                                    Download QR Code
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => generateQRCode(batch)}
                                    disabled={generatingQR}
                                    className="bg-transparent"
                                  >
                                    {generatingQR && selectedBatch?.batchId === batch.batchId
                                      ? "Generating..."
                                      : "Regenerate"}
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                                View Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-lg">
                              <DialogHeader>
                                <DialogTitle>Batch Details</DialogTitle>
                                <DialogDescription>Complete information for batch {batch.batchId}</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-xs text-muted-foreground">Herb Type</Label>
                                    <p className="font-medium">{batch.herbType}</p>
                                  </div>
                                  <div>
                                    <Label className="text-xs text-muted-foreground">Quantity</Label>
                                    <p className="font-medium">{batch.quantityKg} kg</p>
                                  </div>
                                  <div>
                                    <Label className="text-xs text-muted-foreground">Status</Label>
                                    <Badge className={getStatusColor(batch.status)} variant="outline">
                                      {batch.status}
                                    </Badge>
                                  </div>
                                  <div>
                                    <Label className="text-xs text-muted-foreground">Collected</Label>
                                    <p className="font-medium">{new Date(batch.collectedAt).toLocaleDateString()}</p>
                                  </div>
                                </div>
                                {batch.gps && (
                                  <div>
                                    <Label className="text-xs text-muted-foreground">GPS Location</Label>
                                    <p className="font-medium">
                                      <p className="font-medium">
  {batch.gps?.lat !== undefined && batch.gps?.lng !== undefined
    ? `${batch.gps.lat.toFixed(6)}, ${batch.gps.lng.toFixed(6)}`
    : "No GPS"}
</p>

                                    </p>
                                  </div>
                                )}
                                {batch.photoUrl && (
                                  <div>
                                    <Label className="text-xs text-muted-foreground">Photo</Label>
                                    <img
                                      src={batch.photoUrl || "/placeholder.svg"}
                                      alt={`${batch.herbType} batch`}
                                      className="w-full h-32 object-cover rounded-lg border mt-2"
                                      onError={(e) => {
                                        e.currentTarget.src = "/herb-batch-photo.jpg"
                                      }}
                                    />
                                  </div>
                                )}
                                {batch.blockchainTx && (
                                  <div>
                                    <Label className="text-xs text-muted-foreground">Blockchain Transaction</Label>
                                    <p className="font-mono text-xs break-all">{batch.blockchainTx}</p>
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Add New Batch Tab */}
            <TabsContent value="add-batch" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Register New Batch
                  </CardTitle>
                  <CardDescription>
                    Add a new herb batch with cultivation details and location information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="herb-type">Herb Type *</Label>
                      <Select
                        value={newBatch.herbType}
                        onValueChange={(value) => setNewBatch({ ...newBatch, herbType: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select herb type" />
                        </SelectTrigger>
                        <SelectContent>
                          {herbTypes.map((herb) => (
                            <SelectItem key={herb} value={herb}>
                              {herb}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity (kg) *</Label>
                      <Input
                        id="quantity"
                        type="number"
                        placeholder="Enter quantity in kg"
                        value={newBatch.quantity}
                        onChange={(e) => setNewBatch({ ...newBatch, quantity: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="harvest-date">Harvest Date</Label>
                      <Input
                        id="harvest-date"
                        type="date"
                        value={newBatch.harvestDate}
                        onChange={(e) => setNewBatch({ ...newBatch, harvestDate: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cultivation">Cultivation Method</Label>
                      <Select
                        value={newBatch.cultivationMethod}
                        onValueChange={(value) => setNewBatch({ ...newBatch, cultivationMethod: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select cultivation method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="organic">Organic</SelectItem>
                          <SelectItem value="traditional">Traditional</SelectItem>
                          <SelectItem value="sustainable">Sustainable</SelectItem>
                          <SelectItem value="biodynamic">Biodynamic</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Farm Location</Label>
                    <div className="flex gap-2">
                      <Input
                        id="location"
                        placeholder="Enter farm location"
                        value={newBatch.location}
                        onChange={(e) => setNewBatch({ ...newBatch, location: e.target.value })}
                        className="flex-1"
                      />
                      <Button size="icon" variant="outline" onClick={getCurrentLocation}>
                        <MapPin className="w-4 h-4" />
                      </Button>
                    </div>
                    {newBatch.gps.lat !== 0 && (
                      <p className="text-xs text-muted-foreground">
                        GPS: {newBatch.gps.lat.toFixed(4)}, {newBatch.gps.lng.toFixed(4)}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <div className="relative">
                      <Textarea
                        id="notes"
                        placeholder="Add any additional information about the batch..."
                        value={newBatch.notes}
                        onChange={(e) => setNewBatch({ ...newBatch, notes: e.target.value })}
                        className="pr-12"
                        rows={3}
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        className={`absolute right-2 top-2 ${isRecording ? "text-red-500" : "text-muted-foreground"}`}
                        onClick={() => setIsRecording(!isRecording)}
                      >
                        <Mic className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">Tap the microphone to use voice input</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Upload Photos</Label>
                      <Button variant="outline" size="sm" onClick={() => setShowImageUploader(!showImageUploader)}>
                        <Camera className="w-4 h-4 mr-2" />
                        {showImageUploader ? "Hide Uploader" : "Add Photos"}
                      </Button>
                    </div>

                    {showImageUploader && (
                      <div className="border rounded-lg p-4">
                        <IPFSUploader
                          onUploadComplete={handleImageUploadComplete}
                          acceptedFileTypes="image/*"
                          maxFileSize={5}
                          fileType="image"
                        />
                      </div>
                    )}

                    {uploadedImages.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Uploaded Images ({uploadedImages.length})</Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {uploadedImages.map((hash, index) => (
                            <div key={hash} className="relative group">
                              <img
                                src={`https://ipfs.io/ipfs/${hash}`}
                                alt={`Uploaded image ${index + 1}`}
                                className="w-full h-20 object-cover rounded-lg border"
                                onError={(e) => {
                                  e.currentTarget.src = "/herb-photo.jpg"
                                }}
                              />
                              <Button
                                size="sm"
                                variant="destructive"
                                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeUploadedImage(index)}
                              >
                                ×
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <Button className="w-full" size="lg" onClick={handleSubmitBatch} disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Registering Batch...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Register Batch
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </RouteGuard>
  )
}
