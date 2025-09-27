"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, Shield, AlertTriangle, CheckCircle, XCircle } from "lucide-react"

interface VerificationResult {
  authenticity_check: any
  image_analysis: any
  pattern_analysis: any
  blockchain_verified: boolean
  overall_status: "authentic" | "suspicious" | "fraudulent"
  confidence_score: number
  recommendations: string[]
}

export default function AIVerificationPanel({ batchId }: { batchId: string }) {
  const [isVerifying, setIsVerifying] = useState(false)
  const [result, setResult] = useState<VerificationResult | null>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedImage(file)
    }
  }

  const runVerification = async () => {
    if (!selectedImage) {
      alert("Please select an image first")
      return
    }

    setIsVerifying(true)
    try {
      const formData = new FormData()
      formData.append("image", selectedImage)
      formData.append("batchData", JSON.stringify({ id: batchId }))
      formData.append("gpsCoordinates", JSON.stringify({ lat: 28.6139, lng: 77.209 }))

      const response = await fetch("/api/ai/verify", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setResult(data)
      } else {
        throw new Error("Verification failed")
      }
    } catch (error) {
      console.error("Verification error:", error)
      alert("Verification failed. Please try again.")
    } finally {
      setIsVerifying(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "authentic":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "suspicious":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "fraudulent":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Shield className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "authentic":
        return "bg-green-100 text-green-800"
      case "suspicious":
        return "bg-yellow-100 text-yellow-800"
      case "fraudulent":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            AI Authenticity Verification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Upload Herb Image for Analysis</label>
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
              />
              <Button
                onClick={runVerification}
                disabled={!selectedImage || isVerifying}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                {isVerifying ? "Verifying..." : "Verify"}
              </Button>
            </div>
          </div>

          {selectedImage && (
            <div className="mt-4">
              <img
                src={URL.createObjectURL(selectedImage) || "/placeholder.svg"}
                alt="Selected herb"
                className="max-w-xs rounded-lg border"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Verification Results</span>
                <Badge className={getStatusColor(result.overall_status)}>
                  {getStatusIcon(result.overall_status)}
                  <span className="ml-1 capitalize">{result.overall_status}</span>
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Confidence Score</span>
                  <span>{Math.round(result.confidence_score * 100)}%</span>
                </div>
                <Progress value={result.confidence_score * 100} className="h-2" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Image Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Quality Score</span>
                      <span>{Math.round(result.image_analysis.quality_score * 100)}%</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Species Confidence</span>
                      <span>{Math.round(result.image_analysis.herb_species_confidence * 100)}%</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Freshness</span>
                      <span>{Math.round(result.image_analysis.freshness_indicator * 100)}%</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Contamination</span>
                      <Badge variant={result.image_analysis.contamination_detected ? "destructive" : "secondary"}>
                        {result.image_analysis.contamination_detected ? "Detected" : "None"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Pattern Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Risk Score</span>
                      <span>{Math.round(result.pattern_analysis.risk_score * 100)}%</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Blockchain Verified</span>
                      <Badge variant={result.blockchain_verified ? "secondary" : "destructive"}>
                        {result.blockchain_verified ? "Yes" : "No"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {result.authenticity_check.fraud_indicators.length > 0 && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Fraud Indicators:</strong>
                    <ul className="list-disc list-inside mt-1">
                      {result.authenticity_check.fraud_indicators.map((indicator: string, index: number) => (
                        <li key={index} className="text-sm">
                          {indicator}
                        </li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              {result.recommendations.length > 0 && (
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Recommendations:</strong>
                    <ul className="list-disc list-inside mt-1">
                      {result.recommendations.map((rec: string, index: number) => (
                        <li key={index} className="text-sm">
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
