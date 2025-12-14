export const runtime = "nodejs"

import { type NextRequest, NextResponse } from "next/server"
import { DatabaseOperations } from "@/lib/database"
import { verifyToken } from "@/lib/auth-utils"

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    const user = await verifyToken(token)

    if (!user || user.role !== "distributor") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const { batchId, destination, transportMode, estimatedDelivery, storageConditions, notes } = await request.json()

    if (!batchId || !destination) {
      return NextResponse.json({ success: false, message: "Batch ID and destination are required" }, { status: 400 })
    }

    const batch = await DatabaseOperations.getBatchById(batchId)
    if (!batch) {
      return NextResponse.json({ success: false, message: "Batch not found" }, { status: 404 })
    }

    // Create shipment record
    const shipmentId = `ship_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const shipmentData = {
      id: shipmentId,
      batch_id: batchId,
      distributor_id: user.userId,
      origin_location: {
        latitude: batch.location.latitude,
        longitude: batch.location.longitude,
        address: "Manufacturing Facility",
      },
      destination_location: {
        latitude: 28.6139, // Default coordinates
        longitude: 77.209,
        address: destination,
      },
      shipment_date: new Date(),
      expected_delivery: estimatedDelivery
        ? new Date(estimatedDelivery)
        : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      transport_conditions: {
        temperature_range: storageConditions || "15-25°C",
        humidity_range: "40-60%",
      },
      tracking_checkpoints: [
        {
          timestamp: new Date(),
          location: { latitude: batch.location.latitude, longitude: batch.location.longitude },
          status: "Shipment created",
        },
      ],
      created_at: new Date(),
    }

    await DatabaseOperations.createShipmentRecord(shipmentData)

    // Update batch status to shipped
    await DatabaseOperations.updateBatchStatus(batchId, "shipped")

    return NextResponse.json({
      success: true,
      message: "Shipment created successfully",
      data: {
        shipmentId,
        batchId,
        destination,
        transportMode,
        estimatedDelivery: shipmentData.expected_delivery,
        status: "in-transit",
      },
    })
  } catch (error) {
    console.error("Create shipment error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
