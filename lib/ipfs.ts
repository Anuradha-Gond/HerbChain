import crypto from "crypto"

const PINATA_API_KEY = process.env.PINATA_API_KEY!
const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET_API_KEY!
const PINATA_BASE_URL = "https://api.pinata.cloud"

if (!PINATA_API_KEY || !PINATA_SECRET_API_KEY) {
  throw new Error("Pinata API keys are missing in environment variables")
}

class IPFSService {
  // Upload file buffer to IPFS (Pinata)
  async uploadFile(buffer: Buffer, filename: string): Promise<string> {
    const formData = new FormData()

    formData.append(
      "file",
      new Blob([buffer]),
      filename || `file_${crypto.randomUUID()}`
    )

    const res = await fetch(`${PINATA_BASE_URL}/pinning/pinFileToIPFS`, {
      method: "POST",
      headers: {
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_API_KEY,
      },
      body: formData,
    })

    if (!res.ok) {
      throw new Error("Pinata file upload failed")
    }

    const data = await res.json()
    return data.IpfsHash
  }

  // Upload JSON to IPFS
  async uploadJSON(data: any): Promise<string> {
    const res = await fetch(`${PINATA_BASE_URL}/pinning/pinJSONToIPFS`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_API_KEY,
      },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      throw new Error("Pinata JSON upload failed")
    }

    const result = await res.json()
    return result.IpfsHash
  }

  // Public gateway URL
  getFileURL(hash: string): string {
    return `https://gateway.pinata.cloud/ipfs/${hash}`
  }

  // Pin already handled by Pinata (noop for compatibility)
  async pinFile(_hash: string): Promise<void> {
    return
  }
}

export const ipfs = new IPFSService()
