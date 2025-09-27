// IPFS utility functions
import { ipfs } from "./ipfs"

export interface UploadResult {
  fileHash: string
  metadataHash: string
  fileUrl: string
  metadataUrl: string
}

export interface FileMetadata {
  filename: string
  fileType: "image" | "document" | "lab-report"
  size: number
  uploadedBy: string
  uploadedAt: string
  description?: string
  category?: string
  batchId?: string
  processingStage?: string
}

// Upload file with metadata to IPFS
export async function uploadFileWithMetadata(
  file: File,
  metadata: Partial<FileMetadata>,
  userId: string,
): Promise<UploadResult> {
  try {
    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Upload file to IPFS
    const fileHash = await ipfs.uploadFile(buffer, file.name)

    // Create complete metadata
    const completeMetadata: FileMetadata = {
      filename: file.name,
      fileType: metadata.fileType || "document",
      size: file.size,
      uploadedBy: userId,
      uploadedAt: new Date().toISOString(),
      ...metadata,
    }

    // Upload metadata to IPFS
    const metadataHash = await ipfs.uploadJSON(completeMetadata)

    // Pin both files
    await ipfs.pinFile(fileHash)
    await ipfs.pinFile(metadataHash)

    return {
      fileHash,
      metadataHash,
      fileUrl: ipfs.getFileURL(fileHash),
      metadataUrl: ipfs.getFileURL(metadataHash),
    }
  } catch (error) {
    console.error("Error uploading file with metadata:", error)
    throw new Error("Failed to upload file to IPFS")
  }
}

// Retrieve file metadata from IPFS
export async function getFileMetadata(metadataHash: string): Promise<FileMetadata | null> {
  try {
    const data = await ipfs.getFile(metadataHash)
    return JSON.parse(data.toString()) as FileMetadata
  } catch (error) {
    console.error("Error retrieving file metadata:", error)
    return null
  }
}

// Create a batch document with all related files
export async function createBatchDocument(batchData: {
  batchId: string
  farmerId: string
  herbType: string
  photos: string[] // IPFS hashes
  documents: string[] // IPFS hashes
  labReports?: string[] // IPFS hashes
}): Promise<string> {
  try {
    const batchDocument = {
      ...batchData,
      createdAt: new Date().toISOString(),
      documentType: "batch-record",
      version: "1.0",
    }

    const documentHash = await ipfs.uploadJSON(batchDocument)
    await ipfs.pinFile(documentHash)

    return documentHash
  } catch (error) {
    console.error("Error creating batch document:", error)
    throw new Error("Failed to create batch document")
  }
}

// Verify file integrity
export async function verifyFileIntegrity(hash: string, expectedSize?: number): Promise<boolean> {
  try {
    const fileData = await ipfs.getFile(hash)

    if (expectedSize && fileData.length !== expectedSize) {
      return false
    }

    return true
  } catch (error) {
    console.error("Error verifying file integrity:", error)
    return false
  }
}

// Get file preview URL for different file types
export function getFilePreviewUrl(hash: string, fileType: string): string {
  const baseUrl = ipfs.getFileURL(hash)

  // For images, return direct URL
  if (fileType === "image") {
    return baseUrl
  }

  // For PDFs, use a PDF viewer
  if (fileType === "document" && hash.includes(".pdf")) {
    return `https://docs.google.com/viewer?url=${encodeURIComponent(baseUrl)}&embedded=true`
  }

  return baseUrl
}

// Batch upload multiple files
export async function batchUploadFiles(
  files: File[],
  metadata: Partial<FileMetadata>,
  userId: string,
): Promise<UploadResult[]> {
  const results: UploadResult[] = []

  for (const file of files) {
    try {
      const result = await uploadFileWithMetadata(file, metadata, userId)
      results.push(result)
    } catch (error) {
      console.error(`Failed to upload ${file.name}:`, error)
      // Continue with other files
    }
  }

  return results
}
