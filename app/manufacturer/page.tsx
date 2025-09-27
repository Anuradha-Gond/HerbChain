"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Leaf,
  QrCode,
  FileText,
  Upload,
  CheckCircle,
  Clock,
  AlertCircle,
  Search,
  Filter,
  Download,
  Eye,
  Building2,
  Loader2,
} from "lucide-react"
import { manufacturerAPI, farmerAPI, type Batch } from "@/lib/api"
import { useAuth } from "@/components/auth-provider"
import { toast } from "@/hooks/use-toast"
import { RouteGuard } from "@/components/route-guard"
import { DashboardHeader } from "@/components/dashboard-header"

const processingStages = [
  "quality-check",
  "cleaning",
  "drying",
  "grinding",
  "extraction",
  "formulation",
  "packaging",
  "completed",
]

export default function ManufacturerDashboard() {
  const [batches, setBatches] = useState<Batch[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null)
  const [qrInput, setQrInput] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const { user } = useAuth()

  const [labReport, setLabReport] = useState({
    batchId: "",
    testDate: "",
    purityLevel: "",
    moistureContent: "",
    pesticideTest: "",
    heavyMetals: "",
    microbialTest: "",
    notes: "",
    file: null as File | null,
  })

  useEffect(() => {
    loadBatches()
  }, [])

  const loadBatches = async () => {
    try {
      setLoading(true)
      // For manufacturer, we might need a different endpoint to get all batches they can process
      // For now, using farmer API as example - you might need to create a manufacturer-specific endpoint
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "processed":
      case "packaged":
      case "certified":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "tested":
        return <AlertCircle className="w-4 h-4 text-blue-600" />
      case "received":
      case "created":
        return <Clock className="w-4 h-4 text-yellow-600" />
      case "rejected":
        return <AlertCircle className="w-4 h-4 text-red-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "processed":
      case "packaged":
      case "certified":
        return "bg-green-100 text-green-800 border-green-200"
      case "tested":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "received":
      case "created":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handleQrScan = async () => {
    if (!qrInput.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a batch ID",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await farmerAPI.getBatch(qrInput)
      if (response.success && response.data) {
        setSelectedBatch(response.data)
        toast({
          title: "Batch Found",
          description: "Batch verified successfully",
        })
      } else {
        toast({
          title: "Batch Not Found",
          description: response.message || "Invalid batch ID",
          variant: "destructive",
        })
        setSelectedBatch(null)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify batch",
        variant: "destructive",
      })
      setSelectedBatch(null)
    }
  }

  const handleReceiveBatch = async (batchId: string) => {
    try {
      setSubmitting(true)
      const response = await manufacturerAPI.receiveBatch({
        batchId,
        notes: "Batch received and verified",
      })

      if (response.success) {
        toast({
          title: "Success",
          description: "Batch marked as received",
        })
        loadBatches()
        setSelectedBatch(null)
        setQrInput("")
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to receive batch",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to receive batch",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleLabReportUpload = async () => {
    if (!labReport.batchId || !labReport.file) {
      toast({
        title: "Validation Error",
        description: "Please select a batch and upload a file",
        variant: "destructive",
      })
      return
    }

    try {
      setSubmitting(true)
      const formData = new FormData()
      formData.append("file", labReport.file)
      formData.append("batchId", labReport.batchId)
      formData.append("testDate", labReport.testDate)
      formData.append("purityLevel", labReport.purityLevel)
      formData.append("moistureContent", labReport.moistureContent)
      formData.append("pesticideTest", labReport.pesticideTest)
      formData.append("heavyMetals", labReport.heavyMetals)
      formData.append("microbialTest", labReport.microbialTest)
      formData.append("notes", labReport.notes)

      const response = await manufacturerAPI.uploadLabReport(formData)

      if (response.success) {
        toast({
          title: "Success",
          description: "Lab report uploaded successfully",
        })

        // Reset form
        setLabReport({
          batchId: "",
          testDate: "",
          purityLevel: "",
          moistureContent: "",
          pesticideTest: "",
          heavyMetals: "",
          microbialTest: "",
          notes: "",
          file: null,
        })

        loadBatches()
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to upload lab report",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload lab report",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdateProcessing = async (batchId: string, status: string) => {
    try {
      setSubmitting(true)
      const response = await manufacturerAPI.updateProcessing({
        batchId,
        status,
        notes: `Updated to ${status} stage`,
      })

      if (response.success) {
        toast({
          title: "Success",
          description: "Processing status updated",
        })
        loadBatches()
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to update status",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const filteredBatches = batches.filter(
    (batch) =>
      batch.batchId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.herbType.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const processingCount = batches.filter((batch) => batch.status === "tested" || batch.status === "processed").length

  const completedCount = batches.filter((batch) => batch.status === "packaged" || batch.status === "certified").length

  const pendingReports = batches.filter((batch) => batch.status === "received" && batch.labReports.length === 0).length

  return (
    <RouteGuard allowedRoles={["manufacturer"]}>
      <div className="min-h-screen bg-background">
        <DashboardHeader
          title="Manufacturer Dashboard"
          description="Process herbs and manage quality control"
          icon={<Building2 className="w-6 h-6 text-blue-600" />}
        />

        <div className="container mx-auto px-6 py-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Leaf className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{batches.length}</p>
                    <p className="text-sm text-muted-foreground">Active Batches</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{processingCount}</p>
                    <p className="text-sm text-muted-foreground">Processing</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{completedCount}</p>
                    <p className="text-sm text-muted-foreground">Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{pendingReports}</p>
                    <p className="text-sm text-muted-foreground">Pending Reports</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="batches" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="batches">Batch Management</TabsTrigger>
              <TabsTrigger value="scan">QR Scanner</TabsTrigger>
              <TabsTrigger value="lab-reports">Lab Reports</TabsTrigger>
              <TabsTrigger value="processing">Processing Status</TabsTrigger>
            </TabsList>

            {/* Batch Management Tab */}
            <TabsContent value="batches" className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <h2 className="text-2xl font-bold">Batch Management</h2>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search batches..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button variant="outline" size="icon" onClick={loadBatches} disabled={loading}>
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Filter className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <Card>
                <CardContent className="p-0">
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin" />
                    </div>
                  ) : filteredBatches.length === 0 ? (
                    <div className="p-8 text-center">
                      <Leaf className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No batches found</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Batch ID</TableHead>
                          <TableHead>Herb Type</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Lab Reports</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredBatches.map((batch) => (
                          <TableRow key={batch._id}>
                            <TableCell className="font-medium">{batch.batchId}</TableCell>
                            <TableCell>{batch.herbType}</TableCell>
                            <TableCell>{batch.quantityKg} kg</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(batch.status)} variant="outline">
                                <div className="flex items-center gap-1">
                                  {getStatusIcon(batch.status)}
                                  {batch.status}
                                </div>
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={
                                  batch.labReports.length > 0
                                    ? "bg-green-100 text-green-800 border-green-200"
                                    : "bg-yellow-100 text-yellow-800 border-yellow-200"
                                }
                              >
                                {batch.labReports.length > 0 ? "uploaded" : "pending"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline">
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Download className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* QR Scanner Tab */}
            <TabsContent value="scan" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <QrCode className="w-5 h-5" />
                    QR Code Scanner
                  </CardTitle>
                  <CardDescription>Scan or enter batch QR code to verify blockchain entry</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="qr-input">Enter Batch ID or QR Code</Label>
                        <div className="flex gap-2">
                          <Input
                            id="qr-input"
                            placeholder="Enter batch ID..."
                            value={qrInput}
                            onChange={(e) => setQrInput(e.target.value)}
                            className="flex-1"
                          />
                          <Button onClick={handleQrScan} disabled={submitting}>
                            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify"}
                          </Button>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full bg-transparent">
                        <QrCode className="w-4 h-4 mr-2" />
                        Open Camera Scanner
                      </Button>
                    </div>

                    {selectedBatch && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Batch Verification</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span className="font-medium">Blockchain Verified</span>
                          </div>
                          <div className="space-y-2 text-sm">
                            <p>
                              <strong>Batch ID:</strong> {selectedBatch.batchId}
                            </p>
                            <p>
                              <strong>Herb:</strong> {selectedBatch.herbType}
                            </p>
                            <p>
                              <strong>Quantity:</strong> {selectedBatch.quantityKg} kg
                            </p>
                            <p>
                              <strong>Status:</strong> {selectedBatch.status}
                            </p>
                            {selectedBatch.gps && (
                              <p>
                                <strong>GPS:</strong> {selectedBatch.gps.lat.toFixed(4)},{" "}
                                {selectedBatch.gps.lng.toFixed(4)}
                              </p>
                            )}
                          </div>
                          <Button
                            className="w-full"
                            size="sm"
                            onClick={() => handleReceiveBatch(selectedBatch.batchId)}
                            disabled={submitting || selectedBatch.status !== "created"}
                          >
                            {submitting ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              "Mark as Received"
                            )}
                          </Button>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Lab Reports Tab */}
            <TabsContent value="lab-reports" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Upload Lab Report
                  </CardTitle>
                  <CardDescription>Upload and manage laboratory test reports for herb batches</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="batch-select">Select Batch</Label>
                        <Select
                          value={labReport.batchId}
                          onValueChange={(value) => setLabReport({ ...labReport, batchId: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select batch for lab report" />
                          </SelectTrigger>
                          <SelectContent>
                            {batches.map((batch) => (
                              <SelectItem key={batch._id} value={batch.batchId}>
                                {batch.batchId} - {batch.herbType}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="test-date">Test Date</Label>
                          <Input
                            id="test-date"
                            type="date"
                            value={labReport.testDate}
                            onChange={(e) => setLabReport({ ...labReport, testDate: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="purity">Purity Level (%)</Label>
                          <Input
                            id="purity"
                            type="number"
                            placeholder="95.5"
                            value={labReport.purityLevel}
                            onChange={(e) => setLabReport({ ...labReport, purityLevel: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="moisture">Moisture Content (%)</Label>
                          <Input
                            id="moisture"
                            type="number"
                            placeholder="8.2"
                            value={labReport.moistureContent}
                            onChange={(e) => setLabReport({ ...labReport, moistureContent: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="pesticide">Pesticide Test</Label>
                          <Select
                            value={labReport.pesticideTest}
                            onValueChange={(value) => setLabReport({ ...labReport, pesticideTest: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select result" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="passed">Passed</SelectItem>
                              <SelectItem value="failed">Failed</SelectItem>
                              <SelectItem value="not-detected">Not Detected</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="heavy-metals">Heavy Metals</Label>
                          <Select
                            value={labReport.heavyMetals}
                            onValueChange={(value) => setLabReport({ ...labReport, heavyMetals: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select result" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="within-limits">Within Limits</SelectItem>
                              <SelectItem value="exceeded">Exceeded</SelectItem>
                              <SelectItem value="not-detected">Not Detected</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="microbial">Microbial Test</Label>
                          <Select
                            value={labReport.microbialTest}
                            onValueChange={(value) => setLabReport({ ...labReport, microbialTest: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select result" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="passed">Passed</SelectItem>
                              <SelectItem value="failed">Failed</SelectItem>
                              <SelectItem value="acceptable">Acceptable</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Upload Lab Report PDF</Label>
                        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                          <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-sm text-muted-foreground mb-2">
                            Drag and drop your lab report here, or click to browse
                          </p>
                          <Input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                setLabReport({ ...labReport, file })
                              }
                            }}
                            className="hidden"
                            id="file-upload"
                          />
                          <Button variant="outline" size="sm" asChild>
                            <label htmlFor="file-upload" className="cursor-pointer">
                              Choose File
                            </label>
                          </Button>
                          {labReport.file && (
                            <p className="text-sm text-muted-foreground mt-2">Selected: {labReport.file.name}</p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="lab-notes">Additional Notes</Label>
                        <Textarea
                          id="lab-notes"
                          placeholder="Add any additional observations or notes..."
                          value={labReport.notes}
                          onChange={(e) => setLabReport({ ...labReport, notes: e.target.value })}
                          rows={4}
                        />
                      </div>

                      <Button className="w-full" onClick={handleLabReportUpload} disabled={submitting}>
                        {submitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Lab Report
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Processing Status Tab */}
            <TabsContent value="processing" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Processing Status Management</CardTitle>
                  <CardDescription>Update and track the processing stages of herb batches</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {batches.map((batch) => (
                      <Card key={batch._id} className="border-l-4 border-l-primary">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="font-semibold text-lg">{batch.herbType}</h3>
                              <p className="text-sm text-muted-foreground">
                                Batch {batch.batchId} • {batch.quantityKg} kg
                              </p>
                            </div>
                            <Badge className={getStatusColor(batch.status)} variant="outline">
                              {batch.status}
                            </Badge>
                          </div>

                          <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                              <Label>Update Processing Stage</Label>
                              <Select
                                defaultValue={batch.status}
                                onValueChange={(value) => handleUpdateProcessing(batch.batchId, value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {processingStages.map((stage) => (
                                    <SelectItem key={stage} value={stage}>
                                      {stage.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="flex items-end gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1 bg-transparent"
                                disabled={submitting}
                              >
                                View Details
                              </Button>
                              <Button
                                size="sm"
                                className="flex-1"
                                onClick={() => handleUpdateProcessing(batch.batchId, "processed")}
                                disabled={submitting || batch.status === "processed"}
                              >
                                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Mark Complete"}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </RouteGuard>
  )
}
