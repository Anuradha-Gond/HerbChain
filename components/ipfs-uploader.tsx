// IPFS file uploader component
"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Upload, FileText, ImageIcon, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface IPFSUploaderProps {
  onUploadComplete?: (result: {
    fileHash: string
    metadataHash: string
    fileUrl: string
    metadataUrl: string
  }) => void
  acceptedFileTypes?: string
  maxFileSize?: number // in MB
  fileType?: "image" | "document" | "lab-report"
}

export function IPFSUploader({
  onUploadComplete,
  acceptedFileTypes = "image/*,.pdf,.doc,.docx",
  maxFileSize = 10,
  fileType = "document",
}: IPFSUploaderProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<any>(null)
  const [description, setDescription] = useState("")
  const [selectedFileType, setSelectedFileType] = useState(fileType)
  const { toast } = useToast()

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (!selectedFile) return

    // Check file size
    if (selectedFile.size > maxFileSize * 1024 * 1024) {
      toast({
        title: "File too large",
        description: `File size must be less than ${maxFileSize}MB`,
        variant: "destructive",
      })
      return
    }

    setFile(selectedFile)
    setUploadResult(null)
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    try {
      const token = localStorage.getItem("herbchain_token")
      const formData = new FormData()
      formData.append("file", file)
      formData.append("fileType", selectedFileType)
      formData.append(
        "metadata",
        JSON.stringify({
          description,
          originalName: file.name,
          category: selectedFileType,
        }),
      )

      const response = await fetch("/api/ipfs/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        setUploadResult(result)
        onUploadComplete?.(result)
        toast({
          title: "Upload successful",
          description: "File has been uploaded to IPFS and pinned for availability",
        })
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error("Upload error:", error)
      toast({
        title: "Upload failed",
        description: "Failed to upload file to IPFS",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const getFileIcon = () => {
    if (!file) return <Upload className="w-8 h-8 text-muted-foreground" />

    if (file.type.startsWith("image/")) {
      return <ImageIcon className="w-8 h-8 text-blue-500" />
    } else {
      return <FileText className="w-8 h-8 text-green-500" />
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Upload to IPFS
        </CardTitle>
        <CardDescription>Upload files to the InterPlanetary File System for decentralized storage</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fileType">File Type</Label>
          <Select value={selectedFileType} onValueChange={setSelectedFileType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="image">Image</SelectItem>
              <SelectItem value="document">Document</SelectItem>
              <SelectItem value="lab-report">Lab Report</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="file">Select File</Label>
          <Input id="file" type="file" accept={acceptedFileTypes} onChange={handleFileSelect} disabled={uploading} />
        </div>

        {file && (
          <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/50">
            {getFileIcon()}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            placeholder="Add a description for this file..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={uploading}
          />
        </div>

        <Button onClick={handleUpload} disabled={!file || uploading} className="w-full">
          {uploading ? "Uploading..." : "Upload to IPFS"}
        </Button>

        {uploadResult && (
          <div className="space-y-3 p-4 border rounded-lg bg-green-50 dark:bg-green-950/20">
            <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Upload Successful</span>
            </div>

            <div className="space-y-2 text-sm">
              <div>
                <Label className="text-xs text-muted-foreground">File Hash:</Label>
                <p className="font-mono text-xs break-all bg-background p-2 rounded border">{uploadResult.fileHash}</p>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">IPFS URL:</Label>
                <a
                  href={uploadResult.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-xs break-all block"
                >
                  {uploadResult.fileUrl}
                </a>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
