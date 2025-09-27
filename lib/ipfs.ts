// IPFS integration for storing documents and images
import { create, type IPFSHTTPClient } from "ipfs-http-client"

export class IPFSService {
  private client: IPFSHTTPClient

  constructor() {
    // Connect to IPFS node (can be local or remote like Infura)
    this.client = create({
      host: process.env.IPFS_HOST || "localhost",
      port: Number.parseInt(process.env.IPFS_PORT || "5001"),
      protocol: process.env.IPFS_PROTOCOL || "http",
    })
  }

  // Upload file to IPFS
  async uploadFile(file: Buffer, filename: string): Promise<string> {
    try {
      const result = await this.client.add({
        path: filename,
        content: file,
      })
      return result.cid.toString()
    } catch (error) {
      console.error("Failed to upload file to IPFS:", error)
      throw error
    }
  }

  // Upload JSON data to IPFS
  async uploadJSON(data: any): Promise<string> {
    try {
      const jsonString = JSON.stringify(data, null, 2)
      const result = await this.client.add(jsonString)
      return result.cid.toString()
    } catch (error) {
      console.error("Failed to upload JSON to IPFS:", error)
      throw error
    }
  }

  // Retrieve file from IPFS
  async getFile(hash: string): Promise<Buffer> {
    try {
      const chunks = []
      for await (const chunk of this.client.cat(hash)) {
        chunks.push(chunk)
      }
      return Buffer.concat(chunks)
    } catch (error) {
      console.error("Failed to retrieve file from IPFS:", error)
      throw error
    }
  }

  // Get file URL for browser access
  getFileURL(hash: string): string {
    const gateway = process.env.IPFS_GATEWAY || "https://ipfs.io/ipfs"
    return `${gateway}/${hash}`
  }

  // Pin file to ensure it stays available
  async pinFile(hash: string): Promise<void> {
    try {
      await this.client.pin.add(hash)
    } catch (error) {
      console.error("Failed to pin file:", error)
      throw error
    }
  }
}

// Singleton instance
export const ipfs = new IPFSService()
