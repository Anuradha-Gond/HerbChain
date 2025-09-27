"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Shield,
  Search,
  Filter,
  Download,
  Eye,
  AlertTriangle,
  CheckCircle,
  XCircle,
  MapPin,
  BarChart3,
  TrendingUp,
  Leaf,
  Calendar,
  FileText,
  Clock,
} from "lucide-react"
import { RouteGuard } from "@/components/route-guard"
import { DashboardHeader } from "@/components/dashboard-header"

// Mock data for regulatory oversight
const mockBatches = [
  {
    id: "HB001",
    herbType: "Ashwagandha",
    farmer: "Rajesh Kumar",
    manufacturer: "Ayurvedic Herbs Processing Ltd.",
    location: "Rajasthan",
    status: "approved",
    certificationDate: "2024-01-20",
    complianceScore: 95,
    riskLevel: "low",
  },
  {
    id: "HB002",
    herbType: "Turmeric",
    farmer: "Priya Sharma",
    manufacturer: "Natural Extracts Co.",
    location: "Karnataka",
    status: "pending",
    certificationDate: null,
    complianceScore: 88,
    riskLevel: "medium",
  },
  {
    id: "HB003",
    herbType: "Neem",
    farmer: "Amit Patel",
    manufacturer: "Herbal Solutions Pvt Ltd.",
    location: "Gujarat",
    status: "flagged",
    certificationDate: null,
    complianceScore: 65,
    riskLevel: "high",
  },
]

const mockAlerts = [
  {
    id: "AL001",
    type: "fraud",
    severity: "high",
    message: "Duplicate batch entry detected for HB005",
    timestamp: "2024-01-21 14:30",
    status: "investigating",
  },
  {
    id: "AL002",
    type: "compliance",
    severity: "medium",
    message: "Lab report missing for batch HB007",
    timestamp: "2024-01-21 12:15",
    status: "pending",
  },
  {
    id: "AL003",
    type: "quality",
    severity: "low",
    message: "Moisture content slightly above threshold for HB009",
    timestamp: "2024-01-21 09:45",
    status: "resolved",
  },
]

const mockAnalytics = {
  totalBatches: 1247,
  approvedBatches: 1089,
  pendingReview: 98,
  flaggedBatches: 60,
  averageComplianceScore: 87.5,
  topRegions: [
    { name: "Rajasthan", batches: 342, compliance: 92 },
    { name: "Karnataka", batches: 298, compliance: 89 },
    { name: "Gujarat", batches: 267, compliance: 85 },
    { name: "Maharashtra", batches: 201, compliance: 88 },
  ],
  monthlyTrends: [
    { month: "Jan", batches: 156, compliance: 87 },
    { month: "Feb", batches: 189, compliance: 89 },
    { month: "Mar", batches: 203, compliance: 91 },
    { month: "Apr", batches: 178, compliance: 88 },
  ],
}

