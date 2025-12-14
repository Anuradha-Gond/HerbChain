export const runtime = "nodejs"


import { type NextRequest, NextResponse } from "next/server"
import { DatabaseOperations } from "@/lib/database"
import { verifyToken } from "@/lib/auth-utils"

export async function POST(request: NextRequest) {
  try {
    const { blockchain } = await import("@/lib/blockchain")
    const { ipfs } = await import("@/lib/ipfs")
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    const user = await verifyToken(token)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const herbType = formData.get("herbType") as string
    const quantity = Number.parseFloat(formData.get("quantity") as string)
    const harvestDate = formData.get("harvestDate") as string
    const latitude = Number.parseFloat(formData.get("latitude") as string)
    const longitude = Number.parseFloat(formData.get("longitude") as string)
    const cultivationMethod = formData.get("cultivationMethod") as string
    const photos = formData.getAll("photos") as File[]

    // Upload photos to IPFS
    const photoHashes = []
    for (const photo of photos) {
      const buffer = Buffer.from(await photo.arrayBuffer())
      const hash = await ipfs.uploadFile(buffer, photo.name)
      photoHashes.push(hash)
    }

    // Create batch ID
    const batchId = `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const batchData = {
      id: batchId,
      farmer_id: user.userId,
      farm_id: `farm_${user.userId}`, // Default farm ID
      herb_type: herbType,
      quantity_kg: quantity,
      harvest_date: new Date(harvestDate),
      cultivation_method: cultivationMethod as "organic" | "conventional",
      location: { latitude, longitude },
      photos: photoHashes,
      status: "harvested" as const,
      created_at: new Date(),
      updated_at: new Date(),
    }

    const batch = await DatabaseOperations.createBatch(batchData)

    // Register on blockchain
    await blockchain.connect()
    const blockchainHash = await blockchain.registerBatch({
      batchId,
      farmerId: user.userId,
      herbType,
      quantity,
      harvestDate,
      location: { latitude, longitude },
      ipfsHash: photoHashes[0], // Primary photo
    })
    await blockchain.disconnect()

    await DatabaseOperations.updateBatchStatus(batchId, "verified")

    return NextResponse.json({
      success: true,
      batchId,
      blockchainHash,
      photoHashes,
    })
  } catch (error) {
    console.error("Batch creation error:", error)
    return NextResponse.json({ error: "Failed to create batch" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    const user = await verifyToken(token)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const farmerId = searchParams.get("farmerId")

    let batches

    if (user.role === "farmer") {
      batches = await DatabaseOperations.getBatchesByFarmer(user.userId)
    } else if (farmerId) {
      batches = await DatabaseOperations.getBatchesByFarmer(farmerId)
    } else {
      batches = await DatabaseOperations.getAllBatches()
    }

    return NextResponse.json({ success: true, batches })
  } catch (error) {
    console.error("Batch fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch batches" }, { status: 500 })
  }
}
