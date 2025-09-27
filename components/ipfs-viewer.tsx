// IPFS file viewer component
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { FileText, ImageIcon, Download, ExternalLink, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface IPFSViewerProps {
  hash?: string
  showHashInput?: boolean
  className?: string
}

interface FileMetadata {
  filename: string
  fileType: string
  size: number
  uploadedBy: string
  uploadedAt: string
  description?: string
  category?: string
}

export function IPFSViewer({ hash: initialHash, showHashInput = true, className }: IPFSViewerProps) {
  const [hash, setHash] = useState(initialHash || "")
  const [metadata, setMetadata] = useState<FileMetadata | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fileUrl, setFileUrl] = useState<string | null>(null)
  const { toast } = useToast()

  const loadFile = async (fileHash: string) => {
    if (!fileHash.trim()) return

    setLoading(true)
    setError(null)
    setMetadata(null)
    setFileUrl(null)

    try {
      // Try to load metadata first
      const metadataResponse = await fetch(`/api/ipfs/retrieve?hash=${fileHash}&type=metadata`)
      if (metadataResponse.ok) {
        const metadataData = await metadataResponse.json()
        setMetadata(metadataData)
      }

      // Generate file URL
      const url = `https://ipfs.io/ipfs/${fileHash}`
      setFileUrl(url)
    } catch (err) {
      console.error("Error loading IPFS file:", err)
      setError("Failed to load file from IPFS")
      toast({
        title: "Error",
        description: "Failed to load file from IPFS",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (initialHash) {
      loadFile(initialHash)
    }
  }, [initialHash])

  const handleLoadFile = () => {
    loadFile(hash)
  }

  const getFileIcon = () => {
    if (!metadata) return <FileText className="w-8 h-8 text-muted-foreground" />

    if (metadata.fileType === "image" || metadata.filename.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      return <ImageIcon className="w-8 h-8 text-blue-500" />
    } else {
      return <FileText className="w-8 h-8 text-green-500" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          IPFS File Viewer
        </CardTitle>
        <CardDescription>View files stored on the InterPlanetary File System</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {showHashInput && (
          <div className="space-y-2">
            <Label htmlFor="hash">IPFS Hash</Label>
            <div className="flex gap-2">
              <Input
                id="hash"
                placeholder="Enter IPFS hash (e.g., QmXXXXXX...)"
                value={hash}
                onChange={(e) => setHash(e.target.value)}
                disabled={loading}
              />
              <Button onClick={handleLoadFile} disabled={loading || !hash.trim()}>
                {loading ? "Loading..." : "Load"}
              </Button>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-3 border rounded-lg bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {metadata && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              {getFileIcon()}
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{metadata.filename}</p>
                <p className="text-sm text-muted-foreground">
                  {formatFileSize(metadata.size)} • {formatDate(metadata.uploadedAt)}
                </p>
              </div>
              <Badge variant="secondary">{metadata.category || metadata.fileType}</Badge>
            </div>

            {metadata.description && (
              <div className="space-y-1">
                <Label className="text-sm font-medium">Description</Label>
                <p className="text-sm text-muted-foreground p-2 bg-muted/50 rounded border">{metadata.description}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="text-xs text-muted-foreground">Uploaded By</Label>
                <p className="font-mono text-xs">{metadata.uploadedBy}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">File Type</Label>
                <p>{metadata.fileType}</p>
              </div>
            </div>
          </div>
        )}

        {fileUrl && (
          <div className="space-y-3">
            {metadata?.fileType === "image" && (
              <div className="border rounded-lg overflow-hidden">
                <img
                  src={fileUrl || "/placeholder.svg"}
                  alt={metadata.filename}
                  className="w-full h-auto max-h-64 object-contain"
                  onError={(e) => {
                    console.error("Image load error")
                    setError("Failed to load image")
                  }}
                />
              </div>
            )}

            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View in IPFS
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href={fileUrl} download={metadata?.filename}>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </a>
              </Button>
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">IPFS Hash</Label>
              <p className="font-mono text-xs break-all bg-muted/50 p-2 rounded border">{hash || initialHash}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