export default function RegulatorDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBatch, setSelectedBatch] = useState<any>(null)
  const [filterStatus, setFilterStatus] = useState("all")
  const [certificationAction, setCertificationAction] = useState("")
  const [certificationNotes, setCertificationNotes] = useState("")

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />
      case "flagged":
        return <XCircle className="w-4 h-4 text-red-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "flagged":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handleCertificationAction = () => {
    console.log("Certification action:", certificationAction, certificationNotes)
    setCertificationAction("")
    setCertificationNotes("")
    setSelectedBatch(null)
  }

  return (
    <RouteGuard allowedRoles={["regulator"]}>
      <div className="min-h-screen bg-background">
        <DashboardHeader
          title="Regulator Dashboard"
          description="Oversee compliance and quality standards"
          icon={<Shield className="w-6 h-6 text-purple-600" />}
        />

        <div className="container mx-auto px-6 py-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                    <Leaf className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{mockAnalytics.totalBatches}</p>
                    <p className="text-sm text-muted-foreground">Total Batches</p>
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
                    <p className="text-2xl font-bold">{mockAnalytics.approvedBatches}</p>
                    <p className="text-sm text-muted-foreground">Approved</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{mockAnalytics.pendingReview}</p>
                    <p className="text-sm text-muted-foreground">Pending Review</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{mockAnalytics.flaggedBatches}</p>
                    <p className="text-sm text-muted-foreground">Flagged</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{mockAnalytics.averageComplianceScore}%</p>
                    <p className="text-sm text-muted-foreground">Avg Compliance</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="oversight" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="oversight">Batch Oversight</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="alerts">Fraud Alerts</TabsTrigger>
              <TabsTrigger value="compliance">Compliance</TabsTrigger>
            </TabsList>

            {/* Batch Oversight Tab */}
            <TabsContent value="oversight" className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <h2 className="text-2xl font-bold">Batch Oversight</h2>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by batch ID, farmer, herb..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="flagged">Flagged</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon">
                    <Filter className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Batch ID</TableHead>
                        <TableHead>Herb Type</TableHead>
                        <TableHead>Farmer</TableHead>
                        <TableHead>Manufacturer</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Compliance</TableHead>
                        <TableHead>Risk</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockBatches.map((batch) => (
                        <TableRow key={batch.id}>
                          <TableCell className="font-medium">{batch.id}</TableCell>
                          <TableCell>{batch.herbType}</TableCell>
                          <TableCell>{batch.farmer}</TableCell>
                          <TableCell className="text-sm">{batch.manufacturer}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-muted-foreground" />
                              <span className="text-sm">{batch.location}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(batch.status)} variant="outline">
                              <div className="flex items-center gap-1">
                                {getStatusIcon(batch.status)}
                                {batch.status}
                              </div>
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-12 bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${
                                    batch.complianceScore >= 90
                                      ? "bg-green-500"
                                      : batch.complianceScore >= 75
                                        ? "bg-yellow-500"
                                        : "bg-red-500"
                                  }`}
                                  style={{ width: `${batch.complianceScore}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium">{batch.complianceScore}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getRiskColor(batch.riskLevel)} variant="outline">
                              {batch.riskLevel}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="sm" variant="outline" onClick={() => setSelectedBatch(batch)}>
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle>Batch Certification Review</DialogTitle>
                                    <DialogDescription>
                                      Review and approve or reject batch certification
                                    </DialogDescription>
                                  </DialogHeader>
                                  {selectedBatch && (
                                    <div className="space-y-6">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                          <Label>Batch Information</Label>
                                          <div className="space-y-1 text-sm">
                                            <p>
                                              <strong>ID:</strong> {selectedBatch.id}
                                            </p>
                                            <p>
                                              <strong>Herb:</strong> {selectedBatch.herbType}
                                            </p>
                                            <p>
                                              <strong>Farmer:</strong> {selectedBatch.farmer}
                                            </p>
                                            <p>
                                              <strong>Location:</strong> {selectedBatch.location}
                                            </p>
                                          </div>
                                        </div>
                                        <div className="space-y-2">
                                          <Label>Compliance Metrics</Label>
                                          <div className="space-y-1 text-sm">
                                            <p>
                                              <strong>Score:</strong> {selectedBatch.complianceScore}%
                                            </p>
                                            <p>
                                              <strong>Risk Level:</strong> {selectedBatch.riskLevel}
                                            </p>
                                            <p>
                                              <strong>Status:</strong> {selectedBatch.status}
                                            </p>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="space-y-2">
                                        <Label htmlFor="certification-action">Certification Decision</Label>
                                        <Select value={certificationAction} onValueChange={setCertificationAction}>
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select action" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="approve">Approve Certification</SelectItem>
                                            <SelectItem value="reject">Reject Certification</SelectItem>
                                            <SelectItem value="request-info">Request Additional Information</SelectItem>
                                            <SelectItem value="flag">Flag for Investigation</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>

                                      <div className="space-y-2">
                                        <Label htmlFor="certification-notes">Notes</Label>
                                        <textarea
                                          id="certification-notes"
                                          className="w-full p-3 border rounded-lg resize-none"
                                          rows={3}
                                          placeholder="Add notes for this certification decision..."
                                          value={certificationNotes}
                                          onChange={(e) => setCertificationNotes(e.target.value)}
                                        />
                                      </div>

                                      <div className="flex gap-2">
                                        <Button className="flex-1" onClick={handleCertificationAction}>
                                          Submit Decision
                                        </Button>
                                        <Button variant="outline" className="flex-1 bg-transparent">
                                          View Full Chain
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>
                              <Button size="sm" variant="outline">
                                <Download className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Regional Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockAnalytics.topRegions.map((region) => (
                        <div key={region.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">{region.name}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-muted-foreground">{region.batches} batches</span>
                            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                              {region.compliance}%
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Monthly Trends
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockAnalytics.monthlyTrends.map((month) => (
                        <div key={month.month} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">{month.month} 2024</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-muted-foreground">{month.batches} batches</span>
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div className="h-2 rounded-full bg-primary" style={{ width: `${month.compliance}%` }} />
                            </div>
                            <span className="text-sm font-medium">{month.compliance}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Supply Chain Map</CardTitle>
                  <CardDescription>Geographic distribution of herb collection and processing</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">Interactive map showing collection locations</p>
                      <p className="text-sm text-muted-foreground">Integration with mapping service required</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Fraud Alerts Tab */}
            <TabsContent value="alerts" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Fraud & Compliance Alerts</h2>
                <Button variant="outline" size="sm">
                  Mark All Read
                </Button>
              </div>

              <div className="space-y-4">
                {mockAlerts.map((alert) => (
                  <Card key={alert.id} className="border-l-4 border-l-red-500">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge className={getSeverityColor(alert.severity)} variant="outline">
                                {alert.severity}
                              </Badge>
                              <span className="text-sm text-muted-foreground capitalize">{alert.type}</span>
                            </div>
                            <p className="font-medium mb-1">{alert.message}</p>
                            <p className="text-sm text-muted-foreground">{alert.timestamp}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            Investigate
                          </Button>
                          <Button size="sm">Resolve</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Compliance Tab */}
            <TabsContent value="compliance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Compliance Standards
                  </CardTitle>
                  <CardDescription>Monitor adherence to AYUSH and international quality standards</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <h3 className="font-medium">AYUSH Standards</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <span className="text-sm">Cultivation Guidelines</span>
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                            98% Compliant
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <span className="text-sm">Processing Standards</span>
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                            95% Compliant
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <span className="text-sm">Quality Parameters</span>
                          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                            87% Compliant
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="font-medium">Export Standards</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <span className="text-sm">FDA Requirements</span>
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                            92% Compliant
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <span className="text-sm">EU Regulations</span>
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                            89% Compliant
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <span className="text-sm">Organic Certification</span>
                          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                            78% Compliant
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="font-medium">Documentation</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <span className="text-sm">Lab Reports</span>
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                            96% Complete
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <span className="text-sm">Certificates</span>
                          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                            84% Complete
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <span className="text-sm">Traceability Records</span>
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                            99% Complete
                          </Badge>
                        </div>
                      </div>
                    </div>
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
